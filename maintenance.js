// ==========================================
// KHLLO NET
// maintenance.js
// إنشاء الطلبات وحفظها في Firestore
// ==========================================

import { firestore, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
// إظهار النموذج حسب نوع الطلب
// ==========================================

window.showForm = function(type) {

    const box = document.getElementById("formArea");

    if (!box) {
        console.error("لم يتم العثور على formArea");
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


        const dishCheck = document.getElementById("dishCheck");

        if (dishCheck) {
            dishCheck.addEventListener("change", dishOption);
        }


        document
            .getElementById("saveMaintenanceBtn")
            .addEventListener("click", saveMaintenance);

        return;
    }


    // ======================================
    // تركيبة / قلبة
    // ======================================

    if (type === "install" || type === "transfer") {

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
                ?
                `
                <label>نوع التركيبة</label>
                <input id="installType" type="text">
                `
                :
                ""
            }

            <label>المبلغ</label>
            <input id="price" type="number" min="0">

            <button id="saveInstallBtn">
                حفظ الطلب
            </button>
        `;


        document
            .getElementById("saveInstallBtn")
            .addEventListener("click", () => {
                saveInstallation(type);
            });

    }

};


// ==========================================
// خيار عيار الصحن
// ==========================================

function dishOption() {

    const check = document.getElementById("dishCheck");
    const box = document.getElementById("dishBox");

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
// قراءة قيمة عنصر
// ==========================================

function value(id) {

    const element = document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}


// ==========================================
// التحقق من المستخدم
// ==========================================

function checkUser() {

    if (!currentUser) {

        alert("يجب تسجيل الدخول أولاً");

        return false;

    }

    return true;

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


        // ==============================
        // التحقق
        // ==============================

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


        // ==============================
        // إنشاء الطلب
        // ==============================

        const requestData = {

            type: "maintenance",

            name: name,

            national: national,

            problem: problem,

            location: location,

            phone: phone,

            transfer: transfer,

            dish: dishCheck
                ? dishCheck.checked
                : false,

            dishSignal: dishSignal,

            // حالة الطلب الجديدة
            status: "new",

            // بيانات مقدم الطلب
            createdBy: {
                uid: currentUser.uid,

                email:
                    currentUser.email || "",

                name:
                    localStorage.getItem("employeeName")
                    || "غير معروف"
            },

            // للتوافق مع النظام السابق
            uid: currentUser.uid,

            email:
                currentUser.email || "",

            employee:
                localStorage.getItem("employeeName")
                || "غير معروف",

            createdAt: serverTimestamp()

        };


        console.log(
            "بيانات طلب الصيانة:",
            requestData
        );


        // ==============================
        // الحفظ
        // ==============================

        const docRef = await addDoc(
            collection(firestore, "requests"),
            requestData
        );


        console.log(
            "تم إنشاء الطلب:",
            docRef.id
        );


        alert("تم إرسال طلب الصيانة بنجاح");


        // تنظيف النموذج

        const box =
            document.getElementById("formArea");

        if (box) {
            box.innerHTML = `
                <div style="
                    text-align:center;
                    padding:30px;
                ">
                    <h2>✅ تم إرسال الطلب</h2>

                    <p>
                        رقم الطلب:
                        <strong>${docRef.id}</strong>
                    </p>

                    <p>
                        حالة الطلب:
                        <strong>طلب جديد</strong>
                    </p>
                </div>
            `;
        }


    } catch (error) {

        console.error(
            "خطأ أثناء حفظ طلب الصيانة:",
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


    try {

        const name = value("name");
        const national = value("national");
        const location = value("location");
        const phone = value("phone");
        const priceValue = value("price");


        const installType =
            value("installType");


        // ==============================
        // التحقق
        // ==============================

        if (!name) {

            alert("يرجى إدخال اسم الزبون");

            return;

        }


        if (!national) {

            alert("يرجى إدخال الرقم الوطني");

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


        if (!priceValue) {

            alert("يرجى إدخال المبلغ");

            return;

        }


        // ==============================
        // نوع الطلب
        // ==============================

        let requestType = "";

        if (type === "install") {

            requestType = "install";

        } else {

            requestType = "transfer";

        }


        // ==============================
        // البيانات
        // ==============================

        const requestData = {

            type: requestType,

            name: name,

            national: national,

            location: location,

            phone: phone,

            price: Number(priceValue),

            // نوع التركيبة موجود فقط للتركيبة
            installType:
                type === "install"
                    ? installType
                    : "",

            status: "new",

            // مقدم الطلب
            createdBy: {

                uid: currentUser.uid,

                email:
                    currentUser.email || "",

                name:
                    localStorage.getItem("employeeName")
                    || "غير معروف"

            },

            // توافق مع النظام القديم
            uid: currentUser.uid,

            email:
                currentUser.email || "",

            employee:
                localStorage.getItem("employeeName")
                || "غير معروف",

            createdAt: serverTimestamp()

        };


        console.log(
            "بيانات الطلب:",
            requestData
        );


        // ==============================
        // Firestore
        // ==============================

        const docRef = await addDoc(

            collection(
                firestore,
                "requests"
            ),

            requestData

        );


        console.log(
            "تم إنشاء الطلب:",
            docRef.id
        );


        alert(
            type === "install"
                ? "تم إرسال طلب التركيبة بنجاح"
                : "تم إرسال طلب القلبة بنجاح"
        );


        // ==============================
        // رسالة نجاح
        // ==============================

        const box =
            document.getElementById("formArea");


        if (box) {

            box.innerHTML = `

                <div style="
                    text-align:center;
                    padding:30px;
                ">

                    <h2>
                        ✅ تم إرسال الطلب
                    </h2>

                    <p>
                        رقم الطلب:
                        <strong>
                            ${docRef.id}
                        </strong>
                    </p>

                    <p>
                        حالة الطلب:
                        <strong>
                            طلب جديد
                        </strong>
                    </p>

                </div>

            `;

        }


    } catch (error) {

        console.error(
            "خطأ أثناء حفظ الطلب:",
            error
        );


        alert(
            "حدث خطأ أثناء إرسال الطلب:\n" +
            error.message
        );

    }

}


// ==========================================
// تصدير الدوال إذا احتجناها لاحقًا
// ==========================================

window.saveMaintenance =
    saveMaintenance;

window.saveInstallation =
    saveInstallation;
