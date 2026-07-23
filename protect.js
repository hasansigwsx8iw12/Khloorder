import { auth, db } from "./firebase.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";




// الصفحات التي تحتاج مدير فقط

const adminPages = [

    "employees.html",
    "users.html",
    "accounts.html"

];





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



        const employeeRef = ref(
            db,
            "employees/" + user.uid
        );



        const snapshot = await get(employeeRef);



        if(!snapshot.exists()){


            alert("لا يوجد حساب موظف");

            await signOut(auth);

            window.location.href="../login.html";

            return;

        }



        const data = snapshot.val();



        localStorage.setItem(
            "employeeName",
            data.name
        );



        localStorage.setItem(
            "role",
            data.role
        );





        // فحص صلاحيات الصفحة

        let page =
        window.location.pathname.split("/").pop();



        if(
            adminPages.includes(page)
            &&
            data.role !== "admin"
        ){

            alert("ليس لديك صلاحية الدخول");

            window.location.href="index.html";

            return;

        }




    }catch(error){


        console.log(error);

        alert("حدث خطأ في الحماية");


    }



});







window.logout = async function(){


    await signOut(auth);


    localStorage.clear();


    window.location.href="../login.html";


};
