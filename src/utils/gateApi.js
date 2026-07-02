const GATE_URL = "https://superagent-7ce6afb1.base44.app/functions/securecheckGate";

async function callGate(action, payload = {}) {
  try {
    const res = await fetch(GATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    return await res.json();
  } catch (err) {
    return { error: err.message || "Network error" };
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
