import React, { useState, useEffect } from 'react';

function App() {
  const [targetUrl, setTargetUrl] = useState('https://Justbuydata.com');
  const [isLoading, setIsLoading] = useState(false);
  const [debugStatus, setDebugStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleStartAnalysis = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setDebugStatus("📡 Step 1: Packaging configuration payload and reaching out to server...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const API_BASE = "https://securecheck-api.onrender.com/api";
      setDebugStatus("⏳ Step 2: Request sent. Waiting for Render backend to process database connection...");

      const response = await fetch(`${API_BASE}/scans/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status code ${response.status}`);
      }

      await response.json();
      setDebugStatus("✅ Success: Server data processed and loaded successfully!");
      setIsLoading(false);

    } catch (err) {
      clearTimeout(timeoutId);
      setIsLoading(false);
      setDebugStatus("");
      
      if (err.name === 'AbortError') {
        setErrorMessage("🛑 Connection Timeout: The backend server took longer than 15 seconds to answer. The database connection is likely frozen or overloaded.");
      } else {
        setErrorMessage(`❌ Connection Failed: ${err.message}. Please check if the backend is awake.`);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', color: '#fff', backgroundColor: '#1a1f2c', fontFamily: 'sans-serif', borderRadius: '8px', marginTop: '40px' }}>
      <h2 style={{ borderColor: '#30363d', borderBottom: '1px solid', paddingBottom: '10px' }}>Target Configuration Deck</h2>
      
      <div style={{ marginTop: '15px' }}>
        <label style={{ fontSize: '12px', color: '#8b949e' }}>TARGET DOMAIN URL</label>
        <input 
          type="text" 
          value={targetUrl} 
          onChange={(e) => setTargetUrl(e.target.value)} 
          disabled={isLoading}
          style={{ width: '100%', padding: '12px', marginTop: '5px', marginBottom: '15px', background: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '6px', boxSizing: 'border-box' }}
        />
      </div>

      <button 
        onClick={handleStartAnalysis} 
        disabled={isLoading}
        style={{ width: '100%', padding: '14px', background: isLoading ? '#1f6feb' : '#238636', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
      >
        {isLoading ? `⏳ Processing (${timer}s)...` : '🚀 Start Analysis'}
      </button>

      <div style={{ marginTop: '20px', padding: '15px', borderRadius: '6px', background: '#21262d', border: '1px solid #30363d' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#c9d1d9' }}>Live Status Feed</h4>
        
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ color: '#58a6ff', margin: 0, fontSize: '13px', lineHeight: '1.4' }}>{debugStatus}</p>
          </div>
        )}

        {errorMessage && (
          <div style={{ border: '1px solid #f85149', background: 'rgba(248, 81, 73, 0.1)', padding: '12px', borderRadius: '6px', color: '#f85149', fontSize: '13px', lineHeight: '1.4' }}>
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <p style={{ color: '#8b949e', margin: 0, fontSize: '13px' }}>System idle. Ready to track pipeline operations.</p>
        )}
      </div>
    </div>
  );
}

export default App;
