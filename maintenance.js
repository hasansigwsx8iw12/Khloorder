// ==========================================
// KHLLO NET
// maintenance.js
// إنشاء الطلبات - Realtime Database
// ==========================================

import { db, auth } from "./firebase.js";

import {
    ref,
    push,
    set,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// المستخدم الحالي
// ==========================================

let currentUser = null;


// ==========================================
// الموظفون
// ==========================================

let employees = {};


// ==========================================
// تسجيل الدخول
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (user) {

        currentUser = user;

        console.log(
            "المستخدم الحالي:",
            user.uid
        );

        // تحميل الموظفين
        await loadEmployees();

    } else {

        currentUser = null;

        console.log(
            "لا يوجد مستخدم مسجل دخول"
        );

    }

});


// ==========================================
// تحميل الموظفين
// ==========================================

async function loadEmployees() {

    try {

        const snapshot =
            await get(
                ref(db, "employees")
            );


        if (!snapshot.exists()) {

            employees = {};

            console.log(
                "لا يوجد موظفون"
            );

            return;

        }


        employees =
            snapshot.val() || {};


        console.log(
            "تم تحميل الموظفين:",
            employees
        );


    } catch (error) {

        console.error(
            "خطأ تحميل الموظفين:",
            error
        );

        employees = {};

    }

}


// ==========================================
// التحقق من المدير
// ==========================================

function isAdmin() {

    return (
        localStorage.getItem("role") === "admin"
    );

}


// ==========================================
// إظهار النموذج
// ==========================================

window.showForm = function(type) {

    // ======================================
    // حماية
    // ======================================

    if (!isAdmin()) {

        alert(
            "❌ ليس لديك صلاحية إضافة طلب"
        );

        return;

    }


    const box =
        document.getElementById(
            "formArea"
        );


    if (!box) {

        console.error(
            "formArea غير موجود"
        );

        return;

    }


    // ======================================
    // صيانة
    // ======================================

    if (type === "maintenance") {

        box.innerHTML = `

            <h2>🛠 طلب صيانة</h2>


            <label>
                الاسم الثلاثي للزبون
            </label>

            <input
                id="name"
                type="text"
                placeholder="اسم الزبون"
            >


            <label>
                الرقم الوطني
            </label>

            <input
                id="national"
                type="text"
                placeholder="الرقم الوطني"
            >


            <label>
                مشكلة الزبون
            </label>

            <textarea
                id="problem"
                placeholder="اكتب مشكلة الزبون"
            ></textarea>


            <label>
                الموقع
            </label>

            <input
                id="location"
                type="text"
                placeholder="موقع الزبون"
            >


            <label>
                رقم الهاتف
            </label>

            <input
                id="phone"
                type="text"
                placeholder="رقم الهاتف"
            >


            <label>
                المكلف بالطلب
            </label>

            ${createEmployeeSelect()}


            <label>
                <input
                    type="checkbox"
                    id="dishCheck"
                >

                عيار الصحن
            </label>


            <div id="dishBox"></div>


            <label>
                النقل
            </label>

            <input
                id="transfer"
                type="text"
                placeholder="النقل إن وجد"
            >


            <button
                id="saveMaintenanceBtn"
            >

                <i class="fa-solid fa-floppy-disk"></i>

                حفظ الطلب

            </button>

        `;


        document
            .getElementById("dishCheck")
            ?.addEventListener(
                "change",
                dishOption
            );


        document
            .getElementById("saveMaintenanceBtn")
            ?.addEventListener(
                "click",
                saveMaintenance
            );


        return;

    }


    // ======================================
    // تركيبة / قلبة
    // ======================================

    if (
        type === "install" ||
        type === "transfer"
    ) {

        const title =
            type === "install"
                ? "📡 طلب تركيبة"
                : "🔄 طلب قلبة";


        box.innerHTML = `

            <h2>
                ${title}
            </h2>


            <label>
                اسم الزبون الثلاثي
            </label>

            <input
                id="name"
                type="text"
                placeholder="اسم الزبون"
            >


            <label>
                الرقم الوطني
            </label>

            <input
                id="national"
                type="text"
                placeholder="الرقم الوطني"
            >


            <label>
                الموقع
            </label>

            <input
                id="location"
                type="text"
                placeholder="موقع الزبون"
            >


            <label>
                رقم الهاتف
            </label>

            <input
                id="phone"
                type="text"
                placeholder="رقم الهاتف"
            >


            ${
                type === "install"

                    ? `

                        <label>
                            نوع التركيبة
                        </label>

                        <input
                            id="installType"
                            type="text"
                            placeholder="مثلاً تركيب جديد"
                        >

                    `

                    : ""
            }


            <label>
                المبلغ
            </label>

            <input
                id="price"
                type="number"
                min="0"
                placeholder="المبلغ"
            >


            <label>
                المكلف بالطلب
            </label>

            ${createEmployeeSelect()}


            <button
                id="saveInstallBtn"
            >

                <i class="fa-solid fa-floppy-disk"></i>

                حفظ الطلب

            </button>

        `;


        document
            .getElementById("saveInstallBtn")
            ?.addEventListener(
                "click",
                () => saveInstallation(type)
            );

    }

};


