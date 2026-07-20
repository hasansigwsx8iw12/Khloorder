let role = localStorage.getItem("userRole");


if(role !== "admin"){

alert("ليس لديك صلاحية");


window.location.href="../index.html";

}
import {auth,db} from "./firebase.js";


import {

createUserWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



import {

collection,

addDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





window.createUser = async function(){


let email =
document.getElementById("userEmail").value;


let password =
document.getElementById("userPassword").value;


let name =
document.getElementById("username").value;


let role =
document.getElementById("role").value;



try{


let user = await createUserWithEmailAndPassword(

auth,

email,

password

);



await addDoc(

collection(db,"users"),

{


uid:user.user.uid,

name:name,

email:email,

role:role


}

);



alert("تم إنشاء الحساب");



}

catch(error){


alert(error.message);


}



}