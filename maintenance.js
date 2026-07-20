import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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
<input type="checkbox" id="dishCheck" onclick="dishOption()">
عيار الصحن
</label>


<div id="dishBox"></div>


<label>النقل</label>
<input id="transfer" type="text">


<label>البرج</label>
<input id="tower" type="text">


<label>المبلغ المقبوض</label>
<input id="price" type="number">


<button onclick="saveMaintenance()">
حفظ الصيانة
</button>

`;

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


<button onclick="saveInstallation('${title}')">
حفظ ${title}
</button>

`;

}


};



// إظهار خانة إشارة الصحن

window.dishOption=function(){

let check=document.getElementById("dishCheck");

let box=document.getElementById("dishBox");


if(check.checked){

box.innerHTML=`

<label>إشارة الصحن</label>
<input id="dishSignal" type="text">

`;

}else{

box.innerHTML="";

}

};



// حفظ الصيانة في Firebase

window.saveMaintenance = async function(){

alert("1 - دخلت الدالة");


try{

alert("2 - قبل الإضافة");


let doc = await addDoc(
collection(db,"maintenance"),
{
type:"صيانة",
name:document.getElementById("name").value,
national:document.getElementById("national").value,
problem:document.getElementById("problem").value,
price:Number(document.getElementById("price").value),
createdAt:serverTimestamp()
}
);


alert("3 - تمت الإضافة");

console.log("ID:", doc.id);


}catch(error){


alert("حدث خطأ");

console.log(error);


}

};



// حفظ التركيبة والقلبة

window.saveInstallation = async function(type){

    alert("اشتغلت الدالة");

await addDoc(

collection(db,"maintenance"),

{

type:type,

name:document.getElementById("name").value,

national:document.getElementById("national").value,

speed:document.getElementById("speed").value,

signal:document.getElementById("signal").value,

price:Number(document.getElementById("price").value),

tower:document.getElementById("tower").value,

sector:document.getElementById("sector").value,

date:new Date().toLocaleDateString("ar"),

createdAt:serverTimestamp()

}

);


alert("تم حفظ العملية بنجاح");


};
