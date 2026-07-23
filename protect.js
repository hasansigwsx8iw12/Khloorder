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


// التحقق من تسجيل الدخول
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "../login.html";
        return;
    }

    try {

        const q = query(
    collection(firestore, "users"),
    where("email", "==", user.email)
);

const result = await getDocs(q);

alert("عدد المستخدمين: " + result.size);

result.forEach((doc)=>{

    let data = doc.data();

    alert(JSON.stringify(data));

    localStorage.setItem("userRole", data.role || "employee");

    localStorage.setItem("userName", data.Name || "غير معروف");

});

    
    } catch (error) {

        console.log(error);

        localStorage.setItem("userName", "غير معروف");

    }

});


// تسجيل الخروج
window.logout = function () {

    signOut(auth).then(() => {

        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");

        window.location.href = "../login.html";

    });

};
