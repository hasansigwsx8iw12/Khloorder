import { db } from "./firebase.js";


import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";




// العناصر

let repairsCount = document.getElementById("repairsCount");
let installCount = document.getElementById("installCount");
let moveCount = document.getElementById("moveCount");
let moneyCount = document.getElementById("moneyCount");

let lastOperations = document.getElementById("lastOperations");





// قراءة البيانات

const dataRef = ref(db,"maintenance");



onValue(dataRef,(snapshot)=>{


let repairs = 0;
let installs = 0;
let moves = 0;

let money = 0;


let operations = [];



snapshot.forEach((item)=>{


let data = item.val();



operations.push(data);



if(data.type === "صيانة"){

repairs++;

}


else if(data.type === "تركيبة"){

installs++;

}


else if(data.type === "قلبة"){

moves++;

}



money += Number(data.price || 0);



});





// تحديث العدادات


repairsCount.innerHTML = repairs;

installCount.innerHTML = installs;

moveCount.innerHTML = moves;

moneyCount.innerHTML = money;





// آخر العمليات


lastOperations.innerHTML="";



let last = operations.reverse().slice(0,5);



if(last.length===0){


lastOperations.innerHTML=`

<tr>

<td colspan="5">

لا توجد بيانات

</td>

</tr>

`;


return;

}




last.forEach((d)=>{


lastOperations.innerHTML += `

<tr>

<td>${d.type || ""}</td>

<td>${d.name || ""}</td>

<td>${d.tower || ""}</td>

<td>${d.price || 0}</td>

<td>${d.date || ""}</td>

</tr>

`;


});



});
