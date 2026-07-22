import { db } from "./firebase.js";

import {
    ref,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const table = document.getElementById("dataTable");
let allData = [];

// تحميل البيانات
function loadData() {

    onValue(ref(db, "maintenance"), (snapshot) => {

        allData = [];

        snapshot.forEach((item) => {
            allData.push({
                id: item.key,
                data: item.val()
            });
        });

        showData(allData);

    });

}

// عرض البيانات
function showData(data) {

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="8">لا توجد بيانات</td>
        </tr>
        `;

        return;
    }

    data.forEach((item) => {

        const d = item.data;

        table.innerHTML += `
        <tr>

            <td>${d.employee || "غير معروف"}</td>

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
window.searchName = function () {

    const value = document
        .getElementById("searchName")
        .value
        .trim();

    if (value === "") {
        showData(allData);
        return;
    }

    const result = allData.filter(item =>
        (item.data.name || "").includes(value)
    );

    showData(result);

};

// حذف
window.deleteData = async function (id) {

    if (!confirm("هل تريد حذف هذا الطلب؟")) return;

    await remove(ref(db, "maintenance/" + id));

    alert("تم الحذف");

};

// تعديل
window.editData = async function (id) {

    const item = allData.find(x => x.id === id);

    if (!item) return;

    const newName = prompt("تعديل الاسم", item.data.name);

    if (!newName) return;

    await update(ref(db, "maintenance/" + id), {
        name: newName
    });

    alert("تم التعديل");

};

loadData();
