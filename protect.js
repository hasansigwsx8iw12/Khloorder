import { auth, firestore } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





onAuthStateChanged(auth, async (user)=>{


    if(!user){


        window.location.href="../login.html";

        return;

    }



    try{


        localStorage.setItem(
            "uid",
            user.uid
        );


        localStorage.setItem(
            "email",
            user.email
        );




        const employeeDoc = await getDoc(

            doc(
                firestore,
                "employees",
                user.uid
            )

        );



        if(employeeDoc.exists()){


            let data = employeeDoc.data();



            localStorage.setItem(
                "employeeName",
                data.name || "غير معروف"
            );



            localStorage.setItem(
                "role",
                data.role || "employee"
            );



        }



    }catch(error){


        console.log(
            "خطأ:",
            error
        );


    }



});





window.logout = async function(){


    await signOut(auth);


    localStorage.clear();


    window.location.href="../login.html";


};
