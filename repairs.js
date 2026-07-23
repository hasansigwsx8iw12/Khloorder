import { db, auth } from "./firebase.js";

import {
    ref,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const table = document.getElementById("dataTable");

let allData = [];





onAuthStateChanged(auth,(user)=>{


    if(!user){

        window.location.href="login.html";

        return;

    }


    loadData(user.uid);


});







function loadData(uid){


onValue(ref(db,"maintenance"),(snapshot)=>{


allData=[];


let role = localStorage.getItem("role");



snapshot.forEach((item)=>{


let data = item.val();



// الموظف يرى أعماله فقط

if(role !== "admin"){


    if(data.uid !== uid){

        return;

    }

}



allData.push({

id:item.key,

data:data

});



});



showData(allData);



});


}









function showData(data){


table.innerHTML="";



if(data.length === 0){


table.innerHTML=`

<tr>

<td colspan="13">
لا توجد بيانات
</td>

</tr>

`;

return;

}







data.forEach((item)=>{


const d = item.data;



table.innerHTML += `

<tr>


<td>${d.employee || "غير معروف"}</td>


<td>${d.type || ""}</td>


<td>${d.name || ""}</td>


<td>${d.national || ""}</td>


<td>${d.problem || ""}</td>


<td>${d.dishSignal || ""}</td>


<td>${d.transfer || ""}</td>


<td>${d.speed || ""}</td>


<td>${d.signal || ""}</td>


<td>${d.tower || ""}</td>


<td>${d.sector || ""}</td>


<td>${d.price || 0}</td>


<td>${d.date || ""}</td>



<td>

<button onclick="editData('${item.id}')">
تعديل
</button>


<button 
style="background:red"
onclick="deleteData('${item.id}')">
حذف
</button>


</td>



</tr>

`;



});



}










// البحث

window.searchName=function(){


let value =
document.getElementById("searchName").value.trim();



if(value===""){

showData(allData);

return;

}



let result = allData.filter(item=>

(item.data.name || "").includes(value)

);



showData(result);



};









// حذف

window.deleteData = async function(id){


if(!confirm("هل تريد حذف الطلب؟"))
return;



await remove(
ref(db,"maintenance/"+id)
);



alert("تم الحذف");



};









// تعديل الاسم فقط

window.editData = async function(id){



let item =
allData.find(x=>x.id===id);



if(!item)
return;



let newName =
prompt(
"تعديل الاسم",
item.data.name
);



if(!newName)
return;



await update(
ref(db,"maintenance/"+id),
{

name:newName

}

);



alert("تم التعديل");


};
