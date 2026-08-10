const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

async function callGate(action, payload = {}) {
  const url = `${API_BASE}/gate/${action}`;
  const body = JSON.stringify({ action, ...payload });

  console.log(`[gateApi] → ${action}`, { url, body });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check if response is OK
    if (!res.ok) {
      const text = await res.text();
      console.error(`[gateApi] ✗ ${action} HTTP ${res.status}:`, text);
      try {
        return JSON.parse(text);
      } catch {
        return { error: `Server returned ${res.status}: ${text.slice(0, 200)}` };
      }
    }

    const data = await res.json();
    console.log(`[gateApi] ← ${action}`, data);
    return data;
  } catch (err) {
    console.error(`[gateApi] ✗ ${action} error:`, err);
    if (err.name === "AbortError") {
      return { error: "Request timed out — the server may be starting up. Please try again in a few seconds." };
    }
    return { error: err.message || "Network error — check your connection and try again." };
  }
}

export const Gate = {
  checkQuota: (deviceId) => callGate("check_quota", { deviceId }),
  incrementQuota: (deviceId) => callGate("increment_quota", { deviceId }),
  checkUnlock: (deviceId) => callGate("check_unlock", { deviceId }),
  initiatePayment: (deviceId) => callGate("initiate_payment", { deviceId }),
  confirmPayment: (deviceId, reference, momoTransactionId, phoneUsed) =>
    callGate("confirm_payment", { deviceId, reference, momoTransactionId, phoneUsed }),
  adminListPayments: (adminKey) => callGate("admin_list_payments", { adminKey }),
  adminApprovePayment: (adminKey, paymentId) => callGate("admin_approve_payment", { adminKey, paymentId }),
  adminRejectPayment: (adminKey, paymentId) => callGate("admin_reject_payment", { adminKey, paymentId }),
};
