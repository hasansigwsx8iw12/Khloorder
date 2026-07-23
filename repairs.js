import { db, auth } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const table = document.getElementById("dataTable");


let allData = [];



onAuthStateChanged(auth,(user)=>{


    if(!user){

        window.location.href="../login.html";

        return;

    }



    loadData(user.uid);


});






function loadData(uid){


onValue(ref(db,"maintenance"),(snapshot)=>{


allData=[];


let role =
localStorage.getItem("role");



snapshot.forEach((item)=>{


let data = item.val();



// إذا كان مدير يشاهد كل شيء

if(role === "admin"){


allData.push({

id:item.key,
data:data

});


}



// إذا كان موظف يشاهد عمله فقط

else{


if(data.uid === uid){


allData.push({

id:item.key,
data:data

});


}


}



});



showData(allData);



});


}







function showData(data){


table.innerHTML="";



if(data.length===0){


table.innerHTML=`

<tr>
<td colspan="8">
لا توجد بيانات
</td>
</tr>

`;

return;

}



data.forEach(item=>{


let d=item.data;


table.innerHTML += `

<tr>

<td>${d.employee || ""}</td>

<td>${d.type || ""}</td>

<td>${d.name || ""}</td>

<td>${d.national || ""}</td>

<td>${d.tower || ""}</td>

<td>${d.price || 0}</td>

<td>${d.date || ""}</td>


</tr>

`;


});


}
