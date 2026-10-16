// ============================================================================
// CELL PLANET ERP - LIVE PRODUCTION CONFIGURATION (config.js)
// Engineered by High-Fledged Engineering And Digital Tech Solutions
// ============================================================================

export const ERP_CONFIG = {
  // 1. LIVE FIREBASE CONFIGURATION (cellplanet-536a6)
  firebaseConfig: {
    apiKey: "AIzaSyB8Nom_BQcJExfPWwQ3thT-snf9kMT3soA",
    authDomain: "cellplanet-536a6.firebaseapp.com",
    databaseURL: "https://cellplanet-536a6-default-rtdb.firebaseio.com",
    projectId: "cellplanet-536a6",
    storageBucket: "cellplanet-536a6.firebasestorage.app",
    messagingSenderId: "1093902453375",
    appId: "1:1093902453375:web:1b5e32da682a61fde38d4a",
    measurementId: "G-EYGNNSNENG"
  },

  // 2. LIVE GOOGLE APPS SCRIPT WEBHOOK & GOOGLE SHEET ID
  appsScriptWebhookUrl: "https://script.google.com/macros/s/AKfycbxY-vNU0jBrnJBFl0dxZJiro0yIrIdVE7ji6UXkZbO0DKKNcqiHPRwC1esIUbwoN3GCyA/exec",
  googleSheetId: "1P-dy8N3KpfefBB0EdwMCIKrc_YgbiQA202JlMKM7rQ8",

  // 3. DEFAULT SHOP & SECURITY PROFILE (Editable live from Admin Portal)
  defaultShop: {
    name: "CELL PLANET",
    tagline: "Multi-Brand Smartphones, Original Accessories & Express Service Hub",
    address: "Main Road, Khammam, Telangana - 507001",
    phone: "+91 98765 43210",
    gstin: "36XXXXX1234X1Z5",
    upiId: "cellplanet@ybl",
    adminPin: "9999",
    overridePin: "7777",
    techPurgePin: "2026",
    insuranceClause: "INSURANCE & WARRANTY TERMS: Physical/liquid damage protection is valid strictly subject to Policy Provider approval within 48 hours of incident. Brand warranty is covered by respective Authorized Service Centers.",
    staff: [
      { code: "S1", name: "Staff #1" },
      { code: "S2", name: "Staff #2" },
      { code: "S3", name: "Staff #3" },
      { code: "S4", name: "Staff #4" }
    ],
    brands: ["Apple", "Xiaomi", "Vivo", "Motorola", "Samsung", "OnePlus", "Realme", "Oppo", "Accessories", "Pre-Owned"]
  }
};

// ============================================================================
// AUTOMATIC GOOGLE SHEETS SYNC + OFFLINE FALLBACK QUEUE
// ============================================================================
export async function syncToGoogleSheet(payload) {
  try {
    await fetch(ERP_CONFIG.appsScriptWebhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (err) {
    console.warn("Offline mode: Queued transaction for Google Sheets sync", err);
    const q = JSON.parse(localStorage.getItem("cp_offline_queue") || "[]");
    q.push(payload);
    localStorage.setItem("cp_offline_queue", JSON.stringify(q));
    return false;
  }
}

// Flush offline queue automatically when internet reconnects
window.addEventListener("online", async () => {
  const q = JSON.parse(localStorage.getItem("cp_offline_queue") || "[]");
  if (q.length === 0) return;
  localStorage.removeItem("cp_offline_queue");
  for (const item of q) {
    await syncToGoogleSheet(item);
  }
});

// 1-Click Native Microsoft Excel (.xlsx) Workbook Download
export function downloadExcelBackup() {
  const url = `https://docs.google.com/spreadsheets/d/${ERP_CONFIG.googleSheetId}/export?format=xlsx`;
  window.open(url, "_blank");
}

// Open Live Google Sheet in new tab
export function openLiveGoogleSheet() {
  const url = `https://docs.google.com/spreadsheets/d/${ERP_CONFIG.googleSheetId}/edit`;
  window.open(url, "_blank");
}
