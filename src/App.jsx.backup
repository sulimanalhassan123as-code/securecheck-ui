import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Code, Network, Terminal, CheckCircle, Activity, Key } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function App() {
  const [user, setUser] = React.useState(null);
  const [emailInput, setEmailInput] = React.useState("");
  const [activeTab, setActiveTab] = useState('network');
  const [targetUrl, setTargetUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [liveLogs, setLiveLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);
  const [findings, setFindings] = useState([]);

  useEffect(() => {
    setLiveLogs(['Initializing secure audit gateway...']);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 bg-[#111827] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-500" />
          <h1 className="text-xl font-bold tracking-wider text-white">SECURECHECK AI</h1>
        </div>
        <div className="flex bg-[#1f2937] p-1 rounded-lg border border-gray-700">
          <button onClick={() => setActiveTab('network')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'network' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            <Network className="w-4 h-4" /> Network Shield
          </button>
          <button onClick={() => setActiveTab('code')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'code' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            <Code className="w-4 h-4" /> AI Code Auditor
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 text-emerald-400">Target Configuration Deck</h2>
          {activeTab === 'network' ? (
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Target Domain URL</label>
              <input type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-gray-200" /></div>
              <button disabled={isScanning} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2"><Activity className="w-4 h-4" /> Initialize Endpoint Scan</button>
            </div>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col">
              <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Target Language</label>
              <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-gray-200">
                <option value="javascript">JavaScript / TypeScript</option>
                <option value="python">Python</option>
              </select></div>
              <div className="flex-1 flex flex-col"><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Raw Source Logic Context</label>
              <textarea value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)} className="w-full flex-1 min-h-[250px] bg-[#0a0f1d] border border-gray-700 rounded-lg p-4 font-mono text-xs text-gray-200 resize-none" /></div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 font-medium text-sm"><Terminal className="w-4 h-4" /> Execute Static Audit</button>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          {currentScore !== null && <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">Score: {currentScore}</div>}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5"><h3 className="text-xs text-gray-400 uppercase mb-3">Infrastructure Live Logging Activity</h3><div className="bg-[#0a0f1d] p-4 rounded-lg font-mono text-xs text-emerald-400 h-40 overflow-y-auto">{liveLogs.map((log, i) => <div key={i}>{log}</div>)}</div></div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex-1">Threat Matrix Results</div>
        </div>
      </main>
    </div>
  );
}
