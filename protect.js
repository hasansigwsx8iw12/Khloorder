import { auth, db } from "./firebase.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";





onAuthStateChanged(auth, async (user)=>{


    if(!user){


        window.location.href="../login.html";

        return;

    }




    try{


        // حفظ بيانات الحساب

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
