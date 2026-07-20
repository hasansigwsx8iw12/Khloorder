import { db } from "./firebase.js";


import {

collection,

getDocs,

deleteDoc,

doc,

updateDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let table = document.getElementById("dataTable");


let allData=[];



async function loadData(){


table.innerHTML="";


let snapshot = await getDocs(

collection(db,"maintenance")

);



allData=[];



snapshot.forEach((item)=>{


allData.push({

id:item.id,

data:item.data()

});


});


showData(allData);


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



table.innerHTML +=`

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




// البحث بالاسم

window.searchName=function(){


let value=document
.getElementById("searchName")
.value
.trim();



let result = allData.filter((item)=>{


return item.data.name
.includes(value);


});


showData(result);


}




// حذف

window.deleteData=async function(id){


if(confirm("هل تريد حذف هذا الطلب؟")){


await deleteDoc(

doc(db,"maintenance",id)

);



alert("تم الحذف");


loadData();


}


}




// تعديل

window.editData=function(id){


let item = allData.find(

(x)=>x.id===id

);



let d=item.data;



let newName = prompt(
"تعديل الاسم",
d.name
);



if(newName){


updateDoc(

doc(db,"maintenance",id),

{

name:newName

}

);


alert("تم التعديل");


loadData();


}



}




loadData();