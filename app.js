document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHomePage();
  initPrescriptionForm();
});

function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

function initHomePage() {
  const medicines = getMedicines();

  const heroMedicineCount = document.getElementById("heroMedicineCount");
  if (heroMedicineCount) {
    heroMedicineCount.textContent = medicines.length;
  }

  const featuredContainer = document.getElementById("featuredMedicines");
  if (featuredContainer) {
    const featured = medicines.slice(0, 4);
    featuredContainer.innerHTML = featured.map(createMedicineCard).join("");
  }

  const homeSearchForm = document.getElementById("homeSearchForm");
  const homeSearchInput = document.getElementById("homeSearchInput");

  if (homeSearchForm && homeSearchInput) {
    homeSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = homeSearchInput.value.trim();
      const target = query
        ? `medicines.html?search=${encodeURIComponent(query)}`
        : "medicines.html";
      window.location.href = target;
    });
  }

  document.querySelectorAll(".tag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const query = btn.dataset.search || "";
      window.location.href = `medicines.html?search=${encodeURIComponent(query)}`;
    });
  });
}

function initPrescriptionForm() {
  const form = document.getElementById("prescriptionForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("customerName")?.value.trim() || "";
    const phone = document.getElementById("customerPhone")?.value.trim() || "";
    const note = document.getElementById("prescriptionText")?.value.trim() || "";

    const message = `
السلام عليكم،
لدي وصفة/طلب دواء من موقع صيدلية الميسم للطوارئ.

الاسم: ${name}
الهاتف: ${phone}
التفاصيل: ${note}
    `.trim();

    window.open(createWhatsAppLink(message), "_blank");
  });
}