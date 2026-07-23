import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



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



        // حفظ بيانات المستخدم فقط

        localStorage.setItem(
            "uid",
            user.uid
        );


        localStorage.setItem(
            "email",
            user.email
        );


        localStorage.setItem(
            "employeeName",
            "hasan"
        );


        localStorage.setItem(
            "role",
            "admin"
        );



        window.location.href = "index.html";



    }catch(error){


        document.getElementById("message").innerHTML =
        "خطأ في البريد أو كلمة المرور";


        console.log(error);


    }


};
