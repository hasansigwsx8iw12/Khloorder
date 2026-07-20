import { auth, db } from "./firebase.js";


import {

onAuthStateChanged,

signOut

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,

getDocs,

query,

where

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// فحص تسجيل الدخول

onAuthStateChanged(auth, async(user)=>{


if(!user){

window.location.href="../login.html";

return;

}



// جلب بيانات المستخدم

let q = query(

collection(db,"users"),

where("uid","==",user.uid)

);



let result = await getDocs(q);



let role="employee";


result.forEach((doc)=>{

role = doc.data().role;

});



// تخزين الصلاحية

localStorage.setItem(
"userRole",
role
);


});




// تسجيل الخروج

window.logout=function(){


signOut(auth).then(()=>{


window.location.href="../login.html";


});


}