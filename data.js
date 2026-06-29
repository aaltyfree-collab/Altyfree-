const WHATSAPP_NUMBER = "249113221887";
const STORAGE_KEY = "almaysam_medicines_v1";

const defaultMedicines = [
  {
    id: 1,
    name: "Panadol",
    category: "مسكن / خافض حرارة",
    company: "GSK",
    price: 1500,
    stock: "available",
    description: "يستخدم لتخفيف الألم وخفض الحرارة في الحالات الشائعة حسب الإرشاد الطبي."
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    category: "مضاد حيوي",
    company: "Various",
    price: 3500,
    stock: "available",
    description: "مضاد حيوي لبعض الالتهابات البكتيرية ويُستخدم حسب وصف الطبيب."
  },
  {
    id: 3,
    name: "Vitamin C",
    category: "فيتامينات",
    company: "Nature Made",
    price: 2800,
    stock: "available",
    description: "مكمل غذائي يحتوي على فيتامين C لدعم الاحتياج اليومي."
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    category: "مسكن / مضاد التهاب",
    company: "Abbott",
    price: 2200,
    stock: "available",
    description: "يساعد في تخفيف الألم والالتهاب وخفض الحرارة عند الحاجة."
  },
  {
    id: 5,
    name: "Metformin 500mg",
    category: "سكري",
    company: "Julphar",
    price: 4200,
    stock: "available",
    description: "يُستخدم لمرضى السكري حسب تقييم ووصفة الطبيب."
  },
  {
    id: 6,
    name: "Omeprazole 20mg",
    category: "معدة / حموضة",
    company: "AstraZeneca",
    price: 3000,
    stock: "unavailable",
    description: "للتعامل مع بعض حالات الحموضة وارتجاع المريء وفق الإرشاد الطبي."
  },
  {
    id: 7,
    name: "ORS",
    category: "تعويض سوائل",
    company: "Local",
    price: 800,
    stock: "available",
    description: "محلول لتعويض السوائل والأملاح عند الحاجة."
  },
  {
    id: 8,
    name: "Cetirizine",
    category: "حساسية",
    company: "Bayer",
    price: 1700,
    stock: "available",
    description: "يستخدم لبعض أعراض الحساسية حسب الإرشاد المناسب."
  }
];

function getMedicines() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Failed to parse saved medicines:", error);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMedicines));
  return [...defaultMedicines];
}

function saveMedicines(medicines) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
}

function resetMedicines() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMedicines));
}

function getMedicineById(id) {
  const medicines = getMedicines();
  return medicines.find(med => med.id === Number(id));
}

function getNextMedicineId(medicines) {
  if (!medicines.length) return 1;
  return Math.max(...medicines.map(m => Number(m.id))) + 1;
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") return "غير محدد";
  return `${Number(price).toLocaleString("en-US")} ج.س`;
}

function getStockLabel(stock) {
  return stock === "available" ? "متوفر" : "غير متوفر";
}

function getStockBadgeClass(stock) {
  return stock === "available" ? "badge-available" : "badge-unavailable";
}

function createWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function createMedicineCard(medicine) {
  return `
    <article class="card medicine-card">
      <div class="meta-row">
        <span class="badge badge-category">${medicine.category || "بدون تصنيف"}</span>
        <span class="badge ${getStockBadgeClass(medicine.stock)}">${getStockLabel(medicine.stock)}</span>
      </div>

      <h3>${medicine.name}</h3>
      <p class="muted">${medicine.company ? `الشركة: ${medicine.company}` : "شركة غير محددة"}</p>
      <p>${medicine.description ? medicine.description.slice(0, 110) : "لا يوجد وصف."}</p>
      <div class="price">${formatPrice(medicine.price)}</div>

      <div class="card-actions">
        <a class="btn btn-outline small" href="medicine.html?id=${medicine.id}">التفاصيل</a>
        <a class="btn btn-primary small" target="_blank"
          href="${createWhatsAppLink(`السلام عليكم، أريد الاستفسار عن دواء ${medicine.name}`)}">
          واتساب
        </a>
      </div>
    </article>
  `;
}