// ==========================================
// KHLLO NET
// app.js
// لوحة التحكم
// ==========================================

import {
    db,
    auth
} from "./firebase.js";


import {
    ref,
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// العناصر
// ==========================================

const userName =
    document.getElementById("userName");

const userPhoto =
    document.getElementById("userPhoto");

const userRole =
    document.getElementById("userRole");


const repairsCount =
    document.getElementById("repairsCount");

const installCount =
    document.getElementById("installCount");

const moveCount =
    document.getElementById("moveCount");

const moneyCount =
    document.getElementById("moneyCount");

const lastOperations =
    document.getElementById("lastOperations");


// ==========================================
// صورة افتراضية
// ==========================================

const defaultPhoto =
    "https://via.placeholder.com/45?text=U";


// ==========================================
// التحقق من تسجيل الدخول
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        console.log(
            "المستخدم الحالي:",
            user.uid
        );


        // تحميل بيانات الموظف

        await loadEmployee(
            user.uid
        );


        // تحميل لوحة التحكم

        loadDashboard(
            user.uid
        );

    }
);


// ==========================================
// تحميل بيانات الموظف
// ==========================================

async function loadEmployee(uid) {

    try {

        const employeeRef =
            ref(
                db,
                "employees/" + uid
            );


        const snapshot =
            await get(employeeRef);


        if (!snapshot.exists()) {

            console.log(
                "لم يتم العثور على بيانات الموظف"
            );


            setEmployeeUI(
                "غير معروف",
                "موظف",
                defaultPhoto
            );


            return;

        }


        const employee =
            snapshot.val();


        console.log(
            "بيانات الموظف:",
            employee
        );


        // ==================================
        // الاسم
        // ==================================

        const name =
            employee.name ||
            "موظف";


        // ==================================
        // الصلاحية
        // ==================================

        const role =
            employee.role === "admin"
                ? "مدير"
                : "موظف";


        // ==================================
        // الصورة
        // ==================================
        //
        // نعتمد photoURL
        // وهو الاسم الموجود في profile.js
        //

        const photo =
            employee.photoURL ||
            employee.image ||
            defaultPhoto;


        // ==================================
        // عرض البيانات
        // ==================================

        setEmployeeUI(
            name,
            role,
            photo
        );


        // ==================================
        // حفظ محلي
        // ==================================

        localStorage.setItem(
            "employeeName",
            name
        );


        localStorage.setItem(
            "role",
            employee.role ||
            "employee"
        );


        localStorage.setItem(
            "employeePhoto",
            photo
        );


        localStorage.setItem(
            "employeePhone",
            employee.phone ||
            ""
        );


    } catch (error) {

        console.error(
            "خطأ تحميل بيانات الموظف:",
            error
        );


        // محاولة استخدام البيانات المحفوظة

        const savedName =
            localStorage.getItem(
                "employeeName"
            ) ||
            "غير معروف";


        const savedPhoto =
            localStorage.getItem(
                "employeePhoto"
            ) ||
            defaultPhoto;


        const savedRole =
            localStorage.getItem(
                "role"
            ) === "admin"
                ? "مدير"
                : "موظف";


        setEmployeeUI(
            savedName,
            savedRole,
            savedPhoto
        );

    }

}


// ==========================================
// عرض بيانات الموظف
// ==========================================

function setEmployeeUI(
    name,
    role,
    photo
) {

    // الاسم

    if (userName) {

        userName.textContent =
            name;

    }


    // الصلاحية

    if (userRole) {

        userRole.textContent =
            role;

    }


    // الصورة

    if (userPhoto) {

        userPhoto.src =
            photo ||
            defaultPhoto;


        // إذا الصورة لم تعمل

        userPhoto.onerror =
            function () {

                this.src =
                    defaultPhoto;

            };

    }


    // في حال كان HTML القديم
    // يستخدم userImage

    const oldImage =
        document.getElementById(
            "userImage"
        );


    if (oldImage) {

        oldImage.src =
            photo ||
            defaultPhoto;


        oldImage.onerror =
            function () {

                this.src =
                    defaultPhoto;

            };

    }

}


// ==========================================
// لوحة التحكم
// ==========================================

