import { db, auth } from "./firebase.js";
<!DOCTYPE html>
<html lang="ar" dir="rtl">

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
<head>

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>KHLLO NET | الطلبات</title>

let currentUser = null;


// جلب المستخدم الحالي
onAuthStateChanged(auth, (user)=>{

    if(user){

        currentUser = user;

    }

});




// عرض النماذج
window.showForm = function(type){

let box = document.getElementById("formArea");



if(type === "maintenance"){


box.innerHTML = `

<h2>طلب صيانة</h2>


<label>الاسم الثلاثي للزبون</label>
<input id="name">


<label>الرقم الوطني</label>
<input id="national">


<label>مشكلة الزبون</label>
<textarea id="problem"></textarea>



<label>
<input type="checkbox" id="dishCheck">
عيار الصحن
</label>


<div id="dishBox"></div>



<label>النقل</label>
<input id="transfer">


<label>البرج</label>
<input id="tower">

<label>الرقم</label>
<input id="phon" type="number">

<label>المبلغ المقبوض</label>
<input id="price" type="number">



<button id="saveMaintenanceBtn">
حفظ الصيانة
</button>

`;



document.getElementById("dishCheck").onchange = dishOption;


document.getElementById("saveMaintenanceBtn").onclick =
saveMaintenance;
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
rel="stylesheet">

<style>

*{
    box-sizing:border-box;
    margin:0;
    padding:0;
}

:root{
    --bg:#04100b;
    --card:#0b2118;
    --green:#28ed91;
    --dark:#0a9c62;
    --text:#f4fff9;
    --muted:#91afa1;
    --danger:#ff6877;
    --orange:#ffb84d;
}


else if(type === "install" || type === "transfer"){



let title =
type === "install" ? "تركيبة" : "قلبة";

body{
    min-height:100vh;
    font-family:'Cairo',Arial,sans-serif;
    background:
    radial-gradient(circle at 15% 10%,#164d3480,transparent 30%),
    radial-gradient(circle at 90% 90%,#0b714c55,transparent 30%),
    var(--bg);
    color:var(--text);
}


box.innerHTML = `
/* ================= SIDEBAR ================= */

<h2>${title}</h2>
.sidebar{
    width:260px;
    height:100vh;
    position:fixed;
    top:0;
    right:0;
    background:#0b2118;
    border-left:1px solid rgba(40,237,145,.15);
    box-shadow:0 0 25px #0008;
    z-index:1000;
}

.sidebar .side-logo{
    height:90px;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#fff;
    font-size:22px;
    font-weight:bold;
    border-bottom:1px solid #ffffff18;
}

<label>اسم الزبون الثلاثي</label>
<input id="name">
.sidebar ul{
    list-style:none;
    padding:15px 10px;
}

.sidebar li{
    margin:8px 0;
}

<label>الرقم الوطني</label>
<input id="national">
.sidebar a{
    color:#fff;
    text-decoration:none;
    display:flex;
    align-items:center;
    gap:15px;
    padding:14px 16px;
    border-radius:12px;
    transition:.3s;
    font-size:15px;
    cursor:pointer;
}

.sidebar a:hover{
    background:#28ed9125;
}

<label>السرعة</label>
<input id="speed">
.sidebar li.active a{
    background:var(--green);
    color:#04100b;
    box-shadow:0 5px 20px #28ed9135;
}

.sidebar i{
    width:22px;
    text-align:center;
    font-size:18px;
}

<label>الإشارة</label>
<input id="signal">

/* ================= PAGE ================= */

<label>المبلغ المقبوض</label>
<input id="price" type="number">
.page{
    width:calc(100% - 260px);
    margin-right:260px;
    padding:30px;
}

.brand{
    display:flex;
    align-items:center;
    gap:12px;
    margin-bottom:25px;
}

<label>البرج</label>
<input id="tower">
.logo{
    width:55px;
    height:55px;
    border-radius:17px;
    display:grid;
    place-items:center;
    background:linear-gradient(
        135deg,
        var(--green),
        var(--dark)
    );
    color:#03140d;
    font-size:29px;
    font-weight:900;
}

.brand h2{
    font-size:22px;
}

<label>السكتور</label>
<input id="sector">
.brand p{
    font-size:12px;
    color:var(--muted);
}

<label>الرقم</label>
<input id="phon" type="number">

/* ================= STATS ================= */

<button id="saveInstallBtn">
حفظ ${title}
</button>
.stats{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:15px;
    margin-bottom:20px;
}

`;
.stat{
    background:#0b2118ee;
    border:1px solid #28ed9125;
    border-radius:20px;
    padding:20px;
}

.stat i{
    color:var(--green);
    font-size:22px;
    margin-bottom:8px;
}

.stat span{
    display:block;
    color:var(--muted);
    font-size:13px;
}

document.getElementById("saveInstallBtn").onclick =
()=>saveInstallation(title);
.stat strong{
    font-size:28px;
    color:var(--green);
}


/* ================= REQUESTS ================= */

.requests{
    background:#0b2118ee;
    border:1px solid #28ed9125;
    border-radius:23px;
    padding:25px;
}

  

};

.title{
    margin-bottom:22px;
}

.title h1{
    font-size:24px;
}

.title p{
    color:var(--muted);
    font-size:12px;
    margin-top:5px;
}


/* ================= BOXES ================= */

// خيار الصحن
.requests-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(330px,1fr));
    gap:18px;
}

function dishOption(){
.request-box{
    background:#071910;
    border:1px solid #28ed9125;
    border-radius:20px;
    padding:20px;
    transition:.3s;
}

.request-box:hover{
    transform:translateY(-3px);
    border-color:#28ed9155;
    box-shadow:0 15px 40px #0006;
}

let box =
document.getElementById("dishBox");
.request-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:15px;
}

.type{
    display:inline-flex;
    align-items:center;
    gap:7px;
    color:var(--green);
    font-weight:bold;
}

.status{
    padding:5px 10px;
    border-radius:20px;
    font-size:11px;
    background:#ffb84d18;
    color:var(--orange);
}

if(document.getElementById("dishCheck").checked){
.status.received{
    background:#28ed9118;
    color:var(--green);
}

.status.ready{
    background:#438cff18;
    color:#67a4ff;
}

box.innerHTML = `
.info{
    display:grid;
    gap:9px;
    margin-bottom:18px;
}

<label>إشارة الصحن</label>
.info div{
    display:flex;
    justify-content:space-between;
    gap:10px;
    font-size:13px;
    border-bottom:1px solid #ffffff08;
    padding-bottom:7px;
}

<input id="dishSignal">
.info span{
    color:var(--muted);
}

`;
.info strong{
    color:#fff;
    text-align:left;
}

.problem{
    background:#ffffff05;
    border-radius:12px;
    padding:12px;
    margin-bottom:15px;
}

}else{
.problem span{
    display:block;
    color:var(--muted);
    font-size:11px;
    margin-bottom:4px;
}

.problem p{
    font-size:13px;
}

box.innerHTML = "";

/* ================= BUTTON ================= */

button{
    width:100%;
    border:0;
    border-radius:12px;
    padding:12px;
    background:var(--green);
    color:#04100b;
    font-family:inherit;
    font-weight:bold;
    cursor:pointer;
    transition:.3s;
}


button:hover{
    transform:translateY(-2px);
    box-shadow:0 8px 20px #28ed9135;
}

button.secondary{
    background:#162d24;
    color:#fff;
}

button.orange{
    background:var(--orange);
}

button + button{
    margin-top:8px;
}


/* ================= EMPTY ================= */

.empty{
    text-align:center;
    padding:50px 20px;
    color:var(--muted);
}

.empty i{
    font-size:45px;
    margin-bottom:12px;
    color:#28ed9140;
}

// حفظ الصيانة

async function saveMaintenance(){
/* ================= MODAL ================= */

.modal{
    position:fixed;
    inset:0;
    background:#000b;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    z-index:2000;
}

try{
.modal.hidden{
    display:none;
}

.modal-box{
    width:min(500px,100%);
    max-height:90vh;
    overflow:auto;
    background:#0b2118;
    border:1px solid #28ed9140;
    border-radius:23px;
    padding:25px;
    box-shadow:0 25px 80px #000;
}

let id =
push(ref(db,"maintenance")).key;
.modal-box h2{
    margin-bottom:5px;
}

.modal-box .sub{
    color:var(--muted);
    font-size:12px;
    margin-bottom:20px;
}

.field{
    margin-bottom:13px;
}

await set(
.field label{
    display:block;
    color:var(--muted);
    font-size:12px;
    margin-bottom:6px;
}

ref(db,"maintenance/"+id),
.field input,
.field textarea,
.field select{
    width:100%;
    padding:12px;
    border-radius:12px;
    border:1px solid #28ed9130;
    background:#0005;
    color:#fff;
    outline:none;
    font-family:inherit;
}

{
.field textarea{
    min-height:90px;
    resize:vertical;
}

.field input:focus,
.field textarea:focus,
.field select:focus{
    border-color:var(--green);
}

type:"صيانة",
.modal-actions{
    display:flex;
    gap:10px;
    margin-top:20px;
}

.modal-actions button{
    flex:1;
}


name:
document.getElementById("name").value,
/* ================= MOBILE ================= */

@media(max-width:900px){

    .stats{
        grid-template-columns:repeat(2,1fr);
    }

national:
document.getElementById("national").value,
}

@media(max-width:700px){

    .sidebar{
        width:75px;
    }

problem:
document.getElementById("problem").value,
    .sidebar .side-logo{
        font-size:0;
        height:75px;
    }

    .sidebar .side-logo::after{
        content:"K";
        font-size:26px;
    }

    .sidebar a{
        justify-content:center;
        padding:14px 8px;
    }

dishSignal:
document.getElementById("dishSignal")?.value || "",
    .sidebar a span{
        display:none;
    }

    .sidebar i{
        font-size:20px;
    }

    .page{
        width:calc(100% - 75px);
        margin-right:75px;
        padding:15px;
    }

transfer:
document.getElementById("transfer").value,
    .requests{
        padding:17px;
    }

    .requests-grid{
        grid-template-columns:1fr;
    }

}

tower:
document.getElementById("tower").value,
@media(max-width:500px){

phon:
Number(document.getElementById("phon").value),
    
    .stats{
        grid-template-columns:1fr 1fr;
    }

price:
Number(document.getElementById("price").value),
    .stat{
        padding:15px;
    }

}

</style>

employee:
localStorage.getItem("employeeName") || "غير معروف",
</head>

<body>


uid:
currentUser?.uid || "",
<!-- ================= SIDEBAR ================= -->

<div class="sidebar">

    <div class="side-logo">
        KHLLO NET
    </div>

email:
currentUser?.email || "",
    <ul>

        <li>
            <a href="index.html">
                <i class="fa-solid fa-house"></i>
                <span>الرئيسية</span>
            </a>
        </li>

        <li>
            <a href="add.html">
                <i class="fa-solid fa-plus"></i>
                <span>إضافة صيانة</span>
            </a>
        </li>

date:
new Date().toLocaleDateString("ar"),
        <li>
            <a href="repairs.html">
                <i class="fa-solid fa-screwdriver-wrench"></i>
                <span>الصيانات</span>
            </a>
        </li>

        <li>
            <a href="daily.html">
                <i class="fa-solid fa-calendar-days"></i>
                <span>السجل اليومي</span>
            </a>
        </li>

        <li class="active">
            <a href="requests.html">
                <i class="fa-solid fa-inbox"></i>
                <span>الطلبات</span>
            </a>
        </li>

createdAt:
Date.now()
        <li>
            <a href="accounts.html">
                <i class="fa-solid fa-wallet"></i>
                <span>الحسابات</span>
            </a>
        </li>

        <li>
            <a href="users.html">
                <i class="fa-solid fa-users"></i>
                <span>المستخدمون</span>
            </a>
        </li>

}
        <li>
            <a onclick="logout()">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>تسجيل الخروج</span>
            </a>
        </li>

    </ul>

);
</div>


<!-- ================= CONTENT ================= -->

alert("تم حفظ الصيانة بنجاح");
<main class="page">

    <header class="brand">

        <div class="logo">
            K
        </div>

}catch(error){
        <div>
            <h2>KHLLO NET</h2>
            <p>إدارة طلبات الصيانة والتركيب والقلبة</p>
        </div>

    </header>

console.log(error);

alert(error.message);
    <!-- الإحصائيات -->

    <section class="stats">

}
        <div class="stat">
            <i class="fa-solid fa-inbox"></i>
            <span>كل الطلبات</span>
            <strong id="totalRequests">0</strong>
        </div>

        <div class="stat">
            <i class="fa-solid fa-clock"></i>
            <span>طلبات جديدة</span>
            <strong id="newRequests">0</strong>
        </div>

}
        <div class="stat">
            <i class="fa-solid fa-hand"></i>
            <span>تم الاستلام</span>
            <strong id="receivedRequests">0</strong>
        </div>

        <div class="stat">
            <i class="fa-solid fa-check"></i>
            <span>جاهزة</span>
            <strong id="readyRequests">0</strong>
        </div>

// حفظ التركيبة والقلبة
    </section>

async function saveInstallation(type){

    <!-- الطلبات -->

try{
    <section class="requests">

        <div class="title">

let id =
push(ref(db,"maintenance")).key;
            <h1>
                الطلبات
            </h1>

            <p>
                جميع طلبات العملاء الواردة إلى KHLLO NET
            </p>

        </div>

await set(

ref(db,"maintenance/"+id),
        <div id="requestsGrid" class="requests-grid">

{
            <div class="empty">

                <i class="fa-solid fa-spinner fa-spin"></i>

type:type,
                <p>
                    جاري تحميل الطلبات...
                </p>

            </div>

        </div>

name:
document.getElementById("name").value,
    </section>

</main>


national:
document.getElementById("national").value,
<!-- ================= MODAL ================= -->

<div id="detailsModal" class="modal hidden">

    <div class="modal-box">

speed:
document.getElementById("speed").value,
        <h2 id="modalTitle">
            تفاصيل التنفيذ
        </h2>

        <p class="sub" id="modalSub">
            أدخل معلومات تنفيذ الطلب
        </p>


signal:
document.getElementById("signal").value,
        <!-- مشكلة الصيانة -->

        <div class="field" id="problemField">

            <label>
                مشكلة الزبون
            </label>

price:
Number(document.getElementById("price").value),
            <textarea
                id="problemInput"
                placeholder="اكتب مشكلة الزبون..."
            ></textarea>

        </div>


tower:
document.getElementById("tower").value,
        <!-- المبلغ -->

        <div class="field">

            <label>
                المبلغ الذي تم أخذه من الزبون
            </label>

sector:
document.getElementById("sector").value,
            <input
                id="priceInput"
                type="number"
                min="0"
                placeholder="مثلاً 50000"
            >

phon:
Number(document.getElementById("phon").value),
    
        </div>

employee:
localStorage.getItem("employeeName") || "غير معروف",

        <!-- الإشارة -->

        <div class="field">

uid:
currentUser?.uid || "",
            <label>
                الإشارة
            </label>

            <input
                id="signalInput"
                placeholder="مثلاً 80%"
            >

        </div>

email:
currentUser?.email || "",

        <!-- برج الربط -->

        <div class="field">

date:
new Date().toLocaleDateString("ar"),
            <label>
                برج الربط
            </label>

            <input
                id="towerInput"
                placeholder="اسم برج الربط"
            >

        </div>

createdAt:
Date.now()

        <!-- القطاع -->

}
        <div class="field" id="sectorField">

            <label>
                القطاع
            </label>

);
            <input
                id="sectorInput"
                placeholder="اسم القطاع"
            >

        </div>


alert("تم حفظ "+type+" بنجاح");
        <div class="modal-actions">

            <button
                id="cancelDetails"
                class="secondary"
            >
                إلغاء
            </button>

            <button
                id="saveDetails"
            >
                حفظ وإنهاء الطلب
            </button>

}catch(error){
        </div>

    </div>

console.log(error);
</div>

alert(error.message);

<script type="module" src="requests.js"></script>

}
<script type="module" src="protect.js"></script>

</body>

}
</html>
