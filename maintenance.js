alert("تم تحميل maintenance.js");


import { db } from "./firebase.js";


import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



// تغيير النموذج حسب الاختيار

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
<input id="transfer" type="text">


<label>البرج</label>
<input id="tower" type="text">


<label>المبلغ المقبوض</label>
<input id="price" type="number">


<button id="saveMaintenanceBtn">
حفظ الصيانة
</button>

`;

document.getElementById("dishCheck").onchange = dishOption;


document.getElementById("saveMaintenanceBtn").onclick = saveMaintenance;


}



else if(type === "install" || type === "transfer"){


let title = type === "install" ? "تركيبة" : "قلبة";


box.innerHTML = `

<h2>${title}</h2>


<label>اسم الزبون الثلاثي</label>
<input id="name" type="text">


<label>الرقم الوطني</label>
<input id="national" type="text">


<label>السرعة</label>
<input id="speed" type="text">


<label>الإشارة</label>
<input id="signal" type="text">


<label>المبلغ المقبوض</label>
<input id="price" type="number">


<label>اسم البرج</label>
<input id="tower" type="text">


<label>السكتور</label>
<input id="sector" type="text">


<button id="saveInstallBtn">
حفظ ${title}
</button>

`;


document.getElementById("saveInstallBtn").onclick=function(){

saveInstallation(title);

};


}

};



// خيار الصحن

function dishOption(){


let box=document.getElementById("dishBox");


if(document.getElementById("dishCheck").checked){


box.innerHTML=`

<label>إشارة الصحن</label>
<input id="dishSignal" type="text">

`;


}else{

box.innerHTML="";

}


}



// حفظ الصيانة

async function saveMaintenance(){


alert("بدأ الحفظ");


try{


let newRef = push(ref(db,"maintenance"));


await set(newRef,{

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


date:
new Date().toLocaleDateString("ar"),


createdAt:
Date.now()

});


alert("تم حفظ الصيانة بنجاح");


}catch(error){

alert("الكود: " + error.code);

alert("الرسالة: " + error.message);

console.log(error);

    }


}



//
