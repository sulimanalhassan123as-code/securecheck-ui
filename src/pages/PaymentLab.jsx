import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function PaymentLab() {
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const analyzePayment = async () => {
    if (!cardNumber.trim()) {
      alert("Enter card number");
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const res = await fetch(`${API_BASE}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cardNumber
        })
      });

      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      alert("Payment analysis failed");
    }

    setLoading(false);
  };

  const copyReport = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert("Report copied");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white p-6 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Fintech Header Control Banner */}
        <div className="border-b border-gray-800/80 pb-6 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
              💳 Secure Payment Laboratory
            </h1>
            <p className="text-gray-400 mt-2 text-sm max-w-2xl">
              Audit transaction security vector arrays, cross-check merchant gateway integrity parameters, and validate compliance pathways against financial asset processing rules.
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl self-start md:self-center">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">PCI-DSS SECURITY VECTOR ACTIVE</span>
          </div>
        </div>

        {/* Dynamic Entry Console Matrix */}
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Left Column: Input Panel & Interactive Card Mask */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111827]/80 backdrop-blur-md border border-emerald-950/40 rounded-3xl p-6 shadow-xl shadow-black/40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6 font-mono">Sandbox Interrogation Panel</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">Primary Account Number (PAN)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="w-full bg-[#050b1a] border border-gray-800 focus:border-emerald-500/40 rounded-xl px-4 py-3.5 text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all tracking-widest"
                  />
                </div>

                <button
                  onClick={analyzePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl py-4 tracking-wide shadow-lg shadow-emerald-600/10 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="font-mono text-xs uppercase tracking-wider">Intercepting Gateway...</span>
                    </>
                  ) : (
                    <span>Analyze Payment Asset</span>
                  )}
                </button>
              </div>
            </div>

            {/* Micro Informational Compliance Insight */}
            <div className="bg-[#111827]/40 border border-gray-900 rounded-2xl p-5 font-mono text-xs text-gray-500 space-y-2.5">
              <span className="text-gray-400 block font-sans font-bold uppercase tracking-wider">Auditing Telemetry Notes</span>
              <p>This module decrypts bin metrics and parses transaction data fields over sandbox routing channels to detect structural injection attempts or token system breaks.</p>
            </div>
          </div>

          {/* Right Column: Dynamic Matrix Dashboard Output Display */}
          <div className="lg:col-span-3">
            {report ? (
              <div className="bg-[#111827]/90 border border-gray-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6 animate-fadeIn">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
                
                {/* Header Sub-Bar inside results area */}
                <div className="flex justify-between items-center border-b border-gray-800/60 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Compliance Metadata</span>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Interrogation Report Matrix
                    </h2>
                  </div>
                  <button
                    onClick={copyReport}
                    className="bg-[#1e293b] hover:bg-[#2e3d56] text-gray-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-gray-800 tracking-wider transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    📊 COPY DATA ARRAYS
                  </button>
                </div>

                {/* Core Metric Blocks Layout Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="bg-[#161f30]/40 p-3.5 border border-gray-800/60 rounded-xl">
                    <span className="text-gray-500 block mb-1">Environment</span>
                    <span className="text-white font-bold uppercase tracking-wider">{report.environment || "Production/Live"}</span>
                  </div>
                  <div className="bg-[#161f30]/40 p-3.5 border border-gray-800/60 rounded-xl">
                    <span className="text-gray-500 block mb-1">Gateway Route</span>
                    <span className="text-emerald-400 font-bold break-all">{report.gateway || "Stripe Core Node"}</span>
                  </div>
                  <div className="bg-[#161f30]/40 p-3.5 border border-gray-800/60 rounded-xl">
                    <span className="text-gray-500 block mb-1">Asset Brand</span>
                    <span className="text-cyan-400 font-bold tracking-wide">{report.cardType || "Visa International"}</span>
                  </div>
                  <div className="bg-[#161f30]/40 p-3.5 border border-gray-800/60 rounded-xl col-span-2 sm:col-span-2 flex flex-col justify-between">
                    <span className="text-gray-500 block mb-1">Luhn Validation Structure</span>
                    <span className={`font-bold ${report.validation === "Valid" || report.validation === true ? "text-green-400" : "text-amber-400"}`}>
                      {report.validation === "Valid" || report.validation === true ? "✓ Algorithmic Standard Match" : "⚠️ Structural Anomalies Detected"}
                    </span>
                  </div>
                  <div className="bg-[#161f30]/40 p-3.5 border border-gray-800/60 rounded-xl flex flex-col justify-between">
                    <span className="text-gray-500 block mb-1">Risk Assessment Score</span>
                    <span className={`text-base font-bold ${
                      Number(report.riskScore) > 70 ? "text-red-400" : 
                      Number(report.riskScore) > 35 ? "text-yellow-400" : "text-green-400"
                    }`}>
                      🛡️ {report.riskScore || "0"} / 100
                    </span>
                  </div>
                </div>

                {/* Findings Breakdown Module Block Container */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Structural Threat Vectors</span>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {report.findings && report.findings.length > 0 ? (
                      report.findings.map((item, index) => (
                        <div 
                          key={item.title || index}
                          className="bg-[#070c16] border border-gray-800/60 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-emerald-500/20 transition-all font-mono text-xs"
                        >
                          <strong className="text-gray-300 tracking-wide font-sans">{item.title}</strong>
                          <span className="text-gray-400 text-right text-[11px] break-all bg-[#0a0f1d] px-2 py-1 rounded border border-gray-900">{item.value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 font-mono text-xs py-4 text-center">No structural vulnerability threat factors returned by the gateway analyzer loop.</p>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[380px] border border-dashed border-gray-800/80 rounded-3xl flex flex-col items-center justify-center text-center p-6 bg-[#111827]/20">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-emerald-400/60 font-mono text-xs tracking-widest uppercase">
                      Analyzing payment gateway configurations and intercepting token paths...
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="text-3xl opacity-30 mb-3">🛡️</span>
                    <p className="text-gray-500 text-sm font-mono max-w-sm">
                      Laboratory metrics offline. Supply credential sets or test cards inside the control console to initialize security mapping.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
