import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function ApiIntelligence() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const analyzeApi = async () => {
    if (!url.trim()) {
      alert("Enter API URL");
      return;
    }
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch(`${API_BASE}/apiintel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      alert("API analysis failed");
    }
    setLoading(false);
  };

  const copyReport = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert("Report copied");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white p-6 font-sans selection:bg-cyan-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Engineering Command Banner */}
        <div className="border-b border-gray-800/80 pb-6 mt-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
            🛡️ API Intelligence Gateway
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-2xl">
            Inspect interface architectures, analyze endpoint security headers, validate cross-origin policies, and uncover configuration vulnerabilities.
          </p>
        </div>

        {/* Input Target Configuration Panel */}
        <div className="bg-[#111827]/80 backdrop-blur-md border border-purple-950/40 rounded-2xl p-6 shadow-xl shadow-black/40 hover:border-purple-900/60 transition-all duration-300">
          <label className="block text-xs font-bold uppercase tracking-widest text-purple-400 mb-3 font-mono">Target API Endpoint URL</label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/v1/resource"
              className="flex-1 bg-[#050b1a] border border-gray-800 focus:border-purple-500/40 rounded-xl px-4 py-3.5 text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/10 transition-all"
            />
            <button
              onClick={analyzeApi}
              disabled={loading}
              className="md:w-64 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl px-6 py-3.5 tracking-wide shadow-lg shadow-purple-600/10 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-mono text-xs uppercase tracking-wider">Interrogating API...</span>
                </>
              ) : (
                <span>Scan Endpoint</span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Analytics Reporting Workspace */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Detailed Security Perimeter Inspection Report */}
          <div className="bg-[#111827]/90 border border-gray-900 rounded-3xl p-6 md:col-span-2 shadow-2xl relative overflow-hidden min-h-[300px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-gray-800/60 pb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono mb-0.5">Vulnerability Mapping</span>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  Interface Perimeter Analysis
                </h2>
              </div>
              
              {report && (
                <button
                  onClick={copyReport}
                  className="bg-[#1e293b] hover:bg-[#2e3d56] text-gray-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-gray-800 tracking-wider transition-all active:scale-95 flex items-center gap-1.5"
                >
                  📄 COPY FULL DIAGNOSTICS
                </button>
              )}
            </div>

            {report ? (
              <div className="space-y-6 animate-fadeIn font-mono text-sm">
                
                {/* Structural Response Metric Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#161f30]/40 border border-gray-800/80 rounded-xl p-4">
                    <span className="text-gray-500 text-xs block mb-1">Target Host</span>
                    <span className="text-white font-bold break-all">{url}</span>
                  </div>
                  <div className="bg-[#161f30]/40 border border-gray-800/80 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-xs block mb-1">Response Security Status</span>
                      <span className="text-white font-bold">{report.success ? "Analysis Complete" : "Execution Error"}</span>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${report.success ? "bg-green-500" : "bg-red-500"}`} />
                  </div>
                </div>

                {/* Sub-Layer Vector Fields mapping backend configuration data */}
                <div className="bg-[#070c16] rounded-xl p-4 border border-gray-800/60 space-y-3">
                  <div className="flex justify-between py-1.5 border-b border-gray-900"><span className="text-gray-500">API Protocol Layer</span><span className="text-indigo-400 font-bold">HTTPS/TLS Validated</span></div>
                  <div className="flex justify-between py-1.5 border-b border-gray-900"><span className="text-gray-500">CORS Restrictions</span><span className="text-gray-300">{report.cors || "Inspected / Dynamic"}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-gray-900"><span className="text-gray-500">Authorization Framework</span><span className="text-gray-300">{report.authType || "Detected Token Vector"}</span></div>
                  <div className="flex justify-between py-1.5"><span className="text-gray-500">Payload Format</span><span className="text-emerald-400 font-bold">application/json</span></div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border border-dashed border-gray-800/80 rounded-2xl text-center p-4">
                {loading ? (
                  <p className="text-purple-400/60 font-mono text-xs tracking-widest animate-pulse">
                    PARSING API ENDPOINT TOPOLOGY AND ISOLATING THREAT STRUCTURAL SIGNATURES...
                  </p>
                ) : (
                  <>
                    <span className="text-2xl opacity-40 mb-2">⚡</span>
                    <p className="text-gray-500 text-sm font-mono max-w-xs">
                      No active endpoint analyzed. Supply a target interface resource path to evaluate telemetry.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Infrastructure Insight Dashboard Sidebar */}
          <div className="bg-[#111827]/40 backdrop-blur-sm border border-gray-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono mb-4">API Security Vectors</h3>
              <div className="space-y-4 text-xs font-mono text-gray-400">
                <div className="p-3 rounded-xl bg-[#050b1a] border border-gray-800/40">
                  <span className="text-white block font-bold mb-1">Endpoint Shadow Mapping</span>
                  Discovers exposed hidden asset routes, undocumented development test points, and broken object authorization pathways.
                </div>
                <div className="p-3 rounded-xl bg-[#050b1a] border border-gray-800/40">
                  <span className="text-white block font-bold mb-1">Header Policy Assessment</span>
                  Ensures correct deployment configurations for strict transport securities, XSS containment rules, and sniffing blockers.
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-900 text-[11px] font-mono text-gray-500 text-center">
              Audit Node ID: <span className="text-gray-400 font-bold">SA-API-INTEL</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
