import { db, auth } from "./firebase.js";


import {
    ref,
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





// اسم المستخدم في الهيدر

let userName = document.getElementById("userName");



// العناصر

let repairsCount = document.getElementById("repairsCount");

let installCount = document.getElementById("installCount");

let moveCount = document.getElementById("moveCount");

let moneyCount = document.getElementById("moneyCount");

let lastOperations = document.getElementById("lastOperations");







onAuthStateChanged(auth, async(user)=>{


if(!user){

window.location.href="login.html";

return;

}




// جلب بيانات الموظف

try{


const employeeRef = ref(
    db,
    "employees/" + user.uid
);



const snapshot = await get(employeeRef);



if(snapshot.exists()){


const data = snapshot.val();



if(userName){

userName.innerHTML =
data.name || "مستخدم";

}



// تحديث الصلاحية

localStorage.setItem(
"role",
data.role || "employee"
);



}else{


if(userName){

userName.innerHTML="غير معروف";

}


}



}catch(error){


console.log(error);


}





loadDashboard(user.uid);



});









function loadDashboard(uid){



const dataRef = ref(db,"maintenance");



onValue(dataRef,(snapshot)=>{



let repairs = 0;

let installs = 0;

let moves = 0;


let money = 0;


let operations = [];



let role = localStorage.getItem("role");






snapshot.forEach((item)=>{


let data = item.val();




// الموظف يرى أعماله فقط

if(role !== "admin"){


if(data.uid !== uid){

return;

}


}





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








if(repairsCount)
repairsCount.innerHTML = repairs;



if(installCount)
installCount.innerHTML = installs;



if(moveCount)
moveCount.innerHTML = moves;



if(moneyCount)
moneyCount.innerHTML = money;









if(lastOperations){



lastOperations.innerHTML = "";



let last = operations.reverse().slice(0,5);





if(last.length === 0){


lastOperations.innerHTML = `

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



}



});



}
