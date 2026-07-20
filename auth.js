import {auth} from "./firebase.js";


import {

signInWithEmailAndPassword,

createUserWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





window.login = async function(){


let email=document.getElementById("email").value;


let password=document.getElementById("password").value;



try{


await signInWithEmailAndPassword(

auth,

email,

password

);



window.location.href="index.html";



}

catch(error){


document.getElementById("message").innerHTML=

"خطأ في البريد أو كلمة المرور";


}


}