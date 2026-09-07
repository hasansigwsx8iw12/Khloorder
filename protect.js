import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// =====================================
// الصفحات التي تحتاج مدير فقط
// =====================================

const adminPages = [
    "employees.html",
    "users.html",
    "accounts.html"
];


// =====================================
// التحقق من تسجيل الدخول والصلاحية
// =====================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "../login.html";
        return;
    }

    try {

        // حفظ معلومات المستخدم
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("email", user.email || "");


        // جلب بيانات الموظف
        const employeeRef = ref(
            db,
            "employees/" + user.uid
        );

        const snapshot = await get(employeeRef);


        if (!snapshot.exists()) {

            alert("لا يوجد حساب موظف");

            await signOut(auth);

            localStorage.clear();

            window.location.href = "../login.html";

            return;
        }


        const data = snapshot.val();

        const role = String(data.role || "employee").toLowerCase();


        // =====================================
        // حفظ البيانات
        // =====================================

        localStorage.setItem(
            "employeeName",
            data.name || "موظف"
        );

        localStorage.setItem(
            "role",
            role
        );


        // =====================================
        // فحص صفحات المدير
        // =====================================

        const page =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        if (
            adminPages.includes(page) &&
            role !== "admin"
        ) {

            alert("ليس لديك صلاحية الدخول");

            window.location.href = "index.html";

            return;
        }


        // =====================================
        // إذا كان Viewer
        // نضيف class للصفحة
        // حتى الصفحات تعرف أنه مشاهدة فقط
        // =====================================

        if (role === "viewer") {

            document.body.classList.add("viewer-mode");

        }


        console.log("المستخدم:", data.name);
        console.log("الصلاحية:", role);


    } catch (error) {

        console.error(error);

        alert("حدث خطأ في الحماية");

    }

});


// =====================================
// تسجيل الخروج
// =====================================

window.logout = async function () {

    try {

        await signOut(auth);

        localStorage.clear();

        window.location.href = "../login.html";

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تسجيل الخروج");

    }

};
