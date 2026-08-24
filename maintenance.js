// ==========================================
// KHLLO NET
// maintenance.js
// إنشاء الطلبات - Realtime Database
// ==========================================

import { db, auth } from "./firebase.js";

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// المستخدم الحالي
// ==========================================

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        console.log("المستخدم الحالي:", user.uid);

    } else {

        currentUser = null;

        console.log("لا يوجد مستخدم مسجل دخول");

    }

});


// ==========================================
// إظهار النموذج
// ==========================================

window.showForm = function(type) {

    const box = document.getElementById("formArea");

    if (!box) {
        console.error("formArea غير موجود");
        return;
    }


    // ======================================
    // صيانة
    // ======================================

    if (type === "maintenance") {

        box.innerHTML = `

            <h2>🛠 طلب صيانة</h2>

            <label>الاسم الثلاثي للزبون</label>
            <input id="name" type="text">

            <label>الرقم الوطني</label>
            <input id="national" type="text">

            <label>مشكلة الزبون</label>
            <textarea id="problem"></textarea>

            <label>الموقع</label>
            <input id="location" type="text">

            <label>رقم الهاتف</label>
            <input id="phone" type="text">

            <label>
                <input type="checkbox" id="dishCheck">
                عيار الصحن
            </label>

            <div id="dishBox"></div>

            <label>النقل</label>
            <input id="transfer" type="text">

            <button id="saveMaintenanceBtn">
                حفظ الطلب
            </button>
        `;


        document
            .getElementById("dishCheck")
            .addEventListener("change", dishOption);


        document
            .getElementById("saveMaintenanceBtn")
            .addEventListener(
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

            <h2>${title}</h2>

            <label>اسم الزبون الثلاثي</label>
            <input id="name" type="text">

            <label>الرقم الوطني</label>
            <input id="national" type="text">

            <label>الموقع</label>
            <input id="location" type="text">

            <label>رقم الهاتف</label>
            <input id="phone" type="text">

            ${
                type === "install"
                    ? `
                        <label>نوع التركيبة</label>
                        <input
                            id="installType"
                            type="text"
                        >
                    `
                    : ""
            }

            <label>المبلغ</label>
            <input
                id="price"
                type="number"
                min="0"
            >

            <button id="saveInstallBtn">
                حفظ الطلب
            </button>
        `;


        document
            .getElementById("saveInstallBtn")
            .addEventListener(
                "click",
                () => saveInstallation(type)
            );

    }

};


// ==========================================
// عيار الصحن
// ==========================================

function dishOption() {

    const check =
        document.getElementById("dishCheck");

    const box =
        document.getElementById("dishBox");


    if (!check || !box) return;


    if (check.checked) {

        box.innerHTML = `

            <label>إشارة الصحن</label>

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

        alert("يجب تسجيل الدخول أولاً");

        return false;

    }

    return true;

}


// ==========================================
// معلومات الموظف
// ==========================================

function employeeData() {

    return {

        uid: currentUser?.uid || "",

        email:
            currentUser?.email || "",

        name:
            localStorage.getItem("employeeName")
            || "غير معروف"

    };

}


// ==========================================
// حفظ طلب الصيانة
// ==========================================

async function saveMaintenance() {

    if (!checkUser()) return;


    try {

        const name = value("name");
        const national = value("national");
        const problem = value("problem");
        const location = value("location");
        const phone = value("phone");
        const transfer = value("transfer");

        const dishCheck =
            document.getElementById("dishCheck");

        const dishSignal =
            value("dishSignal");


        // التحقق

        if (!name) {
            alert("يرجى إدخال اسم الزبون");
            return;
        }

        if (!national) {
            alert("يرجى إدخال الرقم الوطني");
            return;
        }

        if (!problem) {
            alert("يرجى كتابة مشكلة الزبون");
            return;
        }

        if (!location) {
            alert("يرجى إدخال الموقع");
            return;
        }

        if (!phone) {
            alert("يرجى إدخال رقم الهاتف");
            return;
        }


        const employee =
            employeeData();


        // إنشاء مرجع جديد

        const requestRef =
            push(ref(db, "requests"));


        const requestData = {

            id: requestRef.key,

            type: "maintenance",

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

            // الحالة
            status: "new",

            // مقدم الطلب
            createdBy: employee,

            employee:
                employee.name,

            uid:
                employee.uid,

            email:
                employee.email,

            createdAt:
                Date.now(),

            receivedAt: null,

            receivedBy: null,

            readyAt: null,

            readyBy: null,

            execution: null

        };


        await set(
            requestRef,
            requestData
        );


        console.log(
            "تم إنشاء طلب الصيانة:",
            requestRef.key
        );


        alert(
            "تم إرسال طلب الصيانة بنجاح"
        );


        const box =
            document.getElementById("formArea");


        if (box) {

            box.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    <h2>
                        ✅ تم إرسال الطلب
                    </h2>

                    <p>
                        رقم الطلب:
                        <strong>
                            ${requestRef.key}
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


    } catch (error) {

        console.error(error);

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


        // التحقق

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


        const employee =
            employeeData();


        const requestRef =
            push(ref(db, "requests"));


        const requestData = {

            id: requestRef.key,

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

            status: "new",

            createdBy: employee,

            employee:
                employee.name,

            uid:
                employee.uid,

            email:
                employee.email,

            createdAt:
                Date.now(),

            receivedAt: null,

            receivedBy: null,

            readyAt: null,

            readyBy: null,

            execution: null

        };


        await set(
            requestRef,
            requestData
        );


        console.log(
            "تم إنشاء الطلب:",
            requestRef.key
        );


        alert(
            type === "install"
                ? "تم إرسال طلب التركيبة بنجاح"
                : "تم إرسال طلب القلبة بنجاح"
        );


        const box =
            document.getElementById("formArea");


        if (box) {

            box.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    <h2>
                        ✅ تم إرسال الطلب
                    </h2>

                    <p>
                        رقم الطلب:
                        <strong>
                            ${requestRef.key}
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


    } catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء إرسال الطلب:\n" +
            error.message
        );

    }

}


// ==========================================
// جعل الدوال متاحة
// ==========================================

window.saveMaintenance =
    saveMaintenance;

window.saveInstallation =
    saveInstallation;
