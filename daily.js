import { db } from "./firebase.js";


import {

collection,

getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let repair = 0;

let install = 0;

let transfer = 0;

let money = 0;



let table = document.getElementById("dailyTable");



let today = new Date().toLocaleDateString("ar");



async function loadDaily(){



const data = await getDocs(

collection(db,"maintenance")

);



table.innerHTML="";



data.forEach((item)=>{


let row=item.data();



if(row.date === today){



if(row.type==="صيانة"){

repair++;

}

else if(row.type==="تركيبة"){

install++;

}

else if(row.type==="قلبة"){

transfer++;

}



money += Number(row.price || 0);



table.innerHTML += `

<tr>

<td>${row.type}</td>

<td>${row.name}</td>

<td>${row.tower || ""}</td>

<td>${row.price || 0}</td>

<td>${row.date}</td>

</tr>

`;



}



});





document.getElementById("dailyRepair").innerHTML=repair;

document.getElementById("dailyInstall").innerHTML=install;

document.getElementById("dailyTransfer").innerHTML=transfer;

document.getElementById("dailyMoney").innerHTML=money;



}



loadDaily();