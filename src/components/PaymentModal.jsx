import { useState, useEffect } from "react";
import { Gate } from "../utils/gateApi";

export default function PaymentModal({ deviceId, onClose, onUnlocked }) {
  const [step, setStep] = useState("init"); // init -> instructions -> waiting
  const [payment, setPayment] = useState(null);
  const [txId, setTxId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const startPayment = async () => {
    setLoading(true);
    const data = await Gate.initiatePayment(deviceId);
    setPayment(data);
    setStep("instructions");
    setLoading(false);
  };

  const submitProof = async () => {
    if (!txId.trim()) {
      alert("Enter your MoMo transaction ID");
      return;
    }
    setLoading(true);
    await Gate.confirmPayment(deviceId, payment.reference, txId.trim(), phone.trim());
    setStep("waiting");
    setLoading(false);
    setPolling(true);
  };

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      const res = await Gate.checkUnlock(deviceId);
      if (res.unlocked) {
        clearInterval(interval);
        setPolling(false);
        onUnlocked();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [polling]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#0f172a] border border-purple-800 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-purple-300">🔒 Deep Security Scan</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {step === "init" && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              Deep Analysis crawls the full site, detects the tech stack, and runs AI-powered vulnerability
              review — this consumes real compute. Unlock 24 hours of Deep Scans for GHS 10.
            </p>
            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium"
            >
              {loading ? "Loading..." : "Pay via MoMo — GHS 10"}
            </button>
          </>
        )}

        {step === "instructions" && payment && (
          <>
            <div className="bg-[#1e293b] rounded-xl p-4 mb-4 space-y-2 text-sm">
              <p className="text-gray-300">
                Send <b className="text-white">GHS {payment.amount}</b> via Mobile Money to:
              </p>
              <p className="text-2xl font-mono font-bold text-emerald-400">{payment.momoNumber}</p>
              <p className="text-xs text-gray-400">
                Reference: <span className="font-mono text-white">{payment.reference}</span>
              </p>
            </div>
            <label className="block text-xs text-gray-400 mb-1">
              MoMo transaction ID (from your SMS confirmation)
            </label>
            <input
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="e.g. MP240702.1234"
              className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-3 py-2 text-sm mb-3 text-white focus:outline-none focus:border-purple-500"
            />
            <label className="block text-xs text-gray-400 mb-1">Phone number used (optional)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0599931348"
              className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-3 py-2 text-sm mb-4 text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={submitProof}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium"
            >
              {loading ? "Submitting..." : "I've Paid — Submit for Approval"}
            </button>
          </>
        )}

        {step === "waiting" && (
          <div className="text-center py-6">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-300">Waiting for payment approval...</p>
            <p className="text-xs text-gray-500 mt-2">
              This unlocks automatically once confirmed — keep this open or check back shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
