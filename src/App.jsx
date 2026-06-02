import React, { useState, useEffect } from 'react';
import { Shield, Code, Network, Terminal, Activity } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function App() {
  const [activeTab, setActiveTab] = useState('network');
  const [targetUrl, setTargetUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [liveLogs, setLiveLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);
  const [findings, setFindings] = useState([]);
const [technologies, setTechnologies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("securecheck_login") === "true");

  useEffect(() => {
    setLiveLogs(['⚡ Initializing secure audit gateway...']);
  }, []);

  const fetchScanResults = async (scanId) => {
    try {
      const res = await fetch(`${API_BASE}/scans/${scanId}`);
      const data = await res.json();

      setCurrentScore(data.securityScore || 0);
      setFindings(data.findings || []);

      setLiveLogs(prev => [
        ...prev,
        '✅ Threat analysis completed successfully.'
      ]);
    } catch (err) {
      console.error(err);

      setLiveLogs(prev => [
        ...prev,
        '❌ Failed to retrieve scan results.'
      ]);
    }
  };

  const runNetworkScan = async () => {
    if (!targetUrl) return;

    setIsScanning(true);

    setLiveLogs([
      '⚡ Initializing secure audit gateway...',
      '🌐 Connecting to remote endpoint...'
    ]);

    setCurrentScore(null);
    setFindings([]);

    try {
      const res = await fetch(`${API_BASE}/scans/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetUrl
        })
      });

      const data = await res.json();

      setLiveLogs(prev => [
        ...prev,
        '📡 Queue accepted. Monitoring scan lifecycle...'
      ]);

      const pollInterval = setInterval(async () => {
        try {
          const checkRes = await fetch(`${API_BASE}/scans/${data.scanId}`);
          const checkData = await checkRes.json();

          if (checkData.status === 'COMPLETED') {
            clearInterval(pollInterval);

            setLiveLogs(prev => [
              ...prev,
              '🏁 Scan completed.'
            ]);

            await fetchScanResults(data.scanId);
            setIsScanning(false);

          } else if (checkData.status === 'FAILED') {
            clearInterval(pollInterval);

            setLiveLogs(prev => [
              ...prev,
              '❌ Scan execution failed.'
            ]);

            setIsScanning(false);

          } else {
            setLiveLogs(prev => [
              ...prev,
              '⏳ Processing security diagnostics...'
            ]);
          }

        } catch (err) {
          console.error(err);

          clearInterval(pollInterval);

          setLiveLogs(prev => [
            ...prev,
            '❌ Polling connection failed.'
          ]);

          setIsScanning(false);
        }
      }, 3000);

    } catch (err) {
      console.error(err);

      setLiveLogs(prev => [
        ...prev,
        '❌ API connection failed.'
      ]);

      setIsScanning(false);
    }
  };

  const runCodeAnalysis = async () => {
    if (!codeSnippet) return;

    setIsScanning(true);

    try {
      const res = await fetch(`${API_BASE}/analyzer/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: 'default-project',
          codeSnippet,
          language: selectedLanguage
        })
      });

      const data = await res.json();

      await fetchScanResults(data.scanId);

    } catch (err) {
      console.error(err);

      setLiveLogs(prev => [
        ...prev,
        '❌ Static analysis failed.'
      ]);
    }

    setIsScanning(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-white flex items-center justify-center">
        <div className="bg-[#111827] p-8 rounded-xl border border-gray-700 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to SecureCheck AI</h1>
          <p className="text-gray-400 mb-6">Cyber-Zero Intelligence Platform</p>
          <button
            onClick={() => { localStorage.setItem("securecheck_login","true"); setIsLoggedIn(true); }}
            className="bg-emerald-600 px-6 py-3 rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 bg-[#111827] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-500" />
          <h1 className="text-xl font-bold tracking-wider text-white">
            SECURECHECK AI
          </h1>
        </div>

        <div className="flex bg-[#1f2937] p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'network'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            Network Shield
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            AI Code Auditor
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 text-emerald-400">
            Target Configuration Deck
          </h2>

          {activeTab === 'network' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Target Domain URL
                </label>

                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-gray-200"
                />
              </div>

              <button
                onClick={runNetworkScan}
                disabled={isScanning}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Initialize Endpoint Scan
              </button>
            </div>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Target Language
                </label>

                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-gray-200"
                >
                  <option value="javascript">
                    JavaScript / TypeScript
                  </option>

                  <option value="python">
                    Python
                  </option>
                </select>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Raw Source Logic Context
                </label>

                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full flex-1 min-h-[250px] bg-[#0a0f1d] border border-gray-700 rounded-lg p-4 font-mono text-xs text-gray-200 resize-none"
                />
              </div>

              <button
                onClick={runCodeAnalysis}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 font-medium text-sm flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                Execute Static Audit
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {currentScore !== null && (
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                Security Score
              </h3>

              <div className="text-4xl font-bold text-white">
                {currentScore}/100
              </div>
            </div>
          )}

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h3 className="text-xs text-gray-400 uppercase mb-3">
              Infrastructure Live Logging Activity
            </h3>

            <div className="bg-[#0a0f1d] p-4 rounded-lg font-mono text-xs text-emerald-400 h-40 overflow-y-auto">
              {liveLogs.map((log, i) => (
                <div key={i}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex-1">
            <h3 className="text-lg font-semibold mb-4 text-red-400">
              Threat Matrix Results
            </h3>

            {findings.length === 0 ? (
              <div className="text-gray-400 text-sm">
                No findings yet.
              </div>
            ) : (
              <div className="space-y-4">
                {findings.map((finding, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-lg p-4 bg-[#0a0f1d]"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-white">
                        {finding.title}
                      </h4>

                      <span className="text-xs px-2 py-1 rounded bg-red-600 text-white">
                        {finding.severity}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300">
                      {finding.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
<TechnologyStackCard technologies={technologies} />
      </main>
    </div>
  );
}

function TechnologyStackCard({ technologies = [] }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 mt-6">
      <h3 className="text-xs text-cyan-400 uppercase mb-4 tracking-wider">
        Cyber-Zero Technology Intelligence
      </h3>

      {technologies.length === 0 ? (
        <div className="text-gray-400 text-sm">
          No technologies detected yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500 text-cyan-300 text-sm font-medium"
            >
              {tech}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


