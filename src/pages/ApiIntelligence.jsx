import { useState } from "react";
import PageShell from "../components/PageShell";
import ResultStage from "../components/ResultStage";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function ApiIntelligence() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (!url.trim()) { alert("Enter a URL"); return; }
    setScanning(true); setResult(null);
    try {
      const r = await fetch(`${API_BASE}/apiintel`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await r.json();
      await new Promise(res => setTimeout(res, 1800));
      setResult(data);
    } catch (e) { setResult({ error: e.message }); }
    setScanning(false);
  };

  return (
    <PageShell title="API Intelligence" icon="🔌">
      <div className="rounded-2xl p-4 mb-4 border border-[rgba(8,145,178,0.12)] bg-white/3">
        <div className="text-[13px] font-bold text-[#22d3ee] mb-3">Inspect API Endpoints</div>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com" type="url"
          onKeyDown={e => e.key === "Enter" && analyze()}
          className="w-full bg-white/4 border border-[rgba(8,145,178,0.15)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] transition-colors mb-3 placeholder-white/20" />
        <button onClick={analyze} disabled={scanning}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#7c3aed,#0891b2)" }}>
          {scanning ? "⏳ Probing..." : "🔍 Analyze API"}
        </button>
      </div>
      <ResultStage scanning={scanning} scanLabel="PROBING API...">
        {result && !result.error && (
          <div>
            <div className="p-3 rounded-xl mb-3 border border-[rgba(124,58,237,0.2)]" style={{ background: "rgba(124,58,237,0.07)" }}>
              <div className="font-black text-base mb-2">Status: <span className="text-[#22d3ee]">{result.status}</span> · {result.responseTime}</div>
              <div className="text-[12px] text-white/50 mb-2">Version: {result.apiVersion}</div>
              <div className="flex flex-wrap gap-1.5">
                {(result.endpoints || []).map((ep, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md font-mono font-bold text-[#22d3ee]"
                    style={{ background: "rgba(8,145,178,0.12)", border: "1px solid rgba(8,145,178,0.2)" }}>{ep}</span>
                ))}
              </div>
            </div>
            {(result.findings || []).map((f, i) => (
              <div key={i} className="rounded-xl p-3 mb-2 finding-medium">
                <div className="font-bold text-[13px] mb-1">{f.title}</div>
                <div className="text-[12px] text-white/50">{f.value}</div>
              </div>
            ))}
          </div>
        )}
        {result?.error && <div className="rounded-xl p-3 finding-high"><div className="font-bold text-[13px]">Error</div><div className="text-[12px] text-white/50 mt-1">{result.error}</div></div>}
      </ResultStage>
    </PageShell>
  );
}
