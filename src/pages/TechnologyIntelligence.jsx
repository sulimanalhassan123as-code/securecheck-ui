import { useState } from "react";
import PageShell from "../components/PageShell";
import ResultStage from "../components/ResultStage";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function TechnologyIntelligence() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const detect = async () => {
    if (!url.trim()) { alert("Enter a URL"); return; }
    setScanning(true); setResult(null);
    try {
      const r = await fetch(`${API_BASE}/technology`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await r.json();
      await new Promise(res => setTimeout(res, 1600));
      setResult(data);
    } catch (e) { setResult({ error: e.message }); }
    setScanning(false);
  };

  return (
    <PageShell title="Technology Intelligence" icon="🔬">
      <div className="rounded-2xl p-4 mb-4 border border-[rgba(8,145,178,0.12)] bg-white/3">
        <div className="text-[13px] font-bold text-[#22d3ee] mb-3">Detect Technology Stack</div>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" type="url"
          onKeyDown={e => e.key === "Enter" && detect()}
          className="w-full bg-white/4 border border-[rgba(8,145,178,0.15)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] transition-colors mb-3 placeholder-white/20" />
        <button onClick={detect} disabled={scanning}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#0f766e,#0891b2)" }}>
          {scanning ? "⏳ Detecting..." : "🔍 Detect Stack"}
        </button>
      </div>
      <ResultStage scanning={scanning} scanLabel="DETECTING STACK...">
        {result && !result.error && (
          <div>
            <div className="p-3 rounded-xl mb-3 border border-[rgba(16,185,129,0.2)]" style={{ background: "rgba(16,185,129,0.07)" }}>
              <div className="font-black text-base text-white mb-1">Score: {result.score || 0}/100</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(result.technologies || []).map((t, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full font-bold text-[#22d3ee]"
                    style={{ background: "rgba(8,145,178,0.12)", border: "1px solid rgba(8,145,178,0.2)" }}>{t}</span>
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
