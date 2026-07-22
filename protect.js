import { auth, firestore } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// فحص تسجيل الدخول

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    try {

        const q = query(
            collection(firestore, "users"),
            where("email", "==", user.email)
        );

        const result = await getDocs(q);

        result.forEach((doc) => {

            const data = doc.data();

            localStorage.setItem("userRole", data.role || "employee");

            localStorage.setItem("userName", data.Name || "غير معروف");

        });

    } catch (error) {

        console.log(error);

    }

});


// تسجيل الخروج

window.logout = function () {

    signOut(auth).then(() => {

        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");

        window.location.href = "login.html";

    });

};