// ==========================================
// إنشاء قائمة الموظفين
// ==========================================

function createEmployeeSelect() {

    let options = `

        <option value="">
            اختر الموظف المكلف
        </option>

    `;


    Object.entries(employees || {})
        .forEach(([uid, employee]) => {

            if (!employee) return;


            const name =
                employee.name ||
                "موظف بدون اسم";


            const role =
                employee.role === "admin"
                    ? "مدير"
                    : "موظف";


            options += `

                <option
                    value="${escapeHtml(uid)}"
                >

                    ${escapeHtml(name)}
                    - ${role}

                </option>

            `;

        });


    return `

        <select id="assignedTo">

            ${options}

        </select>

    `;

}


// ==========================================
// الحصول على الموظف المكلف
// ==========================================

function getAssignedEmployee() {

    const select =
        document.getElementById(
            "assignedTo"
        );


    if (!select) {

        return null;

    }


    const uid =
        select.value;


    if (!uid) {

        return null;

    }


    const employee =
        employees[uid];


    if (!employee) {

        return null;

    }


    return {

        uid: uid,

        name:
            employee.name || "غير معروف",

        email:
            employee.email || "",

        role:
            employee.role || "employee"

    };

}


// ==========================================
// عيار الصحن
// ==========================================

function dishOption() {

    const check =
        document.getElementById(
            "dishCheck"
        );


    const box =
        document.getElementById(
            "dishBox"
        );


    if (!check || !box) return;


    if (check.checked) {

        box.innerHTML = `

            <label>
                إشارة الصحن
            </label>

            <input
                id="dishSignal"
                type="text"
                placeholder="مثلاً 80%"
            >

        `;

    } else {

        box.innerHTML = "";

    }

}


// ==========================================
// قراءة قيمة
// ==========================================

function value(id) {

    const element =
        document.getElementById(id);


    return element
        ? element.value.trim()
        : "";

}


// ==========================================
// التحقق من تسجيل الدخول
// ==========================================

function checkUser() {

    if (!currentUser) {

        alert(
            "يجب تسجيل الدخول أولاً"
        );

        return false;

    }


    return true;

}


// ==========================================
// التحقق من صلاحية Admin
// ==========================================

function checkAdmin() {

    if (!isAdmin()) {

        alert(
            "❌ ليس لديك صلاحية إضافة طلب"
        );

        return false;

    }


    return true;

}


// ==========================================
// معلومات الموظف
// ==========================================

function employeeData() {

    return {

        uid:
            currentUser?.uid || "",

        email:
            currentUser?.email || "",

        name:
            localStorage.getItem(
                "employeeName"
            ) || "غير معروف"

    };

}


// ==========================================
// حفظ طلب الصيانة
// ==========================================

async function saveMaintenance() {

    if (!checkUser()) return;

    if (!checkAdmin()) return;


    try {

        const name =
            value("name");


        const national =
            value("national");


        const problem =
            value("problem");


        const location =
            value("location");


        const phone =
            value("phone");


        const transfer =
            value("transfer");


        const dishCheck =
            document.getElementById(
                "dishCheck"
            );


        const dishSignal =
            value("dishSignal");


        // ==================================
        // المكلف
        // ==================================

        const assignedTo =
            getAssignedEmployee();


        // ==================================
        // التحقق
        // ==================================

        if (!name) {

            alert(
                "يرجى إدخال اسم الزبون"
            );

            return;

        }


        if (!national) {

            alert(
                "يرجى إدخال الرقم الوطني"
            );

            return;

        }


        if (!problem) {

            alert(
                "يرجى كتابة مشكلة الزبون"
            );

            return;

        }


        if (!location) {

            alert(
                "يرجى إدخال الموقع"
            );

            return;

        }


        if (!phone) {

            alert(
                "يرجى إدخال رقم الهاتف"
            );

            return;

        }


        if (!assignedTo) {

            alert(
                "يرجى اختيار الموظف المكلف بالطلب"
            );

            return;

        }


        const employee =
            employeeData();


        // ==================================
        // إنشاء الطلب
        // ==================================

        const requestRef =
            push(
                ref(
                    db,
                    "requests"
                )
            );


        const now =
            Date.now();


        const requestData = {

            id:
                requestRef.key,


            type:
                "maintenance",


            name,

            national,

            problem,

            location,

            phone,

            transfer,


            dish:
                dishCheck
                    ? dishCheck.checked
                    : false,


            dishSignal,


            // ==================================
            // الحالة
            // ==================================

            status:
                "new",


            // ==================================
            // مقدم الطلب
            // ==================================

            createdBy:
                employee,


            employee:
                employee.name,


            uid:
                employee.uid,


            email:
                employee.email,


            // ==================================
            // المكلف
            // ==================================

            assignedTo:


                {

                    uid:
                        assignedTo.uid,

                    name:
                        assignedTo.name,

                    email:
                        assignedTo.email,

                    role:
                        assignedTo.role

                },


            assignedAt:
                now,


            // ==================================
            // التواريخ
            // ==================================

            createdAt:
                now,


            receivedAt:
                null,


            receivedBy:
                null,


            readyAt:
                null,


            readyBy:
                null,


            execution:
                null

        };


        await set(
            requestRef,
            requestData
        );


        console.log(
            "✅ تم إنشاء طلب الصيانة:",
            requestRef.key
        );


        alert(
            "✅ تم إرسال طلب الصيانة بنجاح"
        );


        showSuccess(
            requestRef.key,
            assignedTo.name
        );


    } catch (error) {

        console.error(
            "❌ خطأ إنشاء الصيانة:",
            error
        );


        alert(

            "حدث خطأ أثناء إرسال الطلب:\n" +

            error.message

        );

    }

}


