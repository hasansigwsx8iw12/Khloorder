// ==========================================
// KHLLO NET
// requests.js
// إدارة الطلبات - Realtime Database
// ==========================================

import { db, auth } from "./firebase.js";

import {
    ref,
    onValue,
    update,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// المستخدم الحالي
// ==========================================

let currentUser = null;

let allRequests = {};

let currentFilter = "all";

let selectedRequestId = null;


// ==========================================
// تسجيل الدخول
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        console.log(
            "لا يوجد مستخدم مسجل"
        );

        return;

    }


    currentUser = user;

    loadRequests();

});


// ==========================================
// تحميل الطلبات
// ==========================================

function loadRequests() {

    const requestsRef =
        ref(db, "requests");


    onValue(
        requestsRef,
        (snapshot) => {

            if (snapshot.exists()) {

                allRequests =
                    snapshot.val();

            } else {

                allRequests = {};

            }


            renderRequests();

        },

        (error) => {

            console.error(error);

            const grid =
                document.getElementById(
                    "requestsGrid"
                );

            if (grid) {

                grid.innerHTML = `

                    <div class="empty">

                        <i
                            class="fa-solid
                            fa-triangle-exclamation"
                        ></i>

                        <p>
                            حدث خطأ في تحميل الطلبات
                        </p>

                    </div>

                `;

            }

        }
    );

}


// ==========================================
// رسم الطلبات
// ==========================================

