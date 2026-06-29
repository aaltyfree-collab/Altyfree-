document.addEventListener("DOMContentLoaded", () => {
  initAdminPage();
});

function initAdminPage() {
  const form = document.getElementById("medicineForm");
  const tableBody = document.getElementById("adminTableBody");
  const resetDataBtn = document.getElementById("resetDataBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const adminFormTitle = document.getElementById("adminFormTitle");
  const submitBtn = document.getElementById("submitBtn");

  if (!form || !tableBody) return;

  let medicines = getMedicines();
  let editingId = null;

  function renderTable() {
    medicines = getMedicines();

    tableBody.innerHTML = medicines.map(medicine => `
      <tr>
        <td>${medicine.name}</td>
        <td>${medicine.category || "-"}</td>
        <td>${medicine.company || "-"}</td>
        <td>${formatPrice(medicine.price)}</td>
        <td>
          <span class="badge ${getStockBadgeClass(medicine.stock)}">
            ${getStockLabel(medicine.stock)}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-light small" data-action="edit" data-id="${medicine.id}">تعديل</button>
            <button class="btn btn-outline small" data-action="delete" data-id="${medicine.id}">حذف</button>
          </div>
        </td>
      </tr>
    `).join("");

    attachTableActions();
  }

  function attachTableActions() {
    tableBody.querySelectorAll("button[data-action='edit']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        startEdit(id);
      });
    });

    tableBody.querySelectorAll("button[data-action='delete']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        deleteMedicine(id);
      });
    });
  }

  function startEdit(id) {
    const medicine = medicines.find(m => Number(m.id) === Number(id));
    if (!medicine) return;

    editingId = medicine.id;

    document.getElementById("medicineId").value = medicine.id;
    document.getElementById("medicineName").value = medicine.name || "";
    document.getElementById("medicineCategory").value = medicine.category || "";
    document.getElementById("medicineCompany").value = medicine.company || "";
    document.getElementById("medicinePrice").value = medicine.price ?? "";
    document.getElementById("medicineStock").value = medicine.stock || "available";
    document.getElementById("medicineDescription").value = medicine.description || "";

    adminFormTitle.textContent = "تعديل الدواء";
    submitBtn.textContent = "حفظ التعديلات";
    cancelEditBtn.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    form.reset();
    editingId = null;
    document.getElementById("medicineId").value = "";
    adminFormTitle.textContent = "إضافة دواء جديد";
    submitBtn.textContent = "حفظ الدواء";
    cancelEditBtn.style.display = "none";
  }

  function deleteMedicine(id) {
    const confirmed = confirm("هل تريد حذف هذا الدواء؟");
    if (!confirmed) return;

    const updated = medicines.filter(m => Number(m.id) !== Number(id));
    saveMedicines(updated);
    medicines = getMedicines();

    if (editingId === id) {
      resetForm();
    }

    renderTable();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const medicineData = {
      name: document.getElementById("medicineName").value.trim(),
      category: document.getElementById("medicineCategory").value.trim(),
      company: document.getElementById("medicineCompany").value.trim(),
      price: document.getElementById("medicinePrice").value.trim(),
      stock: document.getElementById("medicineStock").value,
      description: document.getElementById("medicineDescription").value.trim()
    };

    medicines = getMedicines();

    if (editingId) {
      const updated = medicines.map(medicine =>
        Number(medicine.id) === Number(editingId)
          ? { ...medicine, ...medicineData, id: editingId }
          : medicine
      );
      saveMedicines(updated);
    } else {
      const newMedicine = {
        id: getNextMedicineId(medicines),
        ...medicineData
      };
      medicines.push(newMedicine);
      saveMedicines(medicines);
    }

    resetForm();
    renderTable();
  });

  cancelEditBtn?.addEventListener("click", resetForm);

  resetDataBtn?.addEventListener("click", () => {
    const confirmed = confirm("هل تريد إرجاع الأدوية الافتراضية؟ سيتم حذف التعديلات الحالية.");
    if (!confirmed) return;

    resetMedicines();
    medicines = getMedicines();
    resetForm();
    renderTable();
  });

  renderTable();
}