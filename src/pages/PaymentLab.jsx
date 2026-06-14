import { useState } from "react";
import PageShell from "../components/PageShell";
import ResultStage from "../components/ResultStage";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function PaymentLab() {
  const [cardNumber, setCardNumber] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    setScanning(true); setResult(null);
    try {
      const r = await fetch(`${API_BASE}/payment`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber: cardNumber || "4111111111111111" }),
      });
      const data = await r.json();
      await new Promise(res => setTimeout(res, 1800));
      setResult(data);
    } catch (e) { setResult({ error: e.message }); }
    setScanning(false);
  };

  return (
    <PageShell title="Payment Lab" icon="💳">
      <div className="rounded-2xl p-4 mb-4 border border-[rgba(8,145,178,0.12)] bg-white/3">
        <div className="text-[13px] font-bold text-[#22d3ee] mb-1">💳 Sandbox Testing Only</div>
        <div className="text-[11px] text-white/40 mb-3">No real payments are processed. Use test card numbers only.</div>
        <input value={cardNumber} onChange={e => setCardNumber(e.target.value)}
          placeholder="Test card number (e.g. 4111111111111111)"
          className="w-full bg-white/4 border border-[rgba(8,145,178,0.15)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] transition-colors mb-3 placeholder-white/20" />
        <button onClick={analyze} disabled={scanning}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#be185d,#6366f1)" }}>
          {scanning ? "⏳ Processing..." : "🧪 Run Payment Test"}
        </button>
      </div>
      <ResultStage scanning={scanning} scanLabel="PROCESSING...">
        {result && !result.error && (
          <div>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-3 border border-[rgba(190,24,93,0.2)]" style={{ background: "rgba(190,24,93,0.07)" }}>
              <span className="text-3xl">💳</span>
              <div>
                <div className="font-black text-base text-white">{result.gateway || "Payment Lab"} — {result.environment || "SANDBOX"}</div>
                <div className="text-[12px] text-white/50">Card: {result.cardType || "VISA"} · Validation: {result.validation || "PASSED"} · Risk: {result.riskScore ?? 0}/100</div>
              </div>
            </div>
            {(result.findings || []).map((f, i) => (
              <div key={i} className="rounded-xl p-3 mb-2 finding-low">
                <div className="font-bold text-[13px] mb-1">{f.title}</div>
                <div className="text-[12px] text-white/50">{f.value}</div>
              </div>
            ))}
          </div>
        )}
        {result?.error && (
          <div className="rounded-xl p-3 finding-high">
            <div className="font-bold text-[13px]">Connection Error</div>
            <div className="text-[12px] text-white/50 mt-1">{result.error}</div>
          </div>
        )}
      </ResultStage>
    </PageShell>
  );
}
