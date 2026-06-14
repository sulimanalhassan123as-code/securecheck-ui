import PageShell from "../components/PageShell";

const WA_NUMBERS = [
  { num: "233599931348", label: "WhatsApp Support Line 1", display: "+233 599 931 348" },
  { num: "233248503631", label: "WhatsApp Support Line 2", display: "+233 248 503 631" },
];

const INSTALL_STEPS = [
  { device: "Android Chrome", steps: 'Tap the 3-dot menu (⋮) at top right → tap "Add to Home screen" → confirm.' },
  { device: "iPhone Safari", steps: 'Tap the Share icon (□↑) → scroll down → tap "Add to Home Screen".' },
  { device: "Desktop Chrome", steps: 'Click the install icon (⊕) in the browser address bar → click Install.' },
];

export default function HelpContact() {
  return (
    <PageShell title="Help & Contact" icon="📞">
      {/* WhatsApp */}
      <div className="rounded-2xl p-4 mb-4 border border-green-400/15 bg-green-400/4">
        <div className="text-[13px] font-bold text-green-400 mb-3">📱 WhatsApp Support</div>
        {WA_NUMBERS.map(w => (
          <a key={w.num} href={`https://wa.me/${w.num}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 rounded-xl p-3.5 mb-2 no-underline transition-all hover:bg-green-400/10 border border-green-400/10"
            style={{ background: "rgba(37,211,102,0.06)" }}>
            <span className="text-2xl">💬</span>
            <div>
              <div className="font-bold text-[14px] text-white">{w.display}</div>
              <div className="text-[11px] text-white/40">{w.label}</div>
            </div>
            <span className="ml-auto text-white/30">→</span>
          </a>
        ))}
      </div>

      {/* Install guide */}
      <div className="rounded-2xl p-4 border border-[rgba(8,145,178,0.12)] bg-white/3">
        <div className="text-[13px] font-bold text-[#22d3ee] mb-3">📲 Install Cyber-Zero App</div>
        <p className="text-[12px] text-white/40 mb-4 leading-relaxed">Install this platform as an app on your device for instant access — works without opening a browser.</p>
        {INSTALL_STEPS.map((s, i) => (
          <div key={i} className="flex gap-3 pb-3 mb-3 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black text-[#22d3ee] mt-0.5"
              style={{ background: "rgba(8,145,178,0.15)", border: "1px solid rgba(8,145,178,0.25)" }}>{i + 1}</div>
            <div>
              <div className="font-bold text-[13px] text-white mb-0.5">{s.device}</div>
              <div className="text-[12px] text-white/50 leading-relaxed">{s.steps}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
