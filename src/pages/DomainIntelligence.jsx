import { useState } from "react";
import PageShell from "../components/PageShell";
import ResultStage from "../components/ResultStage";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function DomainIntelligence() {
  const [domain, setDomain] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (!domain.trim()) { alert("Enter a domain"); return; }
    setScanning(true); setResult(null);
    try {
      const r = await fetch(`${API_BASE}/domain`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await r.json();
      await new Promise(res => setTimeout(res, 2000));
      setResult(data);
    } catch (e) { setResult({ error: e.message }); }
    setScanning(false);
  };

  const riskColor = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };

  return (
    <PageShell title="Domain Intelligence" icon="🌐">
      <div className="rounded-2xl p-4 mb-4 border border-[rgba(8,145,178,0.12)] bg-white/3">
        <div className="text-[13px] font-bold text-[#22d3ee] mb-3">WHOIS & DNS Analysis</div>
        <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com"
          onKeyDown={e => e.key === "Enter" && analyze()}
          className="w-full bg-white/4 border border-[rgba(8,145,178,0.15)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] transition-colors mb-3 placeholder-white/20" />
        <button onClick={analyze} disabled={scanning}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#1d4ed8,#0891b2)" }}>
          {scanning ? "⏳ Analyzing..." : "🔍 Analyze Domain"}
        </button>
      </div>
      <ResultStage scanning={scanning} scanLabel="ANALYZING DOMAIN...">
        {result && !result.error && (
          <div>
            <div className="p-3 rounded-xl mb-3 border" style={{ background: `${riskColor[result.riskLevel] || "#0891b2"}10`, borderColor: `${riskColor[result.riskLevel] || "#0891b2"}30` }}>
              <div className="font-black text-base mb-2">{result.domain} <span className="text-sm font-bold ml-2" style={{ color: riskColor[result.riskLevel] || "#22d3ee" }}>Risk: {result.riskLevel}</span></div>
              {[
                ["Registrar", result.registrar],
                ["Created", result.creationDate],
                ["Expires", result.expirationDate],
              ].map(([k, v]) => v && v !== "Unknown" && (
                <div key={k} className="flex gap-2 text-[12px] text-white/50 mb-1">
                  <span className="text-white/30 min-w-[70px]">{k}:</span><span className="text-white/70">{v}</span>
                </div>
              ))}
              {result.nameServers && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(Array.isArray(result.nameServers) ? result.nameServers : [result.nameServers]).slice(0, 4).map((ns, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-bold text-[#22d3ee]"
                      style={{ background: "rgba(8,145,178,0.12)", border: "1px solid rgba(8,145,178,0.2)" }}>{ns}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {result?.error && <div className="rounded-xl p-3 finding-high"><div className="font-bold text-[13px]">Error</div><div className="text-[12px] text-white/50 mt-1">{result.error}</div></div>}
      </ResultStage>
    </PageShell>
  );
}
