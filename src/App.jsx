import React, { useState, useEffect } from 'react';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [url, setUrl] = useState('https://www.ourdatagh.com');

  const addLog = (msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    addLog("✅ Diagnostic UI Loaded. Ready to test.");
  }, []);

  const testConnection = async () => {
    addLog("------------------------------------");
    addLog("🚀 TEST STARTED");
    addLog(`🎯 Target URL: ${url}`);
    
    try {
      const endpoint = 'https://securecheck-api.onrender.com/api/scans/start';
      addLog(`📡 Sending POST request to: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: url })
      });

      addLog(`📥 Response Status Code: ${response.status} (${response.statusText})`);
      
      const text = await response.text();
      addLog(`📄 Response Data: ${text.substring(0, 150)}...`);
      
    } catch (err) {
      addLog(`❌ CRITICAL NETWORK ERROR: ${err.message}`);
      addLog("💡 HINT: If this says 'Failed to fetch', it is usually a CORS error or the server is completely unreachable.");
    }
    addLog("🏁 TEST FINISHED");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', background: '#121212', color: '#00ff00', minHeight: '100vh' }}>
      <h2 style={{ color: '#fff' }}>SecureCheck Diagnostic Mode</h2>
      <p style={{ color: '#aaa' }}>This page will print exact network steps to find where it gets stuck.</p>
      
      <input 
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#222', color: '#fff', border: '1px solid #444' }}
      />
      <br/>
      <button 
        onClick={testConnection} 
        style={{ padding: '15px 20px', background: '#007bff', color: 'white', border: 'none', width: '100%', fontSize: '16px', fontWeight: 'bold' }}>
        RUN DIAGNOSTIC CHECK
      </button>
      
      <div style={{ marginTop: '30px', borderTop: '2px solid #333', paddingTop: '20px' }}>
        <h3 style={{ color: '#fff', marginTop: 0 }}>Live Logs:</h3>
        {logs.map((l, i) => (
          <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #222', paddingBottom: '4px' }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
