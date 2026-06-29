document.addEventListener("DOMContentLoaded", () => {
  initMedicinesPage();
});

function initMedicinesPage() {
  const medicines = getMedicines();

  const searchInput = document.getElementById("medicineSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const availabilityFilter = document.getElementById("availabilityFilter");
  const medicinesGrid = document.getElementById("medicinesGrid");
  const resultsCount = document.getElementById("resultsCount");
  const noMedicines = document.getElementById("noMedicines");

  if (!medicinesGrid) return;

  populateCategories(medicines, categoryFilter);

  const params = new URLSearchParams(window.location.search);
  const initialSearch = params.get("search") || "";
  if (searchInput) searchInput.value = initialSearch;

  function render() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const category = categoryFilter?.value || "";
    const availability = availabilityFilter?.value || "";

    const filtered = medicines.filter(medicine => {
      const matchesQuery =
        !query ||
        medicine.name.toLowerCase().includes(query) ||
        (medicine.category || "").toLowerCase().includes(query) ||
        (medicine.company || "").toLowerCase().includes(query) ||
        (medicine.description || "").toLowerCase().includes(query);

      const matchesCategory = !category || medicine.category === category;
      const matchesAvailability = !availability || medicine.stock === availability;

      return matchesQuery && matchesCategory && matchesAvailability;
    });

    medicinesGrid.innerHTML = filtered.map(createMedicineCard).join("");
    resultsCount.textContent = `${filtered.length} دواء`;
    noMedicines.style.display = filtered.length ? "none" : "block";
  }

  searchInput?.addEventListener("input", render);
  categoryFilter?.addEventListener("change", render);
  availabilityFilter?.addEventListener("change", render);

  render();
}

function populateCategories(medicines, categoryFilter) {
  if (!categoryFilter) return;

  const uniqueCategories = [...new Set(
    medicines
      .map(m => m.category)
      .filter(Boolean)
  )];

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}