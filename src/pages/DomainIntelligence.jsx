import { useState } from "react";
import Footer from "../components/Footer";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function DomainIntelligence() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const analyzeDomain = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch(`${API_BASE}/domain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          domain
        })
      });

      const data = await res.json();
      setReport(data);
    } catch (err) {
      setReport({
        success: false,
        error: err.message
      });
    }

    setLoading(false);
  };

  const copyReport = async () => {
    if (!report) return;

    await navigator.clipboard.writeText(
      JSON.stringify(report, null, 2)
    );

    alert("Report copied");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Header Banner */}
      <div className="p-8 border-b border-gray-800/60 bg-[#0d1527]/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
            <span>🌐</span> Domain Intelligence Engine
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-2xl">
            Execute real-time tactical mapping, registration pathways, and cryptographic risk analysis for structural domain assets.
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Search Input Control Console */}
        <div className="bg-[#111827]/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-800 shadow-xl shadow-black/40 hover:border-gray-700/80 transition-all duration-300">
          <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">Target Domain Query</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="enter-target-domain.com"
              className="flex-1 p-4 rounded-xl bg-[#060b16] border border-gray-800 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
            <button
              onClick={analyzeDomain}
              disabled={loading}
              className="sm:w-48 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl px-6 py-4 shadow-lg shadow-cyan-600/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze Target</span>
              )}
            </button>
          </div>
        </div>

        {/* Tactical Intelligence Report Workspace */}
        {report && (
          <div className="animate-fadeIn">
            {report.success ? (
              <div className="bg-[#111827]/90 rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl shadow-black/60 relative overflow-hidden">
                
                {/* Decorative Tech Grid Lines */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Audit Output</span>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Intelligence Matrix Report</h2>
                  </div>
                  <button
                    onClick={copyReport}
                    className="self-start sm:self-center bg-[#1e293b] hover:bg-[#2e3d56] text-gray-300 font-semibold px-4 py-2.5 rounded-xl border border-gray-700/60 text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md"
                  >
                    📋 Copy Full JSON
                  </button>
                </div>

                {/* Information Dashboard Matrix */}
                <div className="grid gap-6 md:grid-cols-2">

                  {/* Module 1: Domain Registry Identity */}
                  <div className="bg-[#161f30]/40 border border-gray-800/80 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-all text-xs">🌐</span>
                      <h3 className="text-cyan-400 font-bold tracking-wide text-sm uppercase">Domain Identity</h3>
                    </div>
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex justify-between py-1.5 border-b border-gray-800/40"><span className="text-gray-500">Domain</span><span className="text-white font-bold">{report.domain}</span></div>
                      <div className="flex justify-between py-1.5 border-b border-gray-800/40"><span className="text-gray-500">Registrar</span><span className="text-gray-300 text-right max-w-[200px] truncate">{report.registrar}</span></div>
                      <div className="flex justify-between py-1.5 border-b border-gray-800/40"><span className="text-gray-500">WHOIS Srv</span><span className="text-gray-400 text-xs truncate max-w-[180px]">{report.raw?.registrarWhoisServer || "Unknown"}</span></div>
                      <div className="flex justify-between py-1.5"><span className="text-gray-500">Reg URL</span><span className="text-cyan-500/80 underline text-xs max-w-[180px] truncate">{report.raw?.registrarUrl || "Unknown"}</span></div>
                    </div>
                  </div>

                  {/* Module 2: Ownership Provenance */}
                  <div className="bg-[#161f30]/40 border border-gray-800/80 rounded-2xl p-5 hover:border-green-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="p-1.5 rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-all text-xs">🛡️</span>
                      <h3 className="text-green-400 font-bold tracking-wide text-sm uppercase">Ownership Provenance</h3>
                    </div>
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex justify-between py-1.5 border-b border-gray-800/40"><span className="text-gray-500">Organization</span><span className="text-gray-300 text-right max-w-[200px] truncate">{report.raw?.registrantOrganization || "Unknown"}</span></div>
                      <div className="flex justify-between py-1.5"><span className="text-gray-500">Country Location</span><span className="text-white font-bold">{report.raw?.registrantCountry || "Unknown"}</span></div>
                    </div>
                  </div>

                  {/* Module 3: Security Vectors */}
                  <div className="bg-[#161f30]/40 border border-gray-800/80 rounded-2xl p-5 hover:border-yellow-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20 transition-all text-xs">🔒</span>
                      <h3 className="text-yellow-400 font-bold tracking-wide text-sm uppercase">Security Perimeter</h3>
                    </div>
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-800/40">
                        <span className="text-gray-500">Risk Severity</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          report.riskLevel === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          report.riskLevel === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                          "bg-green-500/10 text-green-400 border-green-500/20"
                        }`}>
                          {report.riskLevel === "High" ? "🔴 High Threat" : report.riskLevel === "Medium" ? "🟡 Medium Risk" : "🟢 Low Risk"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-800/40"><span className="text-gray-500">DNSSEC Deployment</span><span className="text-gray-300">{report.raw?.dnssec || "Unknown"}</span></div>
                      <div className="flex justify-between py-1.5"><span className="text-gray-500">Operational Status</span><span className="text-gray-400 text-xs text-right max-w-[180px] truncate">{report.raw?.domainStatus || "Unknown"}</span></div>
                    </div>
                  </div>

                  {/* Module 4: Lifecycle Chronology */}
                  <div className="bg-[#161f30]/40 border border-gray-800/80 rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-all text-xs">📅</span>
                      <h3 className="text-purple-400 font-bold tracking-wide text-sm uppercase">Lifecycle Chronology</h3>
                    </div>
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex justify-between py-1.5 border-b border-gray-800/40"><span className="text-gray-500">Creation Timestamp</span><span className="text-white font-bold">{report.creationDate}</span></div>
                      <div className="flex justify-between py-1.5 border-b border-gray-800/40"><span className="text-gray-300">{report.raw?.updatedDate || "Unknown"}</span></div>
                      <div className="flex justify-between py-1.5"><span className="text-orange-400 font-bold">{report.expirationDate}</span></div>
                    </div>
                  </div>

                  {/* Module 5: Core Infrastructure */}
                  <div className="bg-[#161f30]/40 border border-gray-800/80 rounded-2xl p-5 hover:border-orange-500/30 transition-all duration-300 group md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-all text-xs">⚙️</span>
                      <h3 className="text-orange-400 font-bold tracking-wide text-sm uppercase">Routing Cluster Infrastructure</h3>
                    </div>
                    <div className="bg-[#070c16] rounded-xl p-4 border border-gray-800/60 font-mono text-xs text-gray-300 break-all leading-relaxed">
                      <span className="text-gray-500 block mb-1 font-sans font-semibold text-[11px] uppercase tracking-wider">Active Name Servers:</span>
                      {Array.isArray(report.nameServers) ? report.nameServers.join("  |  ") : report.nameServers}
                    </div>
                  </div>

                  {/* Module 6: Threat Escalation Contact */}
                  <div className="bg-[#161f30]/40 border border-gray-800/80 rounded-2xl p-5 hover:border-red-500/30 transition-all duration-300 group md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-all text-xs">🚨</span>
                      <h3 className="text-red-400 font-bold tracking-wide text-sm uppercase">Abuse Escalation Center</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 font-mono text-sm">
                      <div className="bg-[#070c16] p-3 rounded-xl border border-gray-800/60"><span className="text-gray-500 block text-xs font-sans mb-1 font-semibold">Abuse Contact Mail</span><span className="text-gray-200 text-xs break-all">{report.raw?.registrarAbuseContact || "Unknown"}</span></div>
                      <div className="bg-[#070c16] p-3 rounded-xl border border-gray-800/60"><span className="text-gray-500 block text-xs font-sans mb-1 font-semibold">Abuse Contact Phone</span><span className="text-gray-200 text-xs">{report.raw?.registrarAbuseContactPhone || "Unknown"}</span></div>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 text-center text-red-400 font-mono text-sm shadow-xl">
                ⚠️ [CRITICAL CLUSTER FAILURE]: {report.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Branding Area */}
      <div className="text-center text-gray-600 text-xs tracking-wide py-6 border-t border-gray-900 bg-[#070c15]">
        Powered by <span className="text-gray-400 font-semibold">Suleiman Alhassan</span> • Architectural Security System
      </div>

      <Footer />
    </div>
  );
}
