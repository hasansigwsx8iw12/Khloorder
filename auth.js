import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



window.login = async function(){


    let email = document.getElementById("email").value.trim();

    let password = document.getElementById("password").value;



    try{


        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        const user = result.user;



        // حفظ uid والبريد

        localStorage.setItem(
            "uid",
            user.uid
        );


        localStorage.setItem(
            "email",
            user.email
        );



        // جلب بيانات الموظف من Realtime Database

        const employeeRef = ref(
            db,
            "employees/" + user.uid
        );


        const snapshot = await get(employeeRef);



        if(snapshot.exists()){


            const data = snapshot.val();



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


        document.getElementById("message").innerHTML =
        "خطأ في البريد أو كلمة المرور";


    }


};
