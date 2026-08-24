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
    push
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// المتغيرات
// ==========================================

let currentUser = null;

let allRequests = {};

let currentFilter = "all";

let selectedRequestId = null;


// ==========================================
// المستخدم الحالي
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        console.log("لا يوجد مستخدم مسجل");

        return;

    }

    currentUser = user;

    loadRequests();

});


// ==========================================
// معلومات المستخدم
// ==========================================

function getCurrentEmployee() {

    return {

        uid:
            currentUser?.uid || "",

        email:
            currentUser?.email || "",

        name:
            localStorage.getItem(
                "employeeName"
            ) || "غير معروف",

        role:
            localStorage.getItem(
                "role"
            ) || "employee"

    };

}


// ==========================================
// هل المستخدم Admin ؟
// ==========================================

function isAdmin() {

    return (
        localStorage.getItem("role") ===
        "admin"
    );

}


// ==========================================
// هل الموظف مكلف بالطلب؟
// ==========================================

function isAssignedToRequest(request) {

    if (!currentUser || !request) {

        return false;

    }

    return (
        request.assignedTo?.uid ===
        currentUser.uid
    );

}


// ==========================================
// هل يستطيع التعامل مع الطلب؟
// ==========================================

function canHandleRequest(request) {

    if (!request) {

        return false;

    }

    // المدير يستطيع التعامل مع كل الطلبات

    if (isAdmin()) {

        return true;

    }

    // الموظف يستطيع فقط طلباته

    return isAssignedToRequest(
        request
    );

}


// ==========================================
// تحميل الطلبات
// ==========================================

