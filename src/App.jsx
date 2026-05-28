import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Shield, ShieldAlert, Code, Network, Terminal, CheckCircle, Activity, Key } from 'lucide-react';

const API_BASE = 'https://securecheck-api.onrender.com/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('network');
  const [targetUrl, setTargetUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [liveLogs, setLiveLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);
  const [findings, setFindings] = useState([]);

  useEffect(() => {
    const socket = io('https://securecheck-api.onrender.com');
    return () => { socket.disconnect(); };
  }, []);

  const runNetworkScan = async (e) => {
    e.preventDefault();
    if (!targetUrl) return;
    setIsScanning(true);
    setLiveLogs([]);
    setFindings([]);
    setCurrentScore(null);

    try {
      const res = await fetch(`${API_BASE}/scans/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'default-project', targetUrl })
      });
      const data = await res.json();
      
      const socket = io('https://securecheck-api.onrender.com');
      socket.on(`scan-logs:${data.scanId}`, (log) => {
        if (log.isFinished) {
          fetchScanResults(data.scanId);
          setIsScanning(false);
        } else {
          setLiveLogs((prev) => [...prev, log.message]);
        }
      });
    } catch (err) {
      setLiveLogs((prev) => [...prev, '❌ Failed connecting to auditing core daemon router.']);
      setIsScanning(false);
    }
  };

  const runCodeAnalysis = async (e) => {
    e.preventDefault();
    if (!codeSnippet) return;
    setIsScanning(true);
    setFindings([]);
    setCurrentScore(null);

    try {
      const res = await fetch(`${API_BASE}/analyzer/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'default-project', codeSnippet, language: selectedLanguage })
      });
      const data = await res.json();
      await fetchScanResults(data.scanId);
    } catch (err) {
      alert('Error connecting to the AI analyzer matrix.');
    } finally {
      setIsScanning(false);
    }
  };

  const fetchScanResults = async (scanId) => {
    try {
      const res = await fetch(`${API_BASE}/scans/${scanId}`);
      const data = await res.json();
      setCurrentScore(data.securityScore);
      setFindings(data.findings || []);
    } catch (err) {
      console.error('Failed retrieving compiled safety reports.', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-gray-100 flex flex-col">
      {/* Top Banner Navigation bar */}
      <header className="border-b border-gray-800 bg-[#111827] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-500" />
          <h1 className="text-xl font-bold tracking-wider text-white">SECURECHECK AI</h1>
        </div>
        <div className="flex bg-[#1f2937] p-1 rounded-lg border border-gray-700">
          <button 
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'network' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            <Network className="w-4 h-4" /> Network Shield
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'code' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            <Code className="w-4 h-4" /> AI Code Auditor
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Input Control Deck Panels */}
        <div className="lg:col-span-1 bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 text-emerald-400">Target Configuration Deck</h2>
          
          {activeTab === 'network' ? (
            <form onSubmit={runNetworkScan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Target Domain URL</label>
                <input 
                  type="url" 
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-gray-200"
                />
              </div>
              <button 
                type="submit" 
                disabled={isScanning}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Activity className="w-4 h-4" /> {isScanning ? 'Auditing Target...' : 'Initialize Endpoint Scan'}
              </button>
            </form>
          ) : (
            <form onSubmit={runCodeAnalysis} className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Target Language</label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-gray-200"
                >
                  <option value="javascript">JavaScript / TypeScript</option>
                  <option value="python">Python</option>
                  <option value="php">PHP</option>
                  <option value="go">Go Lang</option>
                </select>
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Raw Source Logic Context</label>
                <textarea 
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="// Paste sensitive code logic vectors here for static evaluation..."
                  className="w-full flex-1 min-h-[250px] bg-[#0a0f1d] border border-gray-700 rounded-lg p-4 font-mono text-xs focus:outline-none focus:border-emerald-500 text-gray-200 resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={isScanning}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Terminal className="w-4 h-4" /> {isScanning ? 'Analyzing Matrix...' : 'Execute Static Audit'}
              </button>
            </form>
          )}
        </div>

        {/* Diagnostic Outputs Matrix Screen View */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Real-time score readout header module */}
          {currentScore !== null && (
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Security Matrix Health Score</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{currentScore} <span className="text-xs text-gray-500">/ 100</span></h3>
              </div>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 ${currentScore >= 80 ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30' : currentScore >= 50 ? 'border-amber-500 text-amber-400 bg-amber-950/30' : 'border-rose-500 text-rose-400 bg-rose-950/30'}`}>
                {currentScore}%
              </div>
            </div>
          )}

          {/* Active Terminal Stream Outputs console log panel */}
          {activeTab === 'network' && liveLogs.length > 0 && (
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" /> Infrastructure Live Logging Activity
              </h3>
              <div className="bg-[#0a0f1d] p-4 rounded-lg font-mono text-xs text-emerald-400 h-40 overflow-y-auto space-y-2 border border-gray-800">
                {liveLogs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* Core Vulnerability Findings Assessment Log List */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex-1 flex flex-col gap-4">
            <h3 className="text-sm font-semibold border-b border-gray-800 pb-2 text-gray-200">Threat Matrix Diagnostic Findings ({findings.length})</h3>
            
            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-4 pr-1">
              {findings.length === 0 && !isScanning && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12 gap-3">
                  <CheckCircle className="w-12 h-12 text-gray-700" />
                  <p className="text-sm">No vulnerability matrices detected. Target pipeline reports clean.</p>
                </div>
              )}

              {isScanning && (
                <div className="h-full flex flex-col items-center justify-center text-emerald-500 py-12 gap-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-mono text-gray-400">Processing live diagnostics engine...</p>
                </div>
              )}

              {findings.map((finding, idx) => (
                <div key={idx} className="bg-[#0a0f1d] border border-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                      <h4>{finding.title}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${finding.severity === 'CRITICAL' || finding.severity === 'HIGH' ? 'bg-rose-950/50 text-rose-400 border border-rose-800' : 'bg-amber-950/50 text-amber-400 border border-amber-800'}`}>
                      {finding.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{finding.description}</p>
                  
                  {finding.riskExplanation && (
                    <div className="text-[11px] bg-slate-950/40 p-2.5 rounded border border-gray-900">
                      <span className="text-amber-400 font-medium block mb-0.5">Impact Vector:</span>
                      <span className="text-gray-300">{finding.riskExplanation}</span>
                    </div>
                  )}

                  {finding.recommendation && (
                    <div className="text-[11px] bg-emerald-950/10 p-2.5 rounded border border-emerald-950/40">
                      <span className="text-emerald-400 font-medium block mb-0.5">Remediation Step:</span>
                      <span className="text-gray-300">{finding.recommendation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
