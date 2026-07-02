import { useState } from "react";
import PageShell from "../components/PageShell";
import { Gate } from "../utils/gateApi";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function AdminOps() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const login = () => {
    setAuthed(true);
  };

  const loadPayments = async () => {
    setLoading(true);
    const res = await Gate.adminListPayments(pass);
    if (res.error) {
      alert(res.error);
      setAuthed(false);
    } else {
      setPayments(res.payments || []);
    }
    setLoading(false);
  };

  const approve = async (id) => {
    await Gate.adminApprovePayment(pass, id);
    loadPayments();
  };

  const reject = async (id) => {
    await Gate.adminRejectPayment(pass, id);
    loadPayments();
  };

  const clearHistory = async () => {
    if (!confirm("Clear ALL scan history for every user? This can't be undone.")) return;
    setClearing(true);
    try {
      const res = await fetch(`${API_BASE}/analyzer/history`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-key": pass },
      });
      const data = await res.json();
      if (data.success) alert(`Cleared ${data.deleted ?? "all"} scans.`);
      else alert(data.error || "Failed to clear history");
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setClearing(false);
  };

  if (!authed) {
    return (
      <PageShell title="Admin Ops" icon="🔐">
        <div className="max-w-sm mx-auto mt-10 space-y-3">
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Admin key"
            className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-white"
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button
            onClick={login}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-3 font-medium"
          >
            Unlock
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Admin Ops" icon="🔐">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={loadPayments}
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm"
          >
            {loading ? "Loading..." : "🔄 Load Pending Payments"}
          </button>
          <button
            onClick={clearHistory}
            disabled={clearing}
            className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm"
          >
            {clearing ? "Clearing..." : "🗑 Clear All Scan History"}
          </button>
        </div>

        <div className="space-y-3">
          {payments.length === 0 && (
            <p className="text-gray-500 text-sm">No pending payments loaded yet.</p>
          )}
          {payments.map((p) => (
            <div
              key={p.id}
              className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="text-sm">
                <div className="font-mono text-white">
                  {p.reference} — GHS {p.amount_ghs}
                </div>
                <div className="text-gray-500 text-xs">
                  MoMo Tx: {p.momo_transaction_id} · Phone: {p.phone_used || "n/a"}
                </div>
                <div className="text-gray-600 text-[11px]">Device: {p.device_id}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve(p.id)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg font-bold"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => reject(p.id)}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg font-bold"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