function loadRequests() {

    const requestsRef =
        ref(
            db,
            "requests"
        );


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

            console.error(
                "خطأ تحميل الطلبات:",
                error
            );


            const grid =
                document.getElementById(
                    "requestsGrid"
                );


            if (grid) {

                grid.innerHTML = `

                    <div class="empty">

                        <i class="
                            fa-solid
                            fa-triangle-exclamation
                        "></i>

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

        Object.entries(
            allRequests || {}
        )

        .map(
            ([id, request]) => {

                return {

                    ...request,

                    id

                };

            }
        )

        .filter(
            request => {

                // Admin يرى كل الطلبات

                if (isAdmin()) {

                    return true;

                }


                // الموظف يرى فقط الطلبات المكلف بها

                return isAssignedToRequest(
                    request
                );

            }
        )

        .sort(

            (a, b) =>

                (
                    b.createdAt ||
                    0
                )

                -

                (
                    a.createdAt ||
                    0
                )

        );


    updateStats(
        requests
    );


    let filtered =
        requests;


    if (
        currentFilter !==
        "all"
    ) {

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

                <i class="
                    fa-solid
                    fa-inbox
                "></i>

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
            r =>
                r.status ===
                "new"
        ).length;


    const receivedCount =

        requests.filter(
            r =>
                r.status ===
                "received"
        ).length;


    const readyCount =

        requests.filter(
            r =>
                r.status ===
                "ready"
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

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ==========================================
// نوع الطلب
// ==========================================

function getTypeInfo(type) {

    if (
        type ===
        "maintenance"
    ) {

        return {

            title:
                "صيانة",

            icon:
                "fa-screwdriver-wrench"

        };

    }


    if (
        type ===
        "install"
    ) {

        return {

            title:
                "تركيبة",

            icon:
                "fa-satellite-dish"

        };

    }


    if (
        type ===
        "transfer"
    ) {

        return {

            title:
                "قلبة",

            icon:
                "fa-right-left"

        };

    }


    return {

        title:
            "طلب",

        icon:
            "fa-file"

    };

}


// ==========================================
// حالة الطلب
// ==========================================

function getStatusInfo(
    status
) {

    if (
        status ===
        "received"
    ) {

        return {

            text:
                "تم استلام الطلب",

            className:
                "received"

        };

    }


    if (
        status ===
        "ready"
    ) {

        return {

            text:
                "جاهز الطلب",

            className:
                "ready"

        };

    }


    return {

        text:
            "طلب جديد",

        className:
            ""

    };

}


// ==========================================
// إنشاء Box
// ==========================================

function createRequestBox(
    request
) {

    const type =
        getTypeInfo(
            request.type
        );


    const status =
        getStatusInfo(
            request.status
        );


    const assignedName =

        request.assignedTo?.name ||

        "غير محدد";


    let html = `

        <div
            class="request-box"
            data-id="${escapeHtml(
                request.id
            )}"
        >

            <div class="request-head">

                <div class="type">

                    <i class="
                        fa-solid
                        ${type.icon}
                    "></i>

                    ${type.title}

                </div>


                <div
                    class="
                        status
                        ${status.className}
                    "
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


    // ======================================
    // نوع التركيبة
    // ======================================

    if (

        request.type ===
        "install" &&

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


    // ======================================
    // المبلغ
    // ======================================

    if (

        request.price !==
        undefined &&

        request.price !==
        null

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


    // ======================================
    // مقدم الطلب
    // ======================================

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


                <div>

                    <span>
                        المكلف
                    </span>

                    <strong>
                        ${escapeHtml(
                            assignedName
                        )}
                    </strong>

                </div>

    `;


    // ======================================
    // المستلم
    // ======================================

    if (
        request.receivedBy?.name
    ) {

        html += `

                <div>

                    <span>
                        تم الاستلام بواسطة
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


    // ======================================
    // مشكلة الصيانة
    // ======================================

    if (

        request.type ===
        "maintenance" &&

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


    // ======================================
    // طلب جديد
    // ======================================

    if (

        request.status ===
        "new" &&

        canHandleRequest(
            request
        )

    ) {

        html += `

            <button

                class="receive-btn"

                data-action="receive"

                data-id="${escapeHtml(
                    request.id
                )}"

            >

                <i class="
                    fa-solid
                    fa-hand
                "></i>

                تم استلام الطلب

            </button>

        `;

    }


    // ======================================
    // تم الاستلام
    // ======================================

    if (

        request.status ===
        "received" &&

        canHandleRequest(
            request
        )

    ) {

        html += `

            <button

                class="ready-btn"

                data-action="ready"

                data-id="${escapeHtml(
                    request.id
                )}"

            >

                <i class="
                    fa-solid
                    fa-check
                "></i>

                جاهز الطلب

            </button>

        `;

    }


    // ======================================
    // جاهز
    // ======================================

    if (

        request.status ===
        "ready"

    ) {

        html += `

            <button

                class="details-btn"

                data-action="details"

                data-id="${escapeHtml(
                    request.id
                )}"

            >

                <i class="
                    fa-solid
                    fa-eye
                "></i>

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

        .forEach(
            button => {

                button.addEventListener(

                    "click",

                    () => {

                        const action =
                            button.dataset.action;


                        const id =
                            button.dataset.id;


                        if (
                            action ===
                            "receive"
                        ) {

                            receiveRequest(
                                id
                            );

                        }


                        if (
                            action ===
                            "ready"
                        ) {

                            openDetails(
                                id
                            );

                        }


                        if (
                            action ===
                            "details"
                        ) {

                            showCompletedDetails(
                                id
                            );

                        }

                    }

                );

            }
        );

}


// ==========================================
// استلام الطلب
// ==========================================

async function receiveRequest(
    id
) {

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


    // فحص الصلاحية

    if (
        !canHandleRequest(
            request
        )
    ) {

        alert(
            "❌ هذا الطلب غير مكلف لك"
        );

        return;

    }


    if (
        request.status !==
        "new"
    ) {

        alert(
            "الطلب لم يعد جديدًا"
        );

        return;

    }


    const employee =
        getCurrentEmployee();


    try {

        await update(

            ref(
                db,
                `requests/${id}`
            ),

            {

                status:
                    "received",

                receivedAt:
                    Date.now(),

                receivedBy:
                    employee

            }

        );


        console.log(
            "✅ تم استلام الطلب:",
            id
        );

    }

    catch (error) {

        console.error(
            "❌ خطأ استلام الطلب:",
            error
        );

        alert(

            "حدث خطأ أثناء استلام الطلب:\n" +

            error.message

        );

    }

}


// ==========================================
// فتح نافذة التنفيذ
// ==========================================

function openDetails(
    id
) {

    const request =
        allRequests[id];


    if (!request) return;


    if (
        !canHandleRequest(
            request
        )
    ) {

        alert(
            "❌ هذا الطلب غير مكلف لك"
        );

        return;

    }


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


    if (

        !modal ||

        !title ||

        !sub ||

        !problemField ||

        !sectorField

    ) {

        console.error(
            "❌ عناصر Modal ناقصة"
        );

        alert(
            "يوجد خطأ في نافذة تفاصيل التنفيذ"
        );

        return;

    }


    // ======================================
    // حسب النوع
    // ======================================

    if (

        request.type ===
        "maintenance"

    ) {

        title.textContent =
            "🛠 إنهاء طلب الصيانة";

        problemField.style.display =
            "block";

        sectorField.style.display =
            "none";

    }

    else if (

        request.type ===
        "install"

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
        `الزبون: ${
            request.name || ""
        }`;


    const problemInput =
        document.getElementById(
            "problemInput"
        );


    const priceInput =
        document.getElementById(
            "priceInput"
        );


    const signalInput =
        document.getElementById(
            "signalInput"
        );


    const towerInput =
        document.getElementById(
            "towerInput"
        );


    const sectorInput =
        document.getElementById(
            "sectorInput"
        );


    if (problemInput) {

        problemInput.value =
            request.problem || "";

    }


    if (priceInput) {

        priceInput.value =
            request.price || "";

    }


    if (signalInput) {

        signalInput.value = "";

    }


    if (towerInput) {

        towerInput.value = "";

    }


    if (sectorInput) {

        sectorInput.value = "";

    }


    modal.classList.remove(
        "hidden"
    );

}


// ==========================================
// إغلاق النافذة
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
// زر الحفظ
// ==========================================

document

    .getElementById(
        "saveDetails"
    )

    ?.addEventListener(
        "click",
        finishRequest
    );


// ==========================================
// إنهاء الطلب
// ==========================================

async function finishRequest() {

    if (!selectedRequestId) {

        alert(
            "لم يتم تحديد طلب"
        );

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
    // التحقق من الصلاحية
    // ======================================

    if (
        !canHandleRequest(
            request
        )
    ) {

        alert(
            "❌ هذا الطلب غير مكلف لك"
        );

        return;

    }


    if (
        request.status !==
        "received"
    ) {

        alert(
            "الطلب ليس بحالة تسمح بإنهائه"
        );

        return;

    }


    // ======================================
    // الحقول
    // ======================================

    const problemElement =
        document.getElementById(
            "problemInput"
        );


    const priceElement =
        document.getElementById(
            "priceInput"
        );


    const signalElement =
        document.getElementById(
            "signalInput"
        );


    const towerElement =
        document.getElementById(
            "towerInput"
        );


    const sectorElement =
        document.getElementById(
            "sectorInput"
        );


    if (

        !priceElement ||

        !signalElement ||

        !towerElement ||

        !sectorElement

    ) {

        alert(
            "خطأ: حقول تفاصيل التنفيذ غير موجودة"
        );

        return;

    }


    const problem =

        problemElement

            ? problemElement.value.trim()

            : "";


    const price =

        Number(
            priceElement.value
        ) || 0;


    const signal =
        signalElement.value.trim();


    const tower =
        towerElement.value.trim();


    const sector =
        sectorElement.value.trim();


    // ======================================
    // التحقق
    // ======================================

    if (

        request.type ===
        "maintenance" &&

        !problem

    ) {

        alert(
            "يرجى إدخال مشكلة الزبون"
        );

        return;

    }


    if (price <= 0) {

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

            request.type ===
            "install" ||

            request.type ===
            "transfer"

        ) &&

        !sector

    ) {

        alert(
            "يرجى إدخال السكتور"
        );

        return;

    }


    // ======================================
    // الموظف المنفذ
    // ======================================

    const employee =
        getCurrentEmployee();


    const now =
        Date.now();


    // ======================================
    // إنشاء سجل maintenance
    // ======================================

    const maintenanceRef =
        push(
            ref(
                db,
                "maintenance"
            )
        );


    const maintenanceId =
        maintenanceRef.key;


    if (!maintenanceId) {

        alert(
            "تعذر إنشاء رقم سجل الصيانة"
        );

        return;

    }


    // ======================================
    // بيانات التنفيذ
    // ======================================

    const execution = {

        problem:

            request.type ===
            "maintenance"

                ? problem
                : "",

        price:
            price,

        signal:
            signal,

        tower:
            tower,

        sector:

            (

                request.type ===
                "install" ||

                request.type ===
                "transfer"

            )

                ? sector
                : "",

        completedBy: {

            uid:
                employee.uid,

            email:
                employee.email,

            name:
                employee.name

        },

        completedAt:
            now

    };


    // ======================================
    // بيانات maintenance
    // ======================================

    const maintenanceData = {

        id:
            maintenanceId,

        requestId:
            selectedRequestId,

        type:
            request.type || "",

        name:
            request.name || "",

        national:
            request.national || "",

        location:
            request.location || "",

        phone:
            request.phone || "",

        problem:

            request.type ===
            "maintenance"

                ? problem
                : "",

        installType:
            request.installType || "",

        price:
            price,

        signal:
            signal,

        tower:
            tower,

        sector:

            (

                request.type ===
                "install" ||

                request.type ===
                "transfer"

            )

                ? sector
                : "",

        transfer:
            request.transfer || "",

        dish:
            request.dish === true,

        dishSignal:
            request.dishSignal || "",


        // ==================================
        // مقدم الطلب
        // ==================================

        employee:

            request.employee ||

            request.createdBy?.name ||

            "غير معروف",

        uid:

            request.uid ||

            request.createdBy?.uid ||

            "",

        email:

            request.email ||

            request.createdBy?.email ||

            "",


        // ==================================
        // المكلف الأصلي
        // ==================================

        assignedTo:

            request.assignedTo || null,


        // ==================================
        // الموظف المنفذ
        // ==================================

        completedBy:
            employee.name,

        completedByUid:
            employee.uid,

        completedByEmail:
            employee.email,


        // ==================================
        // التاريخ
        // ==================================

        date:

            new Date()
                .toLocaleDateString(
                    "ar"
                ),

        createdAt:

            request.createdAt ||
            now,

        completedAt:
            now

    };


    // ======================================
    // تحديثات قاعدة البيانات
    // ======================================

    try {

        const updates = {};


        // سجل الصيانة

        updates[
            `maintenance/${maintenanceId}`
        ] =
            maintenanceData;


        // تحديث الطلب

        updates[
            `requests/${selectedRequestId}`
        ] = {

            ...request,

            status:
                "ready",

            readyAt:
                now,

            readyBy:
                employee,

            execution:
                execution,

            maintenanceId:
                maintenanceId

        };


        console.log(
            "🟢 سيتم حفظ:",
            updates
        );


        // ==================================
        // الحفظ بعملية واحدة
        // ==================================

        await update(
            ref(db),
            updates
        );


        console.log(
            "✅ تم إنهاء الطلب بنجاح"
        );


        alert(
            "✅ تم إنهاء الطلب بنجاح\n\n" +
            "تم حفظه ضمن الصيانات"
        );


        closeModal();

    }

    catch (error) {

        console.error(
            "❌ ERROR FINISH REQUEST",
            error
        );


        if (
            error.code ===
            "PERMISSION_DENIED"
        ) {

            alert(
                "❌ Firebase رفض عملية الحفظ.\n\n" +
                "تحقق من Rules الخاصة بـ Realtime Database."
            );

        }

        else {

            alert(

                "حدث خطأ أثناء إنهاء الطلب:\n\n" +

                (
                    error.message ||
                    "خطأ غير معروف"
                )

            );

        }

    }

}


// ==========================================
// عرض التفاصيل
// ==========================================

function showCompletedDetails(
    id
) {

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

        `الزبون: ${
            request.name || ""
        }\n` +

        `النوع: ${
            getTypeInfo(
                request.type
            ).title
        }\n` +

        `المبلغ: ${
            execution.price || 0
        }\n` +

        `الإشارة: ${
            execution.signal || ""
        }\n` +

        `برج الربط: ${
            execution.tower || ""
        }`;


    if (
        execution.sector
    ) {

        message +=

            `\nالسكتور: ${
                execution.sector
            }`;

    }


    if (
        execution.problem
    ) {

        message +=

            `\nالمشكلة: ${
                execution.problem
            }`;

    }


    message +=

        `\nالمكلف: ${
            request.assignedTo?.name ||
            execution.completedBy?.name ||
            "غير معروف"
        }`;


    message +=

        `\nالمنفذ: ${
            execution.completedBy?.name ||
            "غير معروف"
        }`;


    alert(
        message
    );

}


// ==========================================
// الفلاتر
// ==========================================

document

    .querySelectorAll(
        ".filter-btn"
    )

    .forEach(
        button => {

            button.addEventListener(

                "click",

                () => {

                    document

                        .querySelectorAll(
                            ".filter-btn"
                        )

                        .forEach(
                            btn => {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    renderRequests();

                }

            );

        }
    );


// ==========================================
// حماية HTML
// ==========================================

function escapeHtml(
    value
) {

    if (

        value ===
        undefined ||

        value ===
        null

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

function formatNumber(
    value
) {

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
