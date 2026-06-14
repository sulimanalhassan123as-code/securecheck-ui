import { useState, useEffect } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function SystemManagement() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const loadSystemStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/system`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load system status");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const copyReport = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert("Report copied");
  };

  return (
    <div className="min-h-screen bg-[#060b16] text-white p-6 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Elite 3D-Layered Welcome Menu Panel */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#111827] to-[#0f172a] p-6 sm:p-8 border border-indigo-950/80 shadow-2xl shadow-black/80 ring-1 ring-indigo-500/10">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full w-fit mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-[10px] font-mono font-bold text-indigo-300 tracking-widest uppercase">Kernel Node Connected</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Welcome Back, Operator
              </h1>
              <p className="text-gray-400 text-sm mt-1 max-w-xl font-medium">
                Cyber-Zero core environment initialized. Running diagnostics assessment, cluster monitoring routines, and subsystem resource tracking.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={loadSystemStatus}
                disabled={loading}
                className="flex-1 md:flex-initial bg-[#111827]/90 hover:bg-[#1f2937] text-gray-200 border border-gray-800 font-mono text-xs px-4 py-3 rounded-xl tracking-wider shadow-md hover:border-gray-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                🔄 {loading ? "REFRESHING..." : "FORCE REFRESH"}
              </button>
              
              {report && (
                <button
                  onClick={copyReport}
                  className="flex-1 md:flex-initial bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-xs px-4 py-3 rounded-xl tracking-wider font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  📋 COPY SYSTEM JSON
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Layout Frame */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Inspection Terminal Status Frame */}
          <div className="lg:col-span-2 space-y-6">
            {report ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* 3D Dimensional Hardware Parameters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Status Indicator Block */}
                  <div className="bg-gradient-to-b from-[#111827] to-[#0c1220] border border-slate-800/80 border-t-2 border-t-emerald-500/50 rounded-2xl p-5 shadow-xl shadow-black/40 hover:scale-[1.01] transition-all">
                    <span className="text-gray-500 text-[10px] font-mono block mb-1 uppercase tracking-wider">System State</span>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400 animate-pulse" />
                      <span className="text-xl font-extrabold text-white tracking-tight break-all uppercase">{report.status || "Operational"}</span>
                    </div>
                  </div>

                  {/* Uptime Indicator Block */}
                  <div className="bg-gradient-to-b from-[#111827] to-[#0c1220] border border-slate-800/80 border-t-2 border-t-indigo-500/50 rounded-2xl p-5 shadow-xl shadow-black/40 hover:scale-[1.01] transition-all">
                    <span className="text-gray-500 text-[10px] font-mono block mb-1 uppercase tracking-wider">Active Run Duration</span>
                    <span className="text-xl font-extrabold text-indigo-400 font-mono break-all">{report.uptime || "0s"}</span>
                  </div>

                  {/* Memory Consumption Indicator Block */}
                  <div className="bg-gradient-to-b from-[#111827] to-[#0c1220] border border-slate-800/80 border-t-2 border-t-purple-500/50 rounded-2xl p-5 shadow-xl shadow-black/40 hover:scale-[1.01] transition-all">
                    <span className="text-gray-500 text-[10px] font-mono block mb-1 uppercase tracking-wider">Memory Allocation</span>
                    <span className="text-xl font-extrabold text-purple-400 font-mono break-all">{report.memoryUsage || "0 MB"}</span>
                  </div>

                  {/* Core Platform Specification Block */}
                  <div className="bg-gradient-to-b from-[#111827] to-[#0c1220] border border-slate-800/80 border-t-2 border-t-pink-500/50 rounded-2xl p-5 shadow-xl shadow-black/40 hover:scale-[1.01] transition-all">
                    <span className="text-gray-500 text-[10px] font-mono block mb-1 uppercase tracking-wider">Host Platform</span>
                    <span className="text-xl font-extrabold text-pink-400 font-mono break-all">{report.platform || "Linux Cluster"}</span>
                  </div>

                </div>

                {/* Extended Environment Attributes */}
                <div className="bg-[#111827]/90 border border-gray-900 rounded-2xl p-5 flex justify-between items-center font-mono text-xs">
                  <span className="text-gray-500 uppercase tracking-wider">Node Runtime Environment Engine</span>
                  <span className="text-white bg-[#060b16] border border-gray-800 px-3 py-1.5 rounded-lg font-bold">
                    {report.nodeVersion || "v20.x"}
                  </span>
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[300px] border border-dashed border-gray-800/80 rounded-3xl flex flex-col items-center justify-center text-center p-6 bg-[#111827]/20">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-indigo-400/70 font-mono text-xs tracking-widest uppercase">
                      Querying kernel system telemetry nodes...
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm font-mono max-w-xs">
                    No diagnostics data stream mounted. Trigger refresh panel above.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sub-Services Status Track Panel */}
          <div className="bg-[#111827]/60 backdrop-blur-md border border-gray-900 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono mb-0.5">Subsystem Matrix</span>
                <h3 className="text-base font-bold text-white tracking-tight">Active Core Service Nodes</h3>
              </div>

              {/* Looping Services Output List Layout */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {report?.services && report.services.length > 0 ? (
                  report.services.map((service, index) => (
                    <div
                      key={service.name || index}
                      className="bg-[#060b16]/90 border border-gray-800/60 p-4 rounded-xl flex items-center justify-between gap-4 font-mono text-xs hover:border-indigo-500/20 transition-all shadow-md"
                    >
                      <div>
                        <strong className="text-gray-200 block font-sans text-sm tracking-wide mb-0.5">{service.name}</strong>
                        <span className="text-gray-500 text-[11px]">System Process Checked</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wider uppercase ${
                        service.status === "active" || service.status === "online" || service.status === "Operational"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {service.status || "Unknown"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 font-mono text-xs py-4 text-center">
                    {loading ? "Awaiting service state streams..." : "No background micro-services tracking records available."}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-900 text-[11px] font-mono text-gray-500 text-center">
              Infrastructure Platform Completion Core
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
