import { db, auth } from "./firebase.js";

import {
    ref,
    onValue,
    update,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const grid = document.getElementById("requestsGrid");

const totalRequests = document.getElementById("totalRequests");
const newRequests = document.getElementById("newRequests");
const receivedRequests = document.getElementById("receivedRequests");
const readyRequests = document.getElementById("readyRequests");


const modal = document.getElementById("detailsModal");
const modalTitle = document.getElementById("modalTitle");
const modalSub = document.getElementById("modalSub");

const problemField = document.getElementById("problemField");
const sectorField = document.getElementById("sectorField");

const problemInput = document.getElementById("problemInput");
const priceInput = document.getElementById("priceInput");
const signalInput = document.getElementById("signalInput");
const towerInput = document.getElementById("towerInput");
const sectorInput = document.getElementById("sectorInput");

const cancelDetails = document.getElementById("cancelDetails");
const saveDetails = document.getElementById("saveDetails");


let currentRequest = null;
let currentUid = null;


// ============================================
// تسجيل الدخول
// ============================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    currentUid = user.uid;

    loadRequests();

});


// ============================================
// تحميل الطلبات
// ============================================

function loadRequests() {

    onValue(ref(db, "requests"), (snapshot) => {

        grid.innerHTML = "";

        let total = 0;
        let newCount = 0;
        let receivedCount = 0;
        let readyCount = 0;

        let requests = [];

        snapshot.forEach((item) => {

            const data = item.val();

            requests.push({
                id: item.key,
                data: data
            });

        });


        // الأحدث أولاً
        requests.reverse();


        requests.forEach((item) => {

            const data = item.data;

            total++;


            const status = data.status || "new";


            if (status === "new") {
                newCount++;
            }

            if (status === "received") {
                receivedCount++;
            }

            if (status === "ready") {
                readyCount++;
            }


            grid.innerHTML += createRequestBox(
                item.id,
                data
            );

        });


        totalRequests.innerText = total;
        newRequests.innerText = newCount;
        receivedRequests.innerText = receivedCount;
        readyRequests.innerText = readyCount;


        if (total === 0) {

            grid.innerHTML = `

                <div class="empty">

                    <i class="fa-solid fa-inbox"></i>

                    <p>
                        لا توجد طلبات حالياً
                    </p>

                </div>

            `;

        }

    });

}


// ============================================
// إنشاء Box
// ============================================

function createRequestBox(id, data) {

    const type = data.type || "صيانة";

    let icon = "fa-screwdriver-wrench";

    if (type === "تركيبة") {
        icon = "fa-satellite-dish";
    }

    if (type === "قلبة") {
        icon = "fa-repeat";
    }


    let statusText = "طلب جديد";
    let statusClass = "";


    if (data.status === "received") {

        statusText = "تم استلام الطلب";
        statusClass = "received";

    }

    else if (data.status === "ready") {

        statusText = "جاهز";
        statusClass = "ready";

    }

    else if (data.status === "completed") {

        statusText = "مكتمل";
        statusClass = "ready";

    }


    let button = "";


    // الطلب الجديد
    if (data.status === "new" || !data.status) {

        button = `

            <button
                onclick="receiveRequest('${id}')"
            >
                <i class="fa-solid fa-hand"></i>
                تم استلام الطلب
            </button>

        `;

    }


    // تم الاستلام
    else if (data.status === "received") {

        button = `

            <button
                class="orange"
                onclick="readyRequest('${id}')"
            >
                <i class="fa-solid fa-check"></i>
                جاهز الطلب
            </button>

        `;

    }


    // جاهز
    else if (data.status === "ready") {

        button = `

            <button
                onclick="openDetails(
                    '${id}',
                    '${escapeHtml(type)}'
                )"
            >
                <i class="fa-solid fa-clipboard-check"></i>
                إدخال تفاصيل التنفيذ
            </button>

        `;

    }


    // مكتمل
    else {

        button = `

            <div style="
                text-align:center;
                color:#28ed91;
                font-weight:bold;
                padding:10px;
            ">

                <i class="fa-solid fa-circle-check"></i>
                تم تنفيذ الطلب

            </div>

        `;

    }


    return `

    <div class="request-box">

        <div class="request-head">

            <div class="type">

                <i class="fa-solid ${icon}"></i>

                ${type}

            </div>

            <div class="status ${statusClass}">
                ${statusText}
            </div>

        </div>


        <div class="info">

            <div>
                <span>اسم الزبون</span>
                <strong>${escapeHtml(data.name || "-")}</strong>
            </div>


            ${
                data.national
                ?
                `
                <div>
                    <span>الرقم الوطني</span>
                    <strong>${escapeHtml(data.national)}</strong>
                </div>
                `
                :
                ""
            }


            <div>
                <span>الموقع</span>
                <strong>${escapeHtml(data.location || "-")}</strong>
            </div>


            <div>
                <span>رقم الهاتف</span>
                <strong>${escapeHtml(data.phone || "-")}</strong>
            </div>


            <div>
                <span>مقدم الطلب</span>
                <strong>${escapeHtml(data.requester || "-")}</strong>
            </div>


            <div>
                <span>المكلف</span>
                <strong>${escapeHtml(
                    data.assignee ||
                    data.employee ||
                    "-"
                )}</strong>
            </div>


            <div>
                <span>التاريخ</span>
                <strong>${escapeHtml(data.date || "-")}</strong>
            </div>

        </div>


        ${
            type === "صيانة"
            ?
            `
            <div class="problem">

                <span>مشكلة الزبون</span>

                <p>
                    ${escapeHtml(data.problem || "لم يتم تحديد المشكلة")}
                </p>

            </div>
            `
            :
            ""
        }


        ${button}

    </div>

    `;

}


