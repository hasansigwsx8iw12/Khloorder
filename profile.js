// ==========================================
// KHLLO NET
// profile.js
// حساب الموظف
// ==========================================

import {
    db,
    auth,
    storage
} from "./firebase.js";


import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// ==========================================
// العناصر
// ==========================================

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const photoInput =
    document.getElementById("photoInput");

const profileImage =
    document.getElementById("profileImage");

const saveBtn =
    document.getElementById("saveBtn");

const message =
    document.getElementById("message");


// ==========================================
// المستخدم
// ==========================================

let currentUser = null;

let currentEmployee = null;

let selectedPhoto = null;


// ==========================================
// صورة افتراضية
// ==========================================

const defaultPhoto =
    "https://via.placeholder.com/125?text=User";


// ==========================================
// تسجيل الدخول
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        currentUser = user;


        console.log(
            "المستخدم:",
            user.uid
        );


        await loadProfile();

    }
);


// ==========================================
// تحميل بيانات الموظف
// ==========================================

async function loadProfile() {

    try {

        const employeeRef =
            ref(
                db,
                "employees/" +
                currentUser.uid
            );


        const snapshot =
            await get(employeeRef);


        if (snapshot.exists()) {

            currentEmployee =
                snapshot.val();

        } else {

            currentEmployee = {};

        }


        // الاسم

        nameInput.value =
            currentEmployee.name ||
            localStorage.getItem(
                "employeeName"
            ) ||
            "غير معروف";


        // البريد

        emailInput.value =
            currentEmployee.email ||
            currentUser.email ||
            "";


        // الهاتف

        phoneInput.value =
            currentEmployee.phone ||
            "";


        // الصورة

        if (
            currentEmployee.photoURL
        ) {

            profileImage.src =
                currentEmployee.photoURL;

        } else {

            profileImage.src =
                defaultPhoto;

        }


        console.log(
            "بيانات الموظف:",
            currentEmployee
        );


    } catch (error) {

        console.error(
            "خطأ تحميل الحساب:",
            error
        );


        showMessage(
            "حدث خطأ أثناء تحميل بيانات الحساب",
            "error"
        );

    }

}


// ==========================================
// اختيار الصورة
// ==========================================

if (photoInput) {

    photoInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                return;

            }


            // التأكد من أنها صورة

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "الملف المختار ليس صورة",
                    "error"
                );

                this.value = "";

                return;

            }


            // حجم الصورة
            // 5MB

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                showMessage(
                    "حجم الصورة يجب أن يكون أقل من 5MB",
                    "error"
                );

                this.value = "";

                return;

            }


            selectedPhoto =
                file;


            // عرض الصورة مباشرة

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    profileImage.src =
                        event.target.result;

                };


            reader.readAsDataURL(file);

        }
    );

}


// ==========================================
// حفظ الحساب
// ==========================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        saveProfile
    );

}


async function saveProfile() {

    if (!currentUser) {

        showMessage(
            "يجب تسجيل الدخول أولاً",
            "error"
        );

        return;

    }


    // ======================================
    // رقم الهاتف
    // ======================================

    const phone =
        phoneInput.value.trim();


    if (!phone) {

        showMessage(
            "رقم الهاتف إجباري",
            "error"
        );


        phoneInput.focus();

        return;

    }


    // ======================================
    // التحقق من الرقم
    // ======================================

    if (phone.length < 8) {

        showMessage(
            "يرجى إدخال رقم هاتف صحيح",
            "error"
        );


        phoneInput.focus();

        return;

    }


    try {

        saveBtn.disabled = true;


        saveBtn.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            جاري الحفظ...

        `;


        let photoURL =
            currentEmployee?.photoURL ||
            "";


        // ==================================
        // رفع الصورة
        // ==================================

        if (selectedPhoto) {

            showMessage(
                "جاري رفع الصورة...",
                "success"
            );


            const fileExtension =
                selectedPhoto.name
                    .split(".")
                    .pop();


            const imageRef =
                storageRef(
                    storage,
                    "employees/" +
                    currentUser.uid +
                    "/profile." +
                    fileExtension
                );


            const uploadResult =
                await uploadBytes(
                    imageRef,
                    selectedPhoto
                );


            console.log(
                "تم رفع الصورة:",
                uploadResult
            );


            photoURL =
                await getDownloadURL(
                    imageRef
                );


            console.log(
                "رابط الصورة:",
                photoURL
            );

        }


        // ==================================
        // بيانات الموظف
        // ==================================

        const employeeData = {

            phone:

                phone,

            photoURL:

                photoURL,

            updatedAt:

                Date.now()

        };


        // ==================================
        // تحديث Firebase
        // ==================================

        await update(

            ref(
                db,
                "employees/" +
                currentUser.uid
            ),

            employeeData

        );


        // ==================================
        // تحديث البيانات المحلية
        // ==================================

        localStorage.setItem(
            "employeePhone",
            phone
        );


        if (photoURL) {

            localStorage.setItem(
                "employeePhoto",
                photoURL
            );

        }


        if (
            currentEmployee
        ) {

            currentEmployee.phone =
                phone;

            currentEmployee.photoURL =
                photoURL;

        }


        selectedPhoto = null;


        showMessage(
            "✅ تم حفظ الحساب بنجاح",
            "success"
        );


        saveBtn.innerHTML = `

            <i class="fa-solid fa-check"></i>

            تم الحفظ

        `;


        setTimeout(
            () => {

                saveBtn.innerHTML = `

                    <i class="fa-solid fa-floppy-disk"></i>

                    حفظ التعديلات

                `;

            },
            2000
        );


    } catch (error) {

        console.error(
            "خطأ حفظ الحساب:",
            error
        );


        showMessage(
            "حدث خطأ: " +
            error.message,
            "error"
        );


        saveBtn.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            حفظ التعديلات

        `;

    } finally {

        saveBtn.disabled = false;

    }

}


// ==========================================
// رسالة
// ==========================================

function showMessage(
    text,
    type
) {

    if (!message) return;


    message.textContent =
        text;


    message.className =
        type;


    setTimeout(
        () => {

            if (
                message.textContent ===
                text
            ) {

                message.textContent =
                    "";

            }

        },
        4000
    );

}
