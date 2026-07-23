import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// حماية الصفحة
onAuthStateChanged(auth, async (user) => {


    if (!user) {

        window.location.href = "../login.html";
        return;

    }



    try {


        // حفظ بيانات الحساب
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("email", user.email);



        // جلب بيانات الموظف
        const employeeRef = doc(
            db,
            "employees",
            user.uid
        );


        const employeeSnap = await getDoc(employeeRef);



        if(employeeSnap.exists()){


            let data = employeeSnap.data();


            localStorage.setItem(
                "employeeName",
                data.name || "غير معروف"
            );


            localStorage.setItem(
                "role",
                data.role || "employee"
            );


        }else{


            localStorage.setItem(
                "employeeName",
                "غير معروف"
            );


            localStorage.setItem(
                "role",
                "employee"
            );


        }



    } catch(error){


        console.log(
            "خطأ في جلب بيانات الموظف:",
            error
        );


    }


});




// تسجيل الخروج
window.logout = async function(){


    await signOut(auth);


    localStorage.clear();


    window.location.href="../login.html";


};
