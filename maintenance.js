import { firestore, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



let currentUser = null;


// التأكد من المستخدم
onAuthStateChanged(auth,(user)=>{

    if(user){

        currentUser = user;

    }

});



// عرض النماذج
window.showForm = function(type){

let box = document.getElementById("formArea");



if(type === "maintenance"){


box.innerHTML = `

<h2>طلب صيانة</h2>

<label>الاسم الثلاثي للزبون</label>
<input id="name" type="text">


<label>الرقم الوطني</label>
<input id="national" type="text">


<label>مشكلة الزبون</label>
<textarea id="problem"></textarea>


<label>
<input type="checkbox" id="dishCheck">
عيار الصحن
</label>


<div id="dishBox"></div>


<label>النقل</label>
<input id="transfer">


<label>البرج</label>
<input id="tower">


<label>المبلغ المقبوض</label>
<input id="price" type="number">


<button id="saveMaintenanceBtn">
حفظ الصيانة
</button>

`;



document.getElementById("dishCheck").onchange = dishOption;

document.getElementById("saveMaintenanceBtn").onclick = saveMaintenance;



}



else if(type==="install" || type==="transfer"){


let title = type==="install" ? "تركيبة":"قلبة";


box.innerHTML=`

<h2>${title}</h2>


<label>اسم الزبون الثلاثي</label>
<input id="name">


<label>الرقم الوطني</label>
<input id="national">


<label>السرعة</label>
<input id="speed">


<label>الإشارة</label>
<input id="signal">


<label>المبلغ</label>
<input id="price" type="number">


<label>البرج</label>
<input id="tower">


<label>السكتور</label>
<input id="sector">


<button id="saveInstallBtn">
حفظ ${title}
</button>

`;



document.getElementById("saveInstallBtn").onclick =
()=>saveInstallation(title);



}

};





function dishOption(){


let box=document.getElementById("dishBox");


if(document.getElementById("dishCheck").checked){


box.innerHTML=`

<label>إشارة الصحن</label>
<input id="dishSignal">

`;

}else{

box.innerHTML="";

}

}






async function saveMaintenance(){


try{


if(!currentUser){

alert("يجب تسجيل الدخول");

return;

}



await addDoc(
collection(firestore,"maintenance"),
{


type:"صيانة",

name:document.getElementById("name").value,

national:document.getElementById("national").value,

problem:document.getElementById("problem").value,


dishSignal:
document.getElementById("dishSignal")?.value || "",


transfer:
document.getElementById("transfer").value,


tower:
document.getElementById("tower").value,


price:
Number(document.getElementById("price").value),



employee:
localStorage.getItem("employeeName") || "غير معروف",


uid:
currentUser.uid,


email:
currentUser.email,


createdAt:
serverTimestamp()

}

);


alert("تم حفظ الصيانة بنجاح");


}catch(error){

console.log(error);

alert(error.message);

}


}







async function saveInstallation(type){


try{


if(!currentUser){

alert("يجب تسجيل الدخول");

return;

}



await addDoc(
collection(firestore,"maintenance"),
{


type:type,


name:
document.getElementById("name").value,


national:
document.getElementById("national").value,


speed:
document.getElementById("speed").value,


signal:
document.getElementById("signal").value,


price:
Number(document.getElementById("price").value),


tower:
document.getElementById("tower").value,


sector:
document.getElementById("sector").value,



employee:
localStorage.getItem("employeeName") || "غير معروف",


uid:
currentUser.uid,


email:
currentUser.email,


createdAt:
serverTimestamp()


}

);


alert("تم حفظ "+type+" بنجاح");



}catch(error){

console.log(error);

alert(error.message);

}


}
