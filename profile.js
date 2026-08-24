// ==========================================
// KHLLO NET
// profile.js
// تعديل حساب الموظف
// ==========================================

import {
    db,
    auth,
    storage
} from "./firebase.js";


import {
    ref as dbRef,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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


// ==========================================
// الصورة الجديدة
// ==========================================

let selectedPhoto = null;


// ==========================================
// تسجيل الدخول
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "../login.html";

        return;

    }


    currentUser = user;


    await loadProfile(user.uid);

});


// ==========================================
// تحميل الحساب
// ==========================================

async function loadProfile(uid) {

    try {

        const employeeRef =
            dbRef(
                db,
                "employees/" + uid
            );


        const snapshot =
            await get(employeeRef);


        if (!snapshot.exists()) {

            showMessage(
                "لا يوجد حساب موظف",
                "error"
            );

            return;

        }


        const data =
            snapshot.val();


        nameInput.value =
            data.name || "";


        emailInput.value =
            data.email ||
            currentUser.email ||
            "";


        phoneInput.value =
            data.phone || "";


        if (data.photo) {

            profileImage.src =
                data.photo;

        }

    } catch (error) {

        console.error(error);

        showMessage(
            "حدث خطأ أثناء تحميل الحساب",
            "error"
        );

    }

}


// ==========================================
// اختيار الصورة
// ==========================================

photoInput.addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];


        if (!file) return;


        // السماح بالصور فقط

        if (!file.type.startsWith("image/")) {

            showMessage(
                "الملف المختار ليس صورة",
                "error"
            );

            photoInput.value = "";

            return;

        }


        // الحد الأقصى 5MB

        if (file.size > 5 * 1024 * 1024) {

            showMessage(
                "حجم الصورة يجب أن يكون أقل من 5MB",
                "error"
            );

            photoInput.value = "";

            return;

        }


        selectedPhoto = file;


        // معاينة

        const reader =
            new FileReader();


        reader.onload =
            function(e) {

                profileImage.src =
                    e.target.result;

            };


        reader.readAsDataURL(file);

    }
);


// ==========================================
// حفظ الحساب
// ==========================================

saveBtn.addEventListener(
    "click",
    saveProfile
);


// ==========================================
// حفظ
// ==========================================

async function saveProfile() {

    if (!currentUser) {

        showMessage(
            "يجب تسجيل الدخول أولاً",
            "error"
        );

        return;

    }


    const phone =
        phoneInput.value.trim();


    // ======================================
    // رقم الهاتف إجباري
    // ======================================

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

    const cleanPhone =
        phone.replace(
            /[\s\-()]/g,
            ""
        );


    if (
        cleanPhone.length < 8 ||
        cleanPhone.length > 15
    ) {

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
            profileImage.src;


        // ==================================
        // رفع الصورة
        // ==================================

        if (selectedPhoto) {

            showMessage(
                "جاري رفع الصورة...",
                "success"
            );


            const fileRef =
                storageRef(
                    storage,
                    `employees/${currentUser.uid}/profile.jpg`
                );


            const uploadResult =
                await uploadBytes(
                    fileRef,
                    selectedPhoto
                );


            photoURL =
                await getDownloadURL(
                    uploadResult.ref
                );

        }


        // ==================================
        // تحديث بيانات الموظف
        // ==================================

        const employeeRef =
            dbRef(
                db,
                "employees/" +
                currentUser.uid
            );


        await update(
            employeeRef,
            {

                phone:
                    cleanPhone,

                photo:
                    photoURL,

                updatedAt:
                    Date.now()

            }
        );


        // ==================================
        // تحديث LocalStorage
        // ==================================

        localStorage.setItem(
            "employeePhone",
            cleanPhone
        );


        localStorage.setItem(
            "employeePhoto",
            photoURL
        );


        showMessage(
            "✅ تم حفظ بيانات الحساب بنجاح",
            "success"
        );


    } catch (error) {

        console.error(
            "خطأ حفظ الحساب:",
            error
        );


        showMessage(
            "حدث خطأ أثناء الحفظ: " +
            error.message,
            "error"
        );


    } finally {

        saveBtn.disabled = false;


        saveBtn.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            حفظ التعديلات

        `;

    }

}


// ==========================================
// رسالة
// ==========================================

function showMessage(
    text,
    type
) {

    message.textContent =
        text;


    message.className =
        type;


}


// ==========================================
// تسجيل الخروج
// ==========================================

window.logout =
    async function() {

        await signOut(auth);

        localStorage.clear();

        window.location.href =
            "../login.html";

    };
