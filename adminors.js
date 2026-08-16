import { database } from "./firebase.js";
import {
  ref,
  get,
  update
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const body = document.getElementById("requestsBody");
const total = document.getElementById("total");
const refresh = document.getElementById("refreshBtn");
const modal = document.getElementById("acceptModal");
const modalName = document.getElementById("modalName");
const daysInput = document.getElementById("daysInput");
const confirmAccept = document.getElementById("confirmAccept");
const cancelAccept = document.getElementById("cancelAccept");

let selectedId = null;

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dateText(timestamp) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(timestamp));
}

function statusHTML(item) {
  if (item.status === "accepted") {
    return `<span class="accepted">تم القبول - ${escapeHTML(item.compensationDays)} يوم</span>`;
  }

  return `<button class="accept-btn" data-id="${escapeHTML(item.nationalId)}" data-name="${escapeHTML(item.fullName)}">
    تم قبول الطلب
  </button>`;
}

async function loadRequests() {
  body.innerHTML =
    '<tr><td colspan="5" class="empty">جاري تحميل الطلبات...</td></tr>';

  try {
    const snapshot = await get(ref(database, "compensationRequests"));
    const data = snapshot.val() || {};

    const requests = Object.values(data).sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );

    total.textContent = requests.length;

    if (!requests.length) {
      body.innerHTML =
        '<tr><td colspan="5" class="empty">لا توجد طلبات حتى الآن.</td></tr>';
      return;
    }

    body.innerHTML = requests.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(item.fullName)}</td>
        <td class="national">${escapeHTML(item.nationalId)}</td>
        <td>${dateText(item.createdAt)}</td>
        <td>${statusHTML(item)}</td>
      </tr>
    `).join("");

    document.querySelectorAll(".accept-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedId = btn.dataset.id;
        modalName.textContent = btn.dataset.name;
        daysInput.value = 7;
        modal.classList.remove("hidden");
        daysInput.focus();
      });
    });

  } catch (error) {
    console.error(error);
    body.innerHTML =
      '<tr><td colspan="5" class="empty error">تعذر الوصول إلى قاعدة البيانات.</td></tr>';
  }
}

confirmAccept.addEventListener("click", async () => {
  const days = Number(daysInput.value);

  if (!selectedId || !Number.isInteger(days) || days < 1 || days > 365) {
    alert("أدخل عدد أيام صحيح بين 1 و365.");
    return;
  }

  confirmAccept.disabled = true;
  confirmAccept.textContent = "جاري الحفظ...";

  try {
    await update(
      ref(database, "compensationRequests/" + selectedId),
      {
        status: "accepted",
        compensationDays: days,
        acceptedAt: Date.now()
      }
    );

    modal.classList.add("hidden");
    selectedId = null;
    await loadRequests();

  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء تحديث الطلب.");
  } finally {
    confirmAccept.disabled = false;
    confirmAccept.textContent = "تأكيد القبول";
  }
});

cancelAccept.addEventListener("click", () => {
  modal.classList.add("hidden");
  selectedId = null;
});

refresh.addEventListener("click", loadRequests);
loadRequests();
