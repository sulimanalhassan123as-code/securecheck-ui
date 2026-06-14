import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function TechnologyIntelligence() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [technologies, setTechnologies] = useState([]);

  const analyzeSite = async () => {
    if (!url.trim()) {
      alert("Enter a website URL");
      return;
    }
    
    setLoading(true);
    setReport(null);
    
    try {
      const res = await fetch(`${API_BASE}/technology`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setTechnologies(data.technologies || []);
        setReport(data);
      } else {
        alert("Technology analysis returned unsuccessful execution parameters.");
      }
    } catch (err) {
      console.error(err);
      alert("Technology analysis failed");
    }
    
    setLoading(false);
  };

  const copyReport = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert("Report copied");
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-6 font-sans selection:bg-cyan-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Console Section */}
        <div className="border-b border-gray-800/80 pb-6 mt-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
            ⚙️ Technology Intelligence Console
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-2xl">
            Audit deep stack footprints, software layers, content delivery systems, and architecture frameworks mapped onto external target environments.
          </p>
        </div>

        {/* Tactical Search Entry Control */}
        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-cyan-950/60 rounded-2xl p-6 shadow-xl shadow-black/30 hover:border-cyan-900/60 transition-all duration-300">
          <label className="block text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3 font-mono">Target Environment URL</label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 bg-[#050b1a] border border-gray-800 focus:border-cyan-500/40 rounded-xl px-4 py-3.5 text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/10 transition-all"
            />
            <button
              onClick={analyzeSite}
              disabled={loading}
              className="md:w-64 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl px-6 py-3.5 tracking-wide shadow-lg shadow-cyan-600/10 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-mono text-xs uppercase tracking-wider">Compiling Stack...</span>
                </>
              ) : (
                <span>Analyze System Layer</span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Display Grid Matrix */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Main Inspection Display: Badges Frame */}
          <div className="bg-[#0f172a]/90 border border-gray-900 rounded-3xl p-6 md:col-span-2 shadow-2xl relative overflow-hidden group min-h-[280px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-gray-800/60 pb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono mb-0.5">Manifest Manifested</span>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Detected Core Infrastructure Stack
                </h2>
              </div>
              
              {report && (
                <button
                  onClick={copyReport}
                  className="bg-[#1e293b] hover:bg-[#2e3d56] text-gray-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-gray-800 tracking-wider transition-all active:scale-95 flex items-center gap-1.5"
                >
                  📄 COPY RAW CONFIG
                </button>
              )}
            </div>

            {/* Render Output Items */}
            {technologies.length > 0 ? (
              <div className="flex flex-wrap gap-3.5 pt-2 animate-fadeIn">
                {technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#1e293b]/50 to-[#0f172a]/80 border border-cyan-500/20 text-cyan-300 font-mono font-bold text-sm shadow-md shadow-black/10 flex items-center gap-2 hover:border-cyan-400/50 hover:text-white hover:scale-[1.03] transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                    {tech}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 border border-dashed border-gray-800/80 rounded-2xl text-center p-4">
                {loading ? (
                  <p className="text-cyan-400/60 font-mono text-xs tracking-widest animate-pulse">
                    EXECUTING DISCOVERY ENGINES ON EXTERNAL CORE INFRASTRUCTURE...
                  </p>
                ) : (
                  <>
                    <span className="text-2xl opacity-40 mb-2">🔍</span>
                    <p className="text-gray-500 text-sm font-mono max-w-xs">
                      No tech-stack mapping data initialized. Provide target parameters to deploy analysis.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Lateral Diagnostics Insight Pane */}
          <div className="bg-[#0f172a]/50 backdrop-blur-sm border border-gray-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 font-mono mb-4">Inspection Insights</h3>
              <div className="space-y-4 text-xs font-mono text-gray-400">
                <div className="p-3 rounded-xl bg-[#050b1a] border border-gray-800/40">
                  <span className="text-white block font-bold mb-1">State Synchronicity</span>
                  Maintains full matching parameters across downstream configurations.
                </div>
                <div className="p-3 rounded-xl bg-[#050b1a] border border-gray-800/40">
                  <span className="text-white block font-bold mb-1">Layer Vectoring</span>
                  Scans DOM elements, header patterns, global script allocations, and meta parameters.
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-900 text-[11px] font-mono text-gray-500 text-center">
              System Operator ID: <span className="text-gray-400 font-bold">SA-SEC-01</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