// ============================================
// تم استلام الطلب
// ============================================

window.receiveRequest = async function(id) {

    try {

        await update(
            ref(db, `requests/${id}`),
            {
                status: "received",
                receivedAt: Date.now(),
                receivedBy: currentUid
            }
        );

    }

    catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء استلام الطلب");

    }

};


// ============================================
// جاهز الطلب
// ============================================

window.readyRequest = async function(id) {

    try {

        await update(
            ref(db, `requests/${id}`),
            {
                status: "ready",
                readyAt: Date.now(),
                readyBy: currentUid
            }
        );

    }

    catch (error) {

        console.error(error);

        alert("حدث خطأ");

    }

};


// ============================================
// فتح تفاصيل التنفيذ
// ============================================

window.openDetails = function(id, type) {

    currentRequest = {
        id: id,
        type: type
    };


    modal.classList.remove("hidden");


    modalTitle.innerText =
        `تفاصيل تنفيذ ${type}`;


    modalSub.innerText =
        "أدخل المعلومات النهائية للطلب";


    problemInput.value = "";
    priceInput.value = "";
    signalInput.value = "";
    towerInput.value = "";
    sectorInput.value = "";


    // الصيانة
    if (type === "صيانة") {

        problemField.style.display = "block";
        sectorField.style.display = "none";

    }

    // التركيبة
    else if (type === "تركيبة") {

        problemField.style.display = "none";
        sectorField.style.display = "block";

    }

    // القلبة
    else {

        problemField.style.display = "none";
        sectorField.style.display = "block";

    }

};


// ============================================
// إغلاق
// ============================================

cancelDetails.onclick = function() {

    modal.classList.add("hidden");

    currentRequest = null;

};


// ============================================
// حفظ التنفيذ
// ============================================

saveDetails.onclick = async function() {

    if (!currentRequest) {
        return;
    }


    const price = Number(priceInput.value || 0);

    const signal = signalInput.value.trim();

    const tower = towerInput.value.trim();

    const sector = sectorInput.value.trim();

    const problem = problemInput.value.trim();


    if (price < 0) {

        alert("المبلغ غير صحيح");

        return;

    }


    if (!signal) {

        alert("أدخل الإشارة");

        return;

    }


    if (!tower) {

        alert("أدخل برج الربط");

        return;

    }


    if (
        currentRequest.type !== "صيانة" &&
        !sector
    ) {

        alert("أدخل السكتور");

        return;

    }


    try {

        const requestRef =
            ref(
                db,
                `requests/${currentRequest.id}`
            );


        // جلب الطلب الحالي من الـ snapshot
        const snapshot = await new Promise((resolve) => {

            onValue(
                requestRef,
                resolve,
                {
                    onlyOnce: true
                }
            );

        });


        if (!snapshot.exists()) {

            alert("الطلب غير موجود");

            return;

        }


        const request = snapshot.val();


        // ========================================
        // إنشاء سجل الصيانة النهائي
        // ========================================

        const maintenanceRef =
            push(ref(db, "maintenance"));


        const maintenanceData = {

            type: currentRequest.type,

            name: request.name || "",

            national: request.national || "",

            problem:
                currentRequest.type === "صيانة"
                ? problem
                : "",

            location: request.location || "",

            phone: request.phone || "",

            requester: request.requester || "",

            employee:
                request.assignee ||
                request.employee ||
                "",

            uid: request.assigneeUid || "",

            price: price,

            signal: signal,

            tower: tower,

            sector:
                currentRequest.type === "صيانة"
                ? ""
                : sector,

            date:
                new Date().toLocaleDateString("ar"),

            createdAt: Date.now(),

            requestId: currentRequest.id

        };


        await set(
            maintenanceRef,
            maintenanceData
        );


        // ========================================
        // تحديث حالة الطلب
        // ========================================

        await update(
            requestRef,
            {
                status: "completed",

                completedAt: Date.now(),

                completedBy: currentUid,

                maintenanceId: maintenanceRef.key,

                price: price,

                signal: signal,

                tower: tower,

                sector:
                    currentRequest.type === "صيانة"
                    ? ""
                    : sector,

                finalProblem:
                    currentRequest.type === "صيانة"
                    ? problem
                    : ""

            }
        );


        modal.classList.add("hidden");

        currentRequest = null;


        alert(
            "✅ تم تسجيل تنفيذ الطلب بنجاح"
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء حفظ الطلب"
        );

    }

};


// ============================================
// حماية النصوص
// ============================================

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