// ==========================================
// حفظ التركيبة والقلبة
// ==========================================

async function saveInstallation(type) {

    if (!checkUser()) return;

    if (!checkAdmin()) return;


    try {

        const name =
            value("name");


        const national =
            value("national");


        const location =
            value("location");


        const phone =
            value("phone");


        const price =
            value("price");


        const installType =
            value("installType");


        // ==================================
        // المكلف
        // ==================================

        const assignedTo =
            getAssignedEmployee();


        // ==================================
        // التحقق
        // ==================================

        if (!name) {

            alert(
                "يرجى إدخال اسم الزبون"
            );

            return;

        }


        if (!national) {

            alert(
                "يرجى إدخال الرقم الوطني"
            );

            return;

        }


        if (!location) {

            alert(
                "يرجى إدخال الموقع"
            );

            return;

        }


        if (!phone) {

            alert(
                "يرجى إدخال رقم الهاتف"
            );

            return;

        }


        if (!price) {

            alert(
                "يرجى إدخال المبلغ"
            );

            return;

        }


        if (
            type === "install" &&
            !installType
        ) {

            alert(
                "يرجى إدخال نوع التركيبة"
            );

            return;

        }


        if (!assignedTo) {

            alert(
                "يرجى اختيار الموظف المكلف بالطلب"
            );

            return;

        }


        const employee =
            employeeData();


        const requestRef =
            push(
                ref(
                    db,
                    "requests"
                )
            );


        const now =
            Date.now();


        const requestData = {

            id:
                requestRef.key,


            type,


            name,

            national,

            location,

            phone,


            installType:

                type === "install"

                    ? installType

                    : "",


            price:
                Number(price),


            // ==================================
            // الحالة
            // ==================================

            status:
                "new",


            // ==================================
            // مقدم الطلب
            // ==================================

            createdBy:
                employee,


            employee:
                employee.name,


            uid:
                employee.uid,


            email:
                employee.email,


            // ==================================
            // المكلف
            // ==================================

            assignedTo:

                {

                    uid:
                        assignedTo.uid,

                    name:
                        assignedTo.name,

                    email:
                        assignedTo.email,

                    role:
                        assignedTo.role

                },


            assignedAt:
                now,


            // ==================================
            // التواريخ
            // ==================================

            createdAt:
                now,


            receivedAt:
                null,


            receivedBy:
                null,


            readyAt:
                null,


            readyBy:
                null,


            execution:
                null

        };


        await set(
            requestRef,
            requestData
        );


        console.log(
            "✅ تم إنشاء الطلب:",
            requestRef.key
        );


        alert(

            type === "install"

                ? "✅ تم إرسال طلب التركيبة بنجاح"

                : "✅ تم إرسال طلب القلبة بنجاح"

        );


        showSuccess(
            requestRef.key,
            assignedTo.name
        );


    } catch (error) {

        console.error(
            "❌ خطأ إنشاء الطلب:",
            error
        );


        alert(

            "حدث خطأ أثناء إرسال الطلب:\n" +

            error.message

        );

    }

}


// ==========================================
// رسالة نجاح
// ==========================================

function showSuccess(
    requestId,
    assignedName
) {

    const box =
        document.getElementById(
            "formArea"
        );


    if (!box) return;


    box.innerHTML = `

        <div
            style="
                text-align:center;
                padding:30px;
            "
        >

            <div
                style="
                    font-size:55px;
                    margin-bottom:15px;
                "
            >
                ✅
            </div>


            <h2>
                تم إرسال الطلب بنجاح
            </h2>


            <p>
                رقم الطلب:
                <strong>
                    ${escapeHtml(requestId)}
                </strong>
            </p>


            <p>
                المكلف:
                <strong>
                    ${escapeHtml(assignedName)}
                </strong>
            </p>


            <p>
                الحالة:
                <strong>
                    طلب جديد
                </strong>
            </p>

        </div>

    `;

}


// ==========================================
// حماية HTML
// ==========================================

function escapeHtml(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// جعل الدوال متاحة
// ==========================================

window.saveMaintenance =
    saveMaintenance;


window.saveInstallation =
    saveInstallation;
