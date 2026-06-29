document.addEventListener("DOMContentLoaded", () => {
  renderMedicineDetails();
});

function renderMedicineDetails() {
  const container = document.getElementById("medicineDetailsContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = `
      <div class="card details-card">
        <h2>لم يتم تحديد دواء</h2>
        <p class="muted">الرجاء العودة إلى صفحة الأدوية واختيار دواء لعرض التفاصيل.</p>
        <a href="medicines.html" class="btn btn-primary">العودة للأدوية</a>
      </div>
    `;
    return;
  }

  const medicine = getMedicineById(id);

  if (!medicine) {
    container.innerHTML = `
      <div class="card details-card">
        <h2>الدواء غير موجود</h2>
        <p class="muted">ربما تم حذف هذا الدواء أو الرابط غير صحيح.</p>
        <a href="medicines.html" class="btn btn-primary">العودة للأدوية</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="card details-card">
      <div class="details-header">
        <div class="details-title">
          <div class="meta-row">
            <span class="badge badge-category">${medicine.category || "بدون تصنيف"}</span>
            <span class="badge ${getStockBadgeClass(medicine.stock)}">${getStockLabel(medicine.stock)}</span>
          </div>
          <h2>${medicine.name}</h2>
          <p class="muted">${medicine.company ? `الشركة المنتجة: ${medicine.company}` : "شركة غير محددة"}</p>
        </div>

        <div class="price">${formatPrice(medicine.price)}</div>
      </div>

      <div class="details-grid">
        <div class="details-box">
          <h3>وصف الدواء</h3>
          <p>${medicine.description || "لا يوجد وصف مضاف لهذا الدواء."}</p>
        </div>

        <div class="details-box">
          <h3>طلب أو استفسار</h3>
          <p class="muted">يمكنك التواصل مباشرة عبر واتساب بخصوص هذا الدواء.</p>
          <div class="card-actions">
            <a class="btn btn-primary"
              target="_blank"
              href="${createWhatsAppLink(`السلام عليكم، أريد الاستفسار عن دواء ${medicine.name}`)}">
              استفسار عبر واتساب
            </a>
            <a class="btn btn-outline" href="medicines.html">العودة للأدوية</a>
          </div>
        </div>
      </div>
    </div>
  `;
}