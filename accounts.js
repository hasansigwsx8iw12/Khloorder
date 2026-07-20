import { db } from "./firebase.js";


import {

collection,

getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




let todayMoney = 0;

let monthMoney = 0;

let allMoney = 0;

let count = 0;



let table = document.getElementById("accountTable");



let today = new Date().toLocaleDateString("ar");


let month = new Date().getMonth()+1;



async function loadAccounts(){


let data = await getDocs(

collection(db,"maintenance")

);



table.innerHTML="";



data.forEach((item)=>{


let row = item.data();



let price = Number(row.price || 0);



allMoney += price;

count++;



if(row.date === today){

todayMoney += price;

}



let rowMonth = new Date().getMonth()+1;



if(rowMonth === month){

monthMoney += price;

}





table.innerHTML += `

<tr>

<td>${row.type || ""}</td>

<td>${row.name || ""}</td>

<td>${price}</td>

<td>${row.date || ""}</td>

</tr>

`;



});



document.getElementById("todayMoney").innerHTML=todayMoney;

document.getElementById("monthMoney").innerHTML=monthMoney;

document.getElementById("allMoney").innerHTML=allMoney;

document.getElementById("allCount").innerHTML=count;



}



loadAccounts();