import { useState, useEffect } from "react";
import PageShell from "../components/PageShell";
import { Gate } from "../utils/gateApi";
import ScoreTimeline from "../components/ScoreTimeline";
import { generatePdfReport } from "../utils/pdfReport";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

const TABS = ["Scan Center", "Payments", "Activity", "Users", "Manage Cards", "Payment Lab", "Scheduled Scans", "Danger Zone"];

export default function AdminOps() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [authing, setAuthing] = useState(false);
  const [tab, setTab] = useState("Payments");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [banBusyEmail, setBanBusyEmail] = useState(null);

  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardForm, setCardForm] = useState({
    name: "", desc: "", icon: "✨", link: "", bg: "#4338ca", accent: "#a5b4fc",
  });
  const [cardSaving, setCardSaving] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardReport, setCardReport] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);

  // ── Scan Center state ──
  const [allScans, setAllScans] = useState([]);
  const [scansLoading, setScansLoading] = useState(false);
  const [scanSearch, setScanSearch] = useState("");
  const [expandedScan, setExpandedScan] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);
  const [waPhoneInput, setWaPhoneInput] = useState({});  // scanId -> phone number
  const [waMessage, setWaMessage] = useState({});  // scanId -> custom message

  // ── Scheduled Scans state ──
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ targetUrl: "", label: "", cadence: "daily" });
  const [scheduleSaving, setScheduleSaving] = useState(false);

  // Load all scans for admin
  const loadAllScans = async () => {
    setScansLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyzer/admin/scans?limit=200${scanSearch ? `&search=${encodeURIComponent(scanSearch)}` : ""}`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "x-admin-key": pass,
        },
      });
      const data = await res.json();
      if (data.success) {
        setAllScans(data.scans);
      }
    } catch (e) {
      console.error("Failed to load scans:", e);
    }
    setScansLoading(false);
  };

  // Load platform stats
  const loadPlatformStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/analyzer/admin/stats`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "x-admin-key": pass,
        },
      });
      const data = await res.json();
      if (data.success) setPlatformStats(data);
    } catch (e) {
      console.error("Failed to load stats:", e);
    }
  };

  // Generate WhatsApp link
  const getWhatsAppLink = (scan) => {
    const phone = waPhoneInput[scan.id] || scan.userPhone || "";
    let msg = waMessage[scan.id] || `Hello ${scan.userName || "there"}, I'm the admin of SecureCheck AI. I noticed your scan of ${scan.targetUrl || "your website"} scored ${scan.securityScore}/100. I'd like to discuss your security findings.`;
    const cleanPhone = phone.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const scoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const sevBadge = (sev) => {
    const colors = { CRITICAL: "bg-red-600", HIGH: "bg-orange-600", MEDIUM: "bg-yellow-600", LOW: "bg-blue-600", INFO: "bg-gray-600" };
    return colors[sev] || "bg-gray-600";
  };

  // New auth: exchange admin key for a short-lived HMAC token
  // Auto-load scan center when authed
  useEffect(() => {
    if (authed && tab === "Scan Center" && allScans.length === 0) {
      loadAllScans();
      loadPlatformStats();
    }
    if (authed && tab === "Scheduled Scans" && schedules.length === 0) {
      loadSchedules();
    }
  }, [authed, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async () => {
    setAuthing(true);
    setAuthError("");
    try {
      const res = await fetch(`${API_BASE}/analyzer/auth/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: pass }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAdminToken(data.token);
        setAuthed(true);
      } else {
        setAuthError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setAuthError("Failed to connect to API");
    }
    setAuthing(false);
  };

  // Helper: use token in Authorization header, fall back to x-admin-key
  const adminHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${adminToken}`,
    "x-admin-key": pass, // fallback
  });

  const loadPayments = async () => {
    setLoading(true);
    const res = await Gate.adminListPayments(pass);
    if (res.error) {
      alert(res.error);
      setAuthed(false);
    } else {
      setPayments(res.payments || []);
    }
    setLoading(false);
  };

  const approve = async (id) => {
    await Gate.adminApprovePayment(pass, id);
    loadPayments();
  };

  const reject = async (id) => {
    await Gate.adminRejectPayment(pass, id);
    loadPayments();
  };

  const clearHistory = async () => {
    if (!confirm("Clear ALL scan history for every user? This can't be undone.")) return;
    setClearing(true);
    try {
      const res = await fetch(`${API_BASE}/analyzer/history`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      const data = await res.json();
      if (data.success) alert(`Cleared ${data.deleted ?? "all"} scans.`);
      else alert(data.error || "Failed to clear history");
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setClearing(false);
  };

  const loadActivity = async () => {
    setActivityLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyzer/activity?limit=100`, {
        headers: adminHeaders(),
      });
      const data = await res.json();
      if (data.success) setActivity(data.activity || []);
      else alert(data.error || "Failed to load activity");
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setActivityLoading(false);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyzer/users`, {
        headers: adminHeaders(),
      });
      const data = await res.json();
      if (data.success) setUsers(data.users || []);
      else alert(data.error || "Failed to load users");
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setUsersLoading(false);
  };

  const banUser = async (email) => {
    const reason = prompt(`Reason for banning ${email}? (visible to you only, optional)`);
    if (reason === null) return;
    setBanBusyEmail(email);
    try {
      const res = await fetch(`${API_BASE}/analyzer/users/ban`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ email, reason }),
      });
      const data = await res.json();
      if (!data.success) alert(data.error || "Failed to ban user");
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setBanBusyEmail(null);
    loadUsers();
  };

  const unbanUser = async (email) => {
    if (!confirm(`Restore scan access for ${email}?`)) return;
    setBanBusyEmail(email);
    try {
      const res = await fetch(`${API_BASE}/analyzer/users/unban`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) alert(data.error || "Failed to unban user");
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setBanBusyEmail(null);
    loadUsers();
  };

  const loadCards = async () => {
    setCardsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cards/admin`, {
        headers: adminHeaders(),
      });
      const data = await res.json();
      if (data.success) setCards(data.cards || []);
      else alert(data.error || "Failed to load cards");
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setCardsLoading(false);
  };

  const addCard = async () => {
    if (!cardForm.name.trim() || !cardForm.link.trim()) {
      return alert("Name and Link are required");
    }
    setCardSaving(true);
    try {
      const res = await fetch(`${API_BASE}/cards`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(cardForm),
      });
      const data = await res.json();
      if (!data.success) alert(data.error || "Failed to add card");
      else setCardForm({ name: "", desc: "", icon: "✨", link: "", bg: "#4338ca", accent: "#a5b4fc" });
    } catch (err) {
      alert("Failed to reach the scan API");
    }
    setCardSaving(false);
    loadCards();
  };

  const toggleCard = async (id, isActive) => {
    await fetch(`${API_BASE}/cards/${id}`, {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ isActive: !isActive }),
    });
    loadCards();
  };

  const deleteCard = async (id, name) => {
    if (!confirm(`Delete the "${name}" card? This can't be undone.`)) return;
    await fetch(`${API_BASE}/cards/${id}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
    loadCards();
  };

  const analyzeCard = async () => {
    if (!cardNumber.trim()) return alert("Enter a card number");
    setCardLoading(true);
    setCardReport(null);
    try {
      const res = await fetch(`${API_BASE}/payment`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ cardNumber }),
      });
      const data = await res.json();
      setCardReport(data);
    } catch (err) {
      alert("Payment analysis failed");
    }
    setCardLoading(false);
  };

  // ── Scheduled Scans CRUD ──
  const loadSchedules = async () => {
    setSchedulesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/scheduler`, { headers: adminHeaders() });
      const data = await res.json();
      if (data.success) setSchedules(data.scheduled);
    } catch (e) { console.error("Failed to load schedules:", e); }
    setSchedulesLoading(false);
  };

  const addSchedule = async () => {
    if (!scheduleForm.targetUrl.trim()) return alert("Target URL is required");
    setScheduleSaving(true);
    try {
      const res = await fetch(`${API_BASE}/scheduler`, {
        method: "POST", headers: adminHeaders(),
        body: JSON.stringify(scheduleForm),
      });
      const data = await res.json();
      if (!data.success) alert(data.error || "Failed to create schedule");
      else setScheduleForm({ targetUrl: "", label: "", cadence: "daily" });
    } catch (e) { alert("Failed to reach the API"); }
    setScheduleSaving(false);
    loadSchedules();
  };

  const toggleSchedule = async (id, isActive) => {
    await fetch(`${API_BASE}/scheduler/${id}`, {
      method: "PATCH", headers: adminHeaders(),
      body: JSON.stringify({ isActive: !isActive }),
    });
    loadSchedules();
  };

  const deleteSchedule = async (id) => {
    if (!confirm("Delete this scheduled scan?")) return;
    await fetch(`${API_BASE}/scheduler/${id}`, {
      method: "DELETE", headers: adminHeaders(),
    });
    loadSchedules();
  };

  if (!authed) {
    return (
      <PageShell title="Admin Ops" icon="🔐">
        <div className="max-w-sm mx-auto mt-10 space-y-3">
          <div className="text-center text-gray-500 text-xs mb-4">
            🔑 Credentials rotated — old keys no longer work.
          </div>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="New admin key"
            className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-white"
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          {authError && <div className="text-red-400 text-sm">{authError}</div>}
          <button
            onClick={login}
            disabled={authing}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium"
          >
            {authing ? "Authenticating..." : "🔐 Authenticate"}
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Admin Ops" icon="🔐">
      <div className="space-y-6">
        {/* Token indicator */}
        <div className="flex items-center justify-between bg-[#0c1428] border border-green-800 rounded-lg px-4 py-2">
          <span className="text-green-400 text-xs font-mono">✅ Session token active (15 min)</span>
          <a href="https://scamwatch-ghana.vercel.app" target="_blank" rel="noopener noreferrer"
            className="text-cyan-400 text-xs hover:underline">
            🛡️ Open ScamWatch Ghana →
          </a>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-purple-600 text-white"
                  : "bg-[#0f172a] text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Scan Center" && (
          <div className="space-y-4">
            {/* Platform Stats */}
            {platformStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Total Scans</div>
                  <div className="text-2xl font-bold text-white mt-1">{platformStats.totalScans}</div>
                </div>
                <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Threats Found</div>
                  <div className="text-2xl font-bold text-red-400 mt-1">{platformStats.totalFindings}</div>
                  <div className="text-[10px] text-red-300">{platformStats.criticalFindings} critical/high</div>
                </div>
                <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Score</div>
                  <div className={`text-2xl font-bold mt-1 ${scoreColor(platformStats.avgScore)}`}>{platformStats.avgScore}/100</div>
                  <div className="text-[10px] text-orange-400">{platformStats.vulnerableCount} vulnerable</div>
                </div>
                <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Unique Users</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">{platformStats.uniqueUsers}</div>
                </div>
              </div>
            )}

            {/* Search + Refresh */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="🔍 Search by URL, email, name..."
                value={scanSearch}
                onChange={(e) => setScanSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadAllScans()}
                className="flex-1 bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm"
              />
              <button
                onClick={() => { loadAllScans(); loadPlatformStats(); }}
                disabled={scansLoading}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg px-5 py-2.5 font-medium text-sm whitespace-nowrap"
              >
                {scansLoading ? "Loading..." : "🔄 Refresh"}
              </button>
            </div>

            {/* Scans List */}
            {allScans.length === 0 && !scansLoading && (
              <div className="text-center py-12 text-gray-500">
                <p>No scans found. Run a scan on the platform to see it here.</p>
              </div>
            )}

            {allScans.map((scan) => (
              <div key={scan.id} className="bg-[#0f172a] border border-gray-800 rounded-xl overflow-hidden">
                {/* Scan Header Row */}
                <div
                  className="p-4 cursor-pointer hover:bg-[#131c2e] transition-colors"
                  onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-lg font-bold ${scoreColor(scan.securityScore)}`}>{scan.securityScore}/100</span>
                        <span className="text-sm text-gray-300 truncate">{scan.targetUrl || "No URL"}</span>
                        <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{scan.scanType}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                        <span>👤 {scan.userName || scan.userEmail || "Anonymous"}</span>
                        {scan.ipAddress && <span>🌐 {scan.ipAddress}</span>}
                        {scan.city && <span>📍 {scan.city}{scan.country ? `, ${scan.country}` : ""}</span>}
                        <span>🕒 {new Date(scan.createdAt).toLocaleString()}</span>
                      </div>
                      {/* Severity badges */}
                      {scan.findingsCount > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {Object.entries(scan.severityCounts).map(([sev, count]) => (
                            <span key={sev} className={`${sevBadge(sev)} text-white text-[10px] px-2 py-0.5 rounded-full font-bold`}>
                              {sev}: {count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm shrink-0">
                      {expandedScan === scan.id ? "▲" : "▼"} {scan.findingsCount} findings
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedScan === scan.id && (
                  <div className="border-t border-gray-800 p-4 space-y-4 bg-[#0a0f1d]">
                    {/* User Contact + WhatsApp */}
                    <div className="bg-[#111827] border border-gray-800 rounded-lg p-3 space-y-2">
                      <div className="text-xs font-bold text-gray-400 uppercase">Contact User</div>
                      <div className="text-sm text-gray-300">
                        Email: {scan.userEmail || "N/A"} | Name: {scan.userName || "N/A"}
                      </div>
                      {/* WhatsApp compose */}
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="WhatsApp number (e.g. 233599931348)"
                          value={waPhoneInput[scan.id] || scan.userPhone || ""}
                          onChange={(e) => setWaPhoneInput({ ...waPhoneInput, [scan.id]: e.target.value })}
                          className="bg-[#0a0f1d] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <textarea
                          placeholder="Message to send..."
                          defaultValue={`Hello ${scan.userName || "there"}, I'm the admin of SecureCheck AI. Your scan of ${scan.targetUrl || "your website"} scored ${scan.securityScore}/100 with ${scan.findingsCount} findings. I'd like to discuss your security.`}
                          onChange={(e) => setWaMessage({ ...waMessage, [scan.id]: e.target.value })}
                          className="bg-[#0a0f1d] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm h-20 resize-none"
                        />
                        <a
                          href={getWhatsAppLink(scan)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-500 text-white rounded-lg py-2.5 px-4 font-medium text-sm text-center flex items-center justify-center gap-2"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Open WhatsApp to Message
                        </a>
                        {!(waPhoneInput[scan.id] || scan.userPhone) && (
                          <p className="text-[11px] text-yellow-500">⚠️ No phone on file — enter the user's WhatsApp number above (with country code, e.g. 233...)</p>
                        )}
                      </div>
                    </div>

                    {/* Findings Detail */}
                    {scan.findings && scan.findings.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-gray-400 uppercase">Security Findings ({scan.findings.length})</div>
                        {scan.findings.map((f) => (
                          <div key={f.id} className="bg-[#111827] border border-gray-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`${sevBadge(f.severity)} text-white text-[10px] px-2 py-0.5 rounded-full font-bold`}>{f.severity}</span>
                              <span className="text-sm font-medium text-gray-200">{f.title}</span>
                              <span className="text-[10px] text-gray-500 ml-auto">{f.affectedComponent}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{f.description}</p>
                            {f.recommendation && (
                              <div className="text-xs text-emerald-400 mt-1">
                                <span className="font-bold">Fix:</span> {f.recommendation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No findings — this scan was clean.</p>
                    )}

                    {/* PDF Report Download + Score Timeline */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`${API_BASE}/analyzer/scan/${scan.id}`, {
                              headers: { Authorization: `Bearer ${adminToken}`, "x-admin-key": pass },
                            });
                            const data = await res.json();
                            if (data.success && data.scan) generatePdfReport(data.scan);
                            else alert("Failed to load full scan data for PDF");
                          } catch (e) { alert("Failed to generate PDF report"); }
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded-lg font-bold"
                      >📄 Download PDF Report</button>
                    </div>

                    <ScoreTimeline
                      targetUrl={scan.targetUrl}
                      adminToken={adminToken}
                      adminKey={pass}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "Payments" && (
          <div className="space-y-4">
            <button
              onClick={loadPayments}
              disabled={loading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg py-3 px-6 font-medium text-sm"
            >
              {loading ? "Loading..." : "🔄 Load Pending Payments"}
            </button>
            <div className="space-y-3">
              {payments.length === 0 && (
                <p className="text-gray-500 text-sm">No pending payments loaded yet.</p>
              )}
              {payments.map((p) => (
                <div key={p.id} className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm">
                    <div className="font-mono text-white">{p.reference} — GHS {p.amount_ghs}</div>
                    <div className="text-gray-500 text-xs">MoMo Tx: {p.momo_transaction_id} · Phone: {p.phone_used || "n/a"}</div>
                    <div className="text-gray-600 text-[11px]">Device: {p.device_id}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approve(p.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg font-bold">✓ Approve</button>
                    <button onClick={() => reject(p.id)} className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-2 rounded-lg font-bold">✕ Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Activity" && (
          <div className="space-y-4">
            <button onClick={loadActivity} disabled={activityLoading}
              className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg py-3 px-6 font-medium text-sm">
              {activityLoading ? "Loading..." : "🔄 Load Activity Log"}
            </button>
            <div className="space-y-2">
              {activity.length === 0 && <p className="text-gray-500 text-sm">No activity loaded yet.</p>}
              {activity.map((a) => (
                <div key={a.id} className="bg-[#0f172a] border border-gray-800 rounded-xl p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white font-mono">{a.targetUrl || "—"}</span>
                    <span className="text-gray-500 text-xs">{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {a.scanType} · Score: {a.securityScore} · {a.userName || a.userEmail || "Anonymous"}
                    {a.country && ` · ${a.city || ""}, ${a.country}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Users" && (
          <div className="space-y-4">
            <button onClick={loadUsers} disabled={usersLoading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg py-3 px-6 font-medium text-sm">
              {usersLoading ? "Loading..." : "🔄 Load Users"}
            </button>
            <div className="space-y-2">
              {users.length === 0 && <p className="text-gray-500 text-sm">No users loaded yet.</p>}
              {users.map((u) => (
                <div key={u.userEmail} className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-white flex items-center gap-2">
                      {u.userName || u.userEmail}
                      {u.isBanned && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">BANNED</span>}
                    </div>
                    <div className="text-gray-500 text-xs">{u.userEmail}</div>
                    <div className="text-gray-600 text-[11px]">{u.scanCount} scan{u.scanCount === 1 ? "" : "s"} · last seen {new Date(u.lastSeen).toLocaleDateString()}</div>
                    {u.isBanned && u.banReason && <div className="text-red-400 text-[11px] mt-1">Reason: {u.banReason}</div>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {u.isBanned ? (
                      <button onClick={() => unbanUser(u.userEmail)} disabled={banBusyEmail === u.userEmail}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs px-3 py-2 rounded-lg font-bold">✓ Unban</button>
                    ) : (
                      <button onClick={() => banUser(u.userEmail)} disabled={banBusyEmail === u.userEmail}
                        className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs px-3 py-2 rounded-lg font-bold">⛔ Ban</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Manage Cards" && (
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 space-y-3 max-w-lg">
              <div className="text-sm font-semibold text-white mb-1">Add a new feature card</div>
              <p className="text-xs text-gray-500 mb-2">Fill this in and it shows up on the homepage instantly.</p>
              <input type="text" placeholder="Name (e.g. Password Vault)" value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
              <input type="text" placeholder="Short description" value={cardForm.desc} onChange={(e) => setCardForm({ ...cardForm, desc: e.target.value })}
                className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
              <input type="text" placeholder="Link — internal path like /vault or full https:// URL" value={cardForm.link} onChange={(e) => setCardForm({ ...cardForm, link: e.target.value })}
                className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" />
              <div className="flex gap-3">
                <input type="text" placeholder="Icon (emoji)" value={cardForm.icon} onChange={(e) => setCardForm({ ...cardForm, icon: e.target.value })}
                  className="w-20 bg-[#0a0f1d] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm text-center" />
                <input type="color" value={cardForm.bg} onChange={(e) => setCardForm({ ...cardForm, bg: e.target.value })}
                  className="w-14 h-10 bg-[#0a0f1d] border border-gray-700 rounded-lg" title="Card background color" />
                <input type="color" value={cardForm.accent} onChange={(e) => setCardForm({ ...cardForm, accent: e.target.value })}
                  className="w-14 h-10 bg-[#0a0f1d] border border-gray-700 rounded-lg" title="Accent color" />
              </div>
              <button onClick={addCard} disabled={cardSaving}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm">
                {cardSaving ? "Adding..." : "➕ Add Card to Homepage"}
              </button>
            </div>
            <div>
              <button onClick={loadCards} disabled={cardsLoading}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg py-3 px-6 font-medium text-sm mb-4">
                {cardsLoading ? "Loading..." : "🔄 Load Existing Cards"}
              </button>
              <div className="space-y-3">
                {cards.length === 0 && <p className="text-gray-500 text-sm">No cards loaded yet.</p>}
                {cards.map((c) => (
                  <div key={c.id} className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-3" style={{ borderLeft: `4px solid ${c.bg}` }}>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-2xl">{c.icon}</span>
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          {c.name}
                          {!c.isActive && <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full font-bold">HIDDEN</span>}
                        </div>
                        <div className="text-gray-500 text-xs">{c.desc}</div>
                        <div className="text-gray-600 text-[11px] font-mono">{c.link}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => toggleCard(c.id, c.isActive)} className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg font-bold">{c.isActive ? "Hide" : "Show"}</button>
                      <button onClick={() => deleteCard(c.id, c.name)} className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-2 rounded-lg font-bold">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Payment Lab" && (
          <div className="space-y-4 max-w-lg">
            <p className="text-xs text-gray-500">Admin-only card format / Luhn sandbox checker. Not exposed publicly.</p>
            <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4111 2222 3333 4444" maxLength={19}
              className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
            <button onClick={analyzeCard} disabled={cardLoading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium">
              {cardLoading ? "Analyzing..." : "Analyze Card"}
            </button>
            {cardReport && (
              <pre className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 text-xs text-gray-300 overflow-x-auto">{JSON.stringify(cardReport, null, 2)}</pre>
            )}
          </div>
        )}

        {tab === "Scheduled Scans" && (
          <div className="max-w-2xl space-y-4">
            <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">Create Scheduled Scan</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={scheduleForm.targetUrl}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, targetUrl: e.target.value })}
                  className="w-full bg-[#1e293b] text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-cyan-500 outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Label (optional)"
                    value={scheduleForm.label}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, label: e.target.value })}
                    className="flex-1 bg-[#1e293b] text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-cyan-500 outline-none"
                  />
                  <select
                    value={scheduleForm.cadence}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, cadence: e.target.value })}
                    className="bg-[#1e293b] text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-cyan-500 outline-none"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <button
                    onClick={addSchedule}
                    disabled={scheduleSaving}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg font-bold whitespace-nowrap"
                  >
                    {scheduleSaving ? "Adding..." : "+ Add"}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={loadSchedules}
              disabled={schedulesLoading}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs px-3 py-2 rounded-lg font-medium"
            >
              {schedulesLoading ? "Loading..." : "Refresh Schedules"}
            </button>

            {schedules.length === 0 && !schedulesLoading ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No scheduled scans yet. Create one above to auto-scan your sites.
              </p>
            ) : (
              <div className="space-y-2">
                {schedules.map((s) => (
                  <div key={s.id} className="bg-[#0f172a] border border-gray-800 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{s.targetUrl}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {s.label && <span className="text-xs text-gray-400">{s.label}</span>}
                        <span className="text-xs text-cyan-400 uppercase">{s.cadence}</span>
                        {s.lastRunAt && (
                          <span className="text-xs text-gray-500">
                            Last: {new Date(s.lastRunAt).toLocaleDateString()}
                          </span>
                        )}
                        {s.lastScore != null && (
                          <span className={s.lastScore >= 80 ? "text-xs text-emerald-400" : "text-xs text-red-400"}>
                            Score: {s.lastScore}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive ? "bg-emerald-900 text-emerald-400" : "bg-gray-800 text-gray-500"}`}>
                          {s.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                      {s.nextRunAt && (
                        <p className="text-xs text-gray-600 mt-1">
                          Next: {new Date(s.nextRunAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => toggleSchedule(s.id, s.isActive)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white"
                      >
                        {s.isActive ? "Pause" : "Resume"}
                      </button>
                      <button
                        onClick={() => deleteSchedule(s.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-900 hover:bg-red-800 text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "Danger Zone" && (
          <div className="max-w-md">
            <button onClick={clearHistory} disabled={clearing}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm">
              {clearing ? "Clearing..." : "🗑 Clear All Scan History"}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
