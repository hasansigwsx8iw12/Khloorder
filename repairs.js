import { db } from "./firebase.js";


import {
    ref,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



let table = document.getElementById("dataTable");


let allData = [];




// تحميل البيانات

function loadData(){


let dataRef = ref(db,"maintenance");


onValue(dataRef,(snapshot)=>{


table.innerHTML="";

allData=[];


snapshot.forEach((item)=>{


allData.push({

id:item.key,

data:item.val()

});


});



showData(allData);



});


}






function showData(data){


table.innerHTML="";



if(data.length===0){


table.innerHTML=`

<tr>

<td colspan="7">

لا توجد بيانات

</td>

</tr>

`;

return;

}




data.forEach((item)=>{


let d=item.data;



table.innerHTML += `

<tr>


<td>${d.type || ""}</td>


<td>${d.name || ""}</td>


<td>${d.national || ""}</td>


<td>${d.tower || ""}</td>


<td>${d.price || 0}</td>


<td>${d.date || ""}</td>


<td>


<button onclick="editData('${item.id}')">

تعديل

</button>



<button 

style="background:#e53935"

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


let value=document
.getElementById("searchName")
.value
.trim();



let result=allData.filter((item)=>{


return item.data.name?.includes(value);


});



showData(result);


};







// حذف

window.deleteData=async function(id){


if(confirm("هل تريد حذف هذا الطلب؟")){


await remove(

ref(db,"maintenance/"+id)

);


alert("تم الحذف");


}



};







// تعديل الاسم

window.editData=function(id){


let item=allData.find(

(x)=>x.id===id

);



let newName=prompt(

"تعديل الاسم",

item.data.name

);



if(newName){


update(

ref(db,"maintenance/"+id),

{

name:newName

}

);


alert("تم التعديل");


}



};





loadData();