function loadDashboard(uid) {

    const dataRef =
        ref(
            db,
            "maintenance"
        );


    onValue(
        dataRef,
        (snapshot) => {

            let repairs = 0;

            let installs = 0;

            let moves = 0;

            let money = 0;

            let operations = [];


            // ==================================
            // الصلاحية
            // ==================================

            const role =
                localStorage.getItem(
                    "role"
                );


            console.log(
                "صلاحية المستخدم:",
                role
            );


            // ==================================
            // قراءة البيانات
            // ==================================

            snapshot.forEach(
                (item) => {

                    const data =
                        item.val();


                    if (!data) {

                        return;

                    }


                    // ==================================
                    // الموظف يرى الأعمال المكلف بها
                    // ==================================

                    if (
                        role !== "admin"
                    ) {

                        /*
                         * النظام الجديد:
                         *
                         * الطلب يحتوي:
                         *
                         * assignedTo: {
                         *    uid,
                         *    name,
                         *    email,
                         *    phone,
                         *    photoURL
                         * }
                         *
                         */


                        const assignedUID =
                            data.assignedTo?.uid;


                        /*
                         * دعم النظام القديم
                         *
                         * إذا لم يوجد assignedTo
                         * نستخدم uid القديم
                         */

                        if (
                            assignedUID
                        ) {

                            if (
                                assignedUID !== uid
                            ) {

                                return;

                            }

                        } else {

                            if (
                                data.uid !== uid
                            ) {

                                return;

                            }

                        }

                    }


                    // ==================================
                    // إضافة العملية
                    // ==================================

                    operations.push({

                        id:
                            item.key,

                        data:
                            data

                    });


                    // ==================================
                    // الصيانة
                    // ==================================

                    if (
                        data.type ===
                        "صيانة"
                    ) {

                        repairs++;

                    }


                    // ==================================
                    // التركيبة
                    // ==================================

                    else if (
                        data.type ===
                        "تركيبة"
                    ) {

                        installs++;

                    }


                    // ==================================
                    // القلبة
                    // ==================================

                    else if (
                        data.type ===
                        "قلبة"
                    ) {

                        moves++;

                    }


                    // ==================================
                    // المبلغ
                    // ==================================

                    money +=
                        Number(
                            data.price ||
                            0
                        );

                }
            );


            // ==================================
            // العدادات
            // ==================================

            if (repairsCount) {

                repairsCount.textContent =
                    repairs;

            }


            if (installCount) {

                installCount.textContent =
                    installs;

            }


            if (moveCount) {

                moveCount.textContent =
                    moves;

            }


            if (moneyCount) {

                moneyCount.textContent =
                    money;

            }


            // ==================================
            // آخر العمليات
            // ==================================

            showLastOperations(
                operations
            );

        }
    );

}


// ==========================================
// عرض آخر العمليات
// ==========================================

function showLastOperations(
    operations
) {

    if (!lastOperations) {

        return;

    }


    lastOperations.innerHTML =
        "";


    if (
        operations.length === 0
    ) {

        lastOperations.innerHTML = `

            <tr>

                <td colspan="5">

                    لا توجد بيانات

                </td>

            </tr>

        `;

        return;

    }


    // ==================================
    // ترتيب حسب التاريخ
    // ==================================

    operations.sort(
        (a, b) => {

            const dateA =
                Number(
                    a.data.createdAt ||
                    0
                );


            const dateB =
                Number(
                    b.data.createdAt ||
                    0
                );


            return dateB - dateA;

        }
    );


    // آخر 5 عمليات

    const last =
        operations.slice(
            0,
            5
        );


    // ==================================
    // عرض
    // ==================================

    last.forEach(
        (item) => {

            const d =
                item.data;


            lastOperations.innerHTML += `

                <tr>

                    <td>
                        ${escapeHtml(
                            d.type ||
                            ""
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            d.name ||
                            ""
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            d.tower ||
                            ""
                        )}
                    </td>


                    <td>
                        ${Number(
                            d.price ||
                            0
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            d.date ||
                            formatDate(
                                d.createdAt
                            )
                        )}
                    </td>

                </tr>

            `;

        }
    );

}


// ==========================================
// التاريخ
// ==========================================

function formatDate(
    timestamp
) {

    if (!timestamp) {

        return "";

    }


    try {

        return new Date(
            timestamp
        ).toLocaleDateString(
            "ar"
        );

    } catch {

        return "";

    }

}


// ==========================================
// حماية HTML
// ==========================================

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
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
