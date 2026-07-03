import { useState } from "react";
import PageShell from "../components/PageShell";
import { Gate } from "../utils/gateApi";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

const TABS = ["Payments", "Activity", "Payment Lab", "Danger Zone"];

export default function AdminOps() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("Payments");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardReport, setCardReport] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);

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

  const loadActivity = async () => {
    setActivityLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyzer/activity?limit=100`, {
        headers: { "x-admin-key": pass },
      });
      const data = await res.json();
      if (data.success) setActivity(data.activity || []);
      else alert(data.error || "Failed to load activity");
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setActivityLoading(false);
  };

  const analyzeCard = async () => {
    if (!cardNumber.trim()) return alert("Enter a card number");
    setCardLoading(true);
    setCardReport(null);
    try {
      const res = await fetch(`${API_BASE}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": pass },
        body: JSON.stringify({ cardNumber }),
      });
      const data = await res.json();
      setCardReport(data);
    } catch (err) {
      alert("Payment analysis failed");
    }
    setCardLoading(false);
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
        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-purple-600 text-white"
                  : "bg-[#0f172a] text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Payments" && (
          <div className="space-y-4">
            <button
              onClick={loadPayments}
              disabled={loading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg py-3 px-6 font-medium text-sm"
            >
              {loading ? "Loading..." : "🔄 Load Pending Payments"}
            </button>

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
        )}

        {tab === "Activity" && (
          <div className="space-y-4">
            <button
              onClick={loadActivity}
              disabled={activityLoading}
              className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg py-3 px-6 font-medium text-sm"
            >
              {activityLoading ? "Loading..." : "🔄 Load Scan Activity"}
            </button>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="py-2 pr-4">When</th>
                    <th className="py-2 pr-4">Target</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2 pr-4">User</th>
                    <th className="py-2 pr-4">Location</th>
                    <th className="py-2 pr-4">Device / IP</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((a) => (
                    <tr key={a.id} className="border-b border-gray-900 text-gray-300">
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 break-all max-w-[160px]">{a.targetUrl}</td>
                      <td className="py-2 pr-4">{a.scanType}</td>
                      <td className="py-2 pr-4">{a.securityScore ?? "—"}</td>
                      <td className="py-2 pr-4">
                        {a.userName || a.userEmail || (
                          <span className="text-gray-600">anonymous</span>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {[a.city, a.country].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="py-2 pr-4 max-w-[180px] truncate" title={a.userAgent || ""}>
                        {a.ipAddress || "—"}
                      </td>
                    </tr>
                  ))}
                  {activity.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-4 text-gray-500 text-center">
                        No activity loaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Payment Lab" && (
          <div className="space-y-4 max-w-lg">
            <p className="text-xs text-gray-500">
              Admin-only card format / Luhn sandbox checker. Not exposed publicly.
            </p>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4111 2222 3333 4444"
              maxLength={19}
              className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-white font-mono"
            />
            <button
              onClick={analyzeCard}
              disabled={cardLoading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium"
            >
              {cardLoading ? "Analyzing..." : "Analyze Card"}
            </button>
            {cardReport && (
              <pre className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(cardReport, null, 2)}
              </pre>
            )}
          </div>
        )}

        {tab === "Danger Zone" && (
          <div className="max-w-md">
            <button
              onClick={clearHistory}
              disabled={clearing}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm"
            >
              {clearing ? "Clearing..." : "🗑 Clear All Scan History"}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
