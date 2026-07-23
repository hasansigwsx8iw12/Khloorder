import { firestore } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const table = document.getElementById("dataTable");

let allData = [];



// تحميل البيانات
async function loadData(){


try{


const q = query(
    collection(firestore,"maintenance"),
    orderBy("createdAt","desc")
);


const snapshot = await getDocs(q);


allData=[];


snapshot.forEach((item)=>{


allData.push({

id:item.id,
data:item.data()

});


});


showData(allData);



}catch(error){

console.log(error);

alert("خطأ في تحميل البيانات");

}


}







// عرض البيانات
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



data.forEach((item)=>{


const d=item.data;



table.innerHTML += `

<tr>


<td>
${d.employee || "غير معروف"}
</td>


<td>
${d.type || ""}
</td>


<td>
${d.name || ""}
</td>


<td>
${d.national || ""}
</td>


<td>
${d.tower || ""}
</td>


<td>
${d.price || 0}
</td>


<td>
${d.date || ""}
</td>



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



if(value===""){

showData(allData);
return;

}



let result=allData.filter(item=>

(item.data.name || "")
.includes(value)

);



showData(result);


};









// حذف
window.deleteData=async function(id){


if(!confirm("هل تريد حذف هذا الطلب؟"))
return;



await deleteDoc(
doc(firestore,"maintenance",id)
);



alert("تم الحذف");



loadData();


};









// تعديل الاسم فقط
window.editData=async function(id){



let item=allData.find(x=>x.id===id);



if(!item)
return;



let newName=prompt(
"تعديل الاسم",
item.data.name
);



if(!newName)
return;



await updateDoc(

doc(firestore,"maintenance",id),

{

name:newName

}

);



alert("تم التعديل");



loadData();



};





loadData();
