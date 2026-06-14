import { useState } from "react";
import PageShell from "../components/PageShell";
import ResultStage from "../components/ResultStage";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function SystemManagement() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const check = async () => {
    setScanning(true); setResult(null);
    try {
      const r = await fetch(API_BASE.replace("/api", "/"));
      const data = await r.json();
      await new Promise(res => setTimeout(res, 2000));
      setResult(data);
    } catch (e) { setResult({ error: e.message }); }
    setScanning(false);
  };

  return (
    <PageShell title="System Management" icon="⚙️">
      <div className="rounded-2xl p-4 mb-4 border border-[rgba(8,145,178,0.12)] bg-white/3">
        <div className="text-[13px] font-bold text-[#22d3ee] mb-1">Runtime & Cluster Health</div>
        <div className="text-[11px] text-white/40 mb-3">Check the live status of the SecureCheck API engine on Render.</div>
        <button onClick={check} disabled={scanning}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#b45309,#0891b2)" }}>
          {scanning ? "⏳ Checking..." : "📡 Check System Status"}
        </button>
      </div>
      <ResultStage scanning={scanning} scanLabel="CHECKING SYSTEMS...">
        {result && !result.error && (
          <div className="p-3 rounded-xl border border-green-400/20" style={{ background: "rgba(16,185,129,0.07)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-black text-base text-green-400">✅ {result.status}</span>
            </div>
            {[
              ["Service", result.service],
              ["Version", result.version],
              ["Database", result.database],
              ["AI Engine", result.engine],
            ].map(([k, v]) => v && (
              <div key={k} className="flex gap-2 text-[12px] mb-1.5">
                <span className="text-white/30 min-w-[80px]">{k}:</span>
                <span className="text-white/70">{v}</span>
              </div>
            ))}
          </div>
        )}
        {result?.error && (
          <div className="rounded-xl p-3 finding-high">
            <div className="font-bold text-[13px]">Engine Unreachable</div>
            <div className="text-[12px] text-white/50 mt-1">Render may be in sleep mode. Try again in 30 seconds.</div>
          </div>
        )}
      </ResultStage>
    </PageShell>
  );
}
