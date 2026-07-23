import { auth, firestore } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



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



        // حفظ بيانات المستخدم
        localStorage.setItem("uid", user.uid);

        localStorage.setItem("email", user.email);



        // جلب بيانات الموظف
        const employeeRef = doc(
            firestore,
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



        window.location.href = "index.html";



    }catch(error){


        console.log(error);


        if(message){

            message.innerHTML =
            "خطأ في البريد أو كلمة المرور";

        }


        alert(error.code + "\n" + error.message);


    }


};





// إنشاء مستخدم (للمستقبل)
window.register = async function(email,password){


    try{


        const result =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


        return result.user.uid;


    }catch(error){


        console.log(error);

        return null;


    }


};
