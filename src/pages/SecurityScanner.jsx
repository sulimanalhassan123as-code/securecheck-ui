import { useState } from "react";
import PageShell from "../components/PageShell";
import ResultStage from "../components/ResultStage";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function SecurityScanner() {
  const [targetUrl, setTargetUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  const runScan = async () => {
    if (!targetUrl.trim()) { alert("Enter a target URL"); return; }
    setScanning(true); setResult(null); setLogs([]);
    addLog("⚡ Connecting to SecureCheck engine...");
    addLog("📡 Queuing security audit...");
    try {
      const r = await fetch(`${API_BASE}/scans/start`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl }),
      });
      const d = await r.json();
      if (!d.scanId) throw new Error("No scan ID returned");
      addLog(`✅ Scan queued — ID: ${d.scanId.slice(0, 16)}...`);
      addLog("⏳ Processing security diagnostics...");
      const poll = setInterval(async () => {
        try {
          const cr = await fetch(`${API_BASE}/scans/${d.scanId}`);
          const cd = await cr.json();
          if (cd.status === "COMPLETED") {
            clearInterval(poll);
            addLog("🏁 Scan completed.");
            setResult(cd); setScanning(false);
          } else if (cd.status === "FAILED") {
            clearInterval(poll);
            addLog("❌ Scan failed."); setScanning(false);
          } else { addLog("⏳ Still processing..."); }
        } catch { clearInterval(poll); setScanning(false); }
      }, 3000);
    } catch (e) { addLog("❌ " + e.message); setScanning(false); }
  };

  const score = result?.securityScore ?? 0;
  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <PageShell title="Security Scanner" icon="🛡️">
      <div className="rounded-2xl p-4 mb-4 border border-[rgba(8,145,178,0.12)] bg-white/3">
        <div className="text-[13px] font-bold text-[#22d3ee] mb-3">Target Configuration</div>
        <input value={targetUrl} onChange={e => setTargetUrl(e.target.value)}
          placeholder="https://example.com" type="url"
          onKeyDown={e => e.key === "Enter" && runScan()}
          className="w-full bg-white/4 border border-[rgba(8,145,178,0.15)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] transition-colors mb-3 placeholder-white/20" />
        <button onClick={runScan} disabled={scanning}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)", boxShadow: "0 3px 16px rgba(8,145,178,0.25)" }}>
          {scanning ? "⏳ Scanning..." : "⚡ Start Security Scan"}
        </button>

        {/* Live log */}
        {logs.length > 0 && (
          <div className="mt-3 rounded-lg p-3 font-mono text-[11px] text-[#22d3ee] bg-black/30 border border-[rgba(8,145,178,0.1)] max-h-[100px] overflow-y-auto">
            {logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        )}
      </div>

      <ResultStage scanning={scanning} scanLabel="SCANNING TARGET...">
        {result && (
          <>
            {/* Score */}
            <div className="flex items-center gap-4 p-3 rounded-xl mb-3" style={{ background: `${scoreColor}10` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-col flex-shrink-0"
                style={{ background: `conic-gradient(${scoreColor} ${score * 3.6}deg, rgba(255,255,255,0.05) 0)` }}>
                <span className="text-xl font-black" style={{ color: scoreColor }}>{score}</span>
                <span className="text-[8px] text-white/40 uppercase">Score</span>
              </div>
              <div>
                <div className="font-black text-base" style={{ color: scoreColor }}>
                  {score >= 80 ? "Good Security" : score >= 50 ? "Needs Attention" : "High Risk"}
                </div>
                <div className="text-[12px] text-white/40 mt-0.5">
                  {result.findings?.length ?? 0} issue(s) · {result.scanType} · {result.durationMs}ms
                </div>
              </div>
            </div>
            {/* Findings */}
            {(result.findings || []).map((f, i) => (
              <div key={i} className={`rounded-xl p-3 mb-2 finding-${f.severity?.toLowerCase()}`}>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-bold text-[13px]">{f.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md badge-${f.severity?.toLowerCase()}`}>{f.severity}</span>
                </div>
                <div className="text-[12px] text-white/50 mb-1.5">{f.description}</div>
                {f.recommendation && (
                  <div className="text-[11px] text-green-300 bg-green-400/7 rounded-lg px-2 py-1.5">💡 {f.recommendation}</div>
                )}
              </div>
            ))}
            {!result.findings?.length && <div className="text-center py-4 text-white/30 text-sm">✅ No issues found — great security posture!</div>}
          </>
        )}
      </ResultStage>
    </PageShell>
  );
}