function renderRequests() {

    const grid =
        document.getElementById(
            "requestsGrid"
        );


    if (!grid) return;


    const requests =
        Object.values(allRequests || {})
            .sort(
                (a, b) =>
                    (b.createdAt || 0) -
                    (a.createdAt || 0)
            );


    updateStats(requests);


    let filtered =
        requests;


    if (currentFilter !== "all") {

        filtered =
            requests.filter(
                request =>
                    request.status ===
                    currentFilter
            );

    }


    if (!filtered.length) {

        grid.innerHTML = `

            <div class="empty">

                <i
                    class="fa-solid fa-inbox"
                ></i>

                <p>
                    لا توجد طلبات هنا
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        filtered
            .map(
                request =>
                    createRequestBox(
                        request
                    )
            )
            .join("");


    attachButtons();

}


// ==========================================
// الإحصائيات
// ==========================================

function updateStats(requests) {

    const total =
        requests.length;


    const newCount =
        requests.filter(
            r => r.status === "new"
        ).length;


    const receivedCount =
        requests.filter(
            r => r.status === "received"
        ).length;


    const readyCount =
        requests.filter(
            r => r.status === "ready"
        ).length;


    setText(
        "totalRequests",
        total
    );

    setText(
        "newRequests",
        newCount
    );

    setText(
        "receivedRequests",
        receivedCount
    );

    setText(
        "readyRequests",
        readyCount
    );

}


// ==========================================
// تغيير النص
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


// ==========================================
// نوع الطلب
// ==========================================

function getTypeInfo(type) {

    if (type === "maintenance") {

        return {

            title: "صيانة",

            icon:
                "fa-screwdriver-wrench"

        };

    }


    if (type === "install") {

        return {

            title: "تركيبة",

            icon:
                "fa-satellite-dish"

        };

    }


    if (type === "transfer") {

        return {

            title: "قلبة",

            icon:
                "fa-right-left"

        };

    }


    return {

        title: "طلب",

        icon:
            "fa-file"

    };

}


// ==========================================
// حالة الطلب
// ==========================================

function getStatusInfo(status) {

    if (status === "received") {

        return {

            text: "تم استلام الطلب",

            className: "received"

        };

    }


    if (status === "ready") {

        return {

            text: "جاهز الطلب",

            className: "ready"

        };

    }


    return {

        text: "طلب جديد",

        className: ""

    };

}


// ==========================================
// إنشاء Box
// ==========================================

function createRequestBox(request) {

    const type =
        getTypeInfo(
            request.type
        );


    const status =
        getStatusInfo(
            request.status
        );


    let html = `

        <div
            class="request-box"
            data-id="${request.id}"
        >

            <div class="request-head">

                <div class="type">

                    <i
                        class="fa-solid
                        ${type.icon}"
                    ></i>

                    ${type.title}

                </div>


                <div
                    class="status
                    ${status.className}"
                >
                    ${status.text}
                </div>

            </div>


            <div class="info">

                <div>

                    <span>
                        الزبون
                    </span>

                    <strong>
                        ${escapeHtml(
                            request.name
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        الرقم الوطني
                    </span>

                    <strong>
                        ${escapeHtml(
                            request.national
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        الموقع
                    </span>

                    <strong>
                        ${escapeHtml(
                            request.location
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        الهاتف
                    </span>

                    <strong>
                        ${escapeHtml(
                            request.phone
                        )}
                    </strong>

                </div>

    `;


    // نوع التركيبة

    if (
        request.type === "install" &&
        request.installType
    ) {

        html += `

                <div>

                    <span>
                        نوع التركيبة
                    </span>

                    <strong>
                        ${escapeHtml(
                            request.installType
                        )}
                    </strong>

                </div>

        `;

    }


    // المبلغ الأصلي

    if (
        request.price !== undefined &&
        request.price !== null
    ) {

        html += `

                <div>

                    <span>
                        المبلغ
                    </span>

                    <strong>
                        ${formatNumber(
                            request.price
                        )}
                    </strong>

                </div>

        `;

    }


    // مقدم الطلب

    html += `

                <div>

                    <span>
                        مقدم الطلب
                    </span>

                    <strong>
                        ${escapeHtml(
                            request.employee ||
                            request.createdBy?.name ||
                            "غير معروف"
                        )}
                    </strong>

                </div>

    `;


    // المكلف

    if (
        request.receivedBy?.name
    ) {

        html += `

                <div>

                    <span>
                        المكلف
                    </span>

                    <strong>
                        ${escapeHtml(
                            request.receivedBy.name
                        )}
                    </strong>

                </div>

        `;

    }


    html += `
            </div>
    `;


    // مشكلة الصيانة

    if (
        request.type === "maintenance" &&
        request.problem
    ) {

        html += `

            <div class="problem">

                <span>
                    مشكلة الزبون
                </span>

                <p>
                    ${escapeHtml(
                        request.problem
                    )}
                </p>

            </div>

        `;

    }


    // ======================================
    // الأزرار
    // ======================================

    html += `

            <div class="request-actions">

    `;


    // طلب جديد

    if (
        request.status === "new"
    ) {

        html += `

            <button
                class="receive-btn"
                data-action="receive"
                data-id="${request.id}"
            >

                <i
                    class="fa-solid fa-hand"
                ></i>

                تم استلام الطلب

            </button>

        `;

    }


    // تم الاستلام

    if (
        request.status === "received"
    ) {

        html += `

            <button
                class="ready-btn"
                data-action="ready"
                data-id="${request.id}"
            >

                <i
                    class="fa-solid fa-check"
                ></i>

                جاهز الطلب

            </button>

        `;

    }


    // جاهز

    if (
        request.status === "ready"
    ) {

        html += `

            <button
                class="details-btn"
                data-action="details"
                data-id="${request.id}"
            >

                <i
                    class="fa-solid fa-eye"
                ></i>

                عرض التفاصيل

            </button>

        `;

    }


    html += `

            </div>

        </div>

    `;


    return html;

}


// ==========================================
// ربط الأزرار
// ==========================================

function attachButtons() {

    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;

                    const id =
                        button.dataset.id;


                    if (
                        action === "receive"
                    ) {

                        receiveRequest(id);

                    }


                    if (
                        action === "ready"
                    ) {

                        openDetails(id);

                    }


                    if (
                        action === "details"
                    ) {

                        showCompletedDetails(id);

                    }

                }
            );

        });

}


// ==========================================
// استلام الطلب
// ==========================================

async function receiveRequest(id) {

    if (!currentUser) {

        alert(
            "يجب تسجيل الدخول أولاً"
        );

        return;

    }


    const request =
        allRequests[id];


    if (!request) {

        alert(
            "الطلب غير موجود"
        );

        return;

    }


    if (
        request.status !== "new"
    ) {

        return;

    }


    const employee = {

        uid:
            currentUser.uid,

        email:
            currentUser.email || "",

        name:
            localStorage.getItem(
                "employeeName"
            ) || "غير معروف"

    };


    try {

        await update(

            ref(
                db,
                `requests/${id}`
            ),

            {

                status: "received",

                receivedAt:
                    Date.now(),

                receivedBy:
                    employee

            }

        );


        console.log(
            "تم استلام الطلب:",
            id
        );


    } catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء استلام الطلب:\n" +
            error.message
        );

    }

}


// ==========================================
// فتح نافذة التنفيذ
// ==========================================

function openDetails(id) {

    const request =
        allRequests[id];


    if (!request) return;


    selectedRequestId =
        id;


    const modal =
        document.getElementById(
            "detailsModal"
        );


    const title =
        document.getElementById(
            "modalTitle"
        );


    const sub =
        document.getElementById(
            "modalSub"
        );


    const problemField =
        document.getElementById(
            "problemField"
        );


    const sectorField =
        document.getElementById(
            "sectorField"
        );


    // عنوان

    if (request.type === "maintenance") {

        title.textContent =
            "🛠 إنهاء طلب الصيانة";

        problemField.style.display =
            "block";

        sectorField.style.display =
            "none";

    }


    else if (
        request.type === "install"
    ) {

        title.textContent =
            "📡 إنهاء طلب التركيبة";

        problemField.style.display =
            "none";

        sectorField.style.display =
            "block";

    }


    else {

        title.textContent =
            "🔄 إنهاء طلب القلبة";

        problemField.style.display =
            "none";

        sectorField.style.display =
            "block";

    }


    sub.textContent =
        `الزبون: ${request.name}`;


    // تعبئة المشكلة

    document.getElementById(
        "problemInput"
    ).value =
        request.problem || "";


    // المبلغ

    document.getElementById(
        "priceInput"
    ).value =
        request.price || "";


    // تنظيف الحقول

    document.getElementById(
        "signalInput"
    ).value = "";


    document.getElementById(
        "towerInput"
    ).value = "";


    document.getElementById(
        "sectorInput"
    ).value = "";


    modal.classList.remove(
        "hidden"
    );

}


// ==========================================
// إغلاق Modal
// ==========================================

document
    .getElementById(
        "cancelDetails"
    )
    ?.addEventListener(
        "click",
        closeModal
    );


function closeModal() {

    selectedRequestId =
        null;


    document
        .getElementById(
            "detailsModal"
        )
        ?.classList.add(
            "hidden"
        );

}


// ==========================================
// حفظ وإنهاء الطلب
// ==========================================

document
    .getElementById(
        "saveDetails"
    )
    ?.addEventListener(
        "click",
        finishRequest
    );


async function finishRequest() {

    if (!selectedRequestId) {

        return;

    }


    if (!currentUser) {

        alert(
            "يجب تسجيل الدخول أولاً"
        );

        return;

    }


    const request =
        allRequests[
            selectedRequestId
        ];


    if (!request) {

        alert(
            "الطلب غير موجود"
        );

        return;

    }


    // ======================================
    // الحقول
    // ======================================

    const problem =
        document
            .getElementById(
                "problemInput"
            )
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById(
                    "priceInput"
                )
                .value
        ) || 0;


    const signal =
        document
            .getElementById(
                "signalInput"
            )
            .value
            .trim();


    const tower =
        document
            .getElementById(
                "towerInput"
            )
            .value
            .trim();


    const sector =
        document
            .getElementById(
                "sectorInput"
            )
            .value
            .trim();


    // ======================================
    // التحقق
    // ======================================

    if (
        request.type === "maintenance" &&
        !problem
    ) {

        alert(
            "يرجى إدخال مشكلة الزبون"
        );

        return;

    }


    if (!price) {

        alert(
            "يرجى إدخال المبلغ"
        );

        return;

    }


    if (!signal) {

        alert(
            "يرجى إدخال الإشارة"
        );

        return;

    }


    if (!tower) {

        alert(
            "يرجى إدخال برج الربط"
        );

        return;

    }


    if (
        (
            request.type === "install" ||
            request.type === "transfer"
        ) &&
        !sector
    ) {

        alert(
            "يرجى إدخال السكتور"
        );

        return;

    }


    const employee = {

        uid:
            currentUser.uid,

        email:
            currentUser.email || "",

        name:
            localStorage.getItem(
                "employeeName"
            ) || "غير معروف"

    };


    // ======================================
    // بيانات التنفيذ
    // ======================================

    const execution = {

        problem:
            request.type === "maintenance"
                ? problem
                : "",

        price,

        signal,

        tower,

        sector:
            request.type === "maintenance"
                ? ""
                : sector,

        completedBy:
            employee,

        completedAt:
            Date.now()

    };


    try {

        // ==================================
        // أولًا:
        // إضافة السجل للنظام القديم
        // Realtime Database → maintenance
        // ==================================

        const maintenanceRef =
            push(
                ref(
                    db,
                    "maintenance"
                )
            );


        const maintenanceData = {

            id:
                maintenanceRef.key,

            type:
                request.type,

            name:
                request.name || "",

            national:
                request.national || "",

            location:
                request.location || "",

            phone:
                request.phone || "",

            problem:
                request.type === "maintenance"
                    ? problem
                    : "",

            installType:
                request.installType || "",

            price,

            signal,

            tower,

            sector:
                request.type === "maintenance"
                    ? ""
                    : sector,

            transfer:
                request.transfer || "",

            dish:
                request.dish || false,

            dishSignal:
                request.dishSignal || "",

            // مقدم الطلب
            employee:
                request.employee || "",

            uid:
                request.uid || "",

            email:
                request.email || "",

            // المكلف / المنفذ
            completedBy:
                employee.name,

            completedByUid:
                employee.uid,

            completedByEmail:
                employee.email,

            date:
                new Date()
                    .toLocaleDateString(
                        "ar"
                    ),

            createdAt:
                request.createdAt ||
                Date.now(),

            completedAt:
                Date.now(),

            requestId:
                selectedRequestId

        };


        await set(

            maintenanceRef,

            maintenanceData

        );


        // ==================================
        // ثانيًا:
        // تحديث الطلب
        // ==================================

        await update(

            ref(
                db,
                `requests/${selectedRequestId}`
            ),

            {

                status: "ready",

                readyAt:
                    Date.now(),

                readyBy:
                    employee,

                execution:

                    execution,

                maintenanceId:
                    maintenanceRef.key

            }

        );


        console.log(
            "تم إنهاء الطلب:",
            selectedRequestId
        );


        alert(
            "✅ تم إنهاء الطلب وحفظه ضمن الصيانات"
        );


        closeModal();


    } catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء إنهاء الطلب:\n" +
            error.message
        );

    }

}


// ==========================================
// عرض تفاصيل طلب جاهز
// ==========================================

function showCompletedDetails(id) {

    const request =
        allRequests[id];


    if (!request) return;


    const execution =
        request.execution;


    if (!execution) {

        alert(
            "لا توجد تفاصيل تنفيذ لهذا الطلب"
        );

        return;

    }


    let message =

        `الزبون: ${request.name}\n` +

        `النوع: ${getTypeInfo(
            request.type
        ).title}\n` +

        `المبلغ: ${execution.price}\n` +

        `الإشارة: ${execution.signal}\n` +

        `برج الربط: ${execution.tower}`;


    if (
        execution.sector
    ) {

        message +=
            `\nالسكتور: ${execution.sector}`;

    }


    if (
        execution.problem
    ) {

        message +=
            `\nالمشكلة: ${execution.problem}`;

    }


    message +=

        `\nالمكلف: ${
            execution.completedBy?.name
            || "غير معروف"
        }`;


    alert(message);

}


// ==========================================
// الفلاتر
// ==========================================

document
    .querySelectorAll(
        ".filter-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderRequests();

            }
        );

    });


// ==========================================
// حماية النص من HTML
// ==========================================

function escapeHtml(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// تنسيق الأرقام
// ==========================================

function formatNumber(value) {

    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

        return value;

    }


    return number.toLocaleString(
        "ar-SY"
    );

}
