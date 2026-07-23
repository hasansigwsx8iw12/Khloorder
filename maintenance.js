import { db, auth } from "./firebase.js";

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


let currentUser = null;


// جلب المستخدم الحالي
onAuthStateChanged(auth, (user)=>{

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
<input id="name">


<label>الرقم الوطني</label>
<input id="national">


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


document.getElementById("saveMaintenanceBtn").onclick =
saveMaintenance;



}



else if(type === "install" || type === "transfer"){



let title =
type === "install" ? "تركيبة" : "قلبة";



box.innerHTML = `

<h2>${title}</h2>


<label>اسم الزبون الثلاثي</label>
<input id="name">


<label>الرقم الوطني</label>
<input id="national">


<label>السرعة</label>
<input id="speed">


<label>الإشارة</label>
<input id="signal">


<label>المبلغ المقبوض</label>
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






// خيار الصحن

function dishOption(){


let box =
document.getElementById("dishBox");



if(document.getElementById("dishCheck").checked){


box.innerHTML = `

<label>إشارة الصحن</label>

<input id="dishSignal">

`;


}else{


box.innerHTML = "";


}


}








// حفظ الصيانة

async function saveMaintenance(){


try{


let id =
push(ref(db,"maintenance")).key;



await set(

ref(db,"maintenance/"+id),

{


type:"صيانة",



name:
document.getElementById("name").value,



national:
document.getElementById("national").value,



problem:
document.getElementById("problem").value,



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
currentUser?.uid || "",



email:
currentUser?.email || "",



date:
new Date().toLocaleDateString("ar"),



createdAt:
Date.now()


}


);



alert("تم حفظ الصيانة بنجاح");



}catch(error){


console.log(error);

alert(error.message);


}


}










// حفظ التركيبة والقلبة

async function saveInstallation(type){


try{


let id =
push(ref(db,"maintenance")).key;



await set(

ref(db,"maintenance/"+id),

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
currentUser?.uid || "",



email:
currentUser?.email || "",



date:
new Date().toLocaleDateString("ar"),



createdAt:
Date.now()


}


);



alert("تم حفظ "+type+" بنجاح");



}catch(error){


console.log(error);

alert(error.message);


}


}
