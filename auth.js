import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// تسجيل الدخول
window.login = async function(){

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;


    let message = document.getElementById("message");


    try{


        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        const user = userCredential.user;


        // حفظ uid والبريد
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("email", user.email);



        // جلب اسم الموظف من Firestore
        let userDoc = await getDoc(
            doc(db, "employees", user.uid)
        );


        if(userDoc.exists()){


            let data = userDoc.data();


            localStorage.setItem(
                "employeeName",
                data.name || "موظف"
            );


            localStorage.setItem(
                "role",
                data.role || "employee"
            );


        }else{


            localStorage.setItem(
                "employeeName",
                "موظف"
            );


        }



        // الانتقال للوحة
        window.location.href="index.html";



    }
    
catch(error){

    alert("حدث خطأ: " + error.code + "\n" + error.message);

    console.log(error);

}


};



// إنشاء مستخدم (للاستخدام لاحقًا من لوحة الإدارة)
window.register = async function(email,password){


    try{


        const result =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


        return result.user.uid;


    }
    catch(error){


        console.log(error);
        return null;


    }


};
