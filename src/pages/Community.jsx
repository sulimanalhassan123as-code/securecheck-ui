import { useState, useEffect } from "react";
import PageShell from "../components/PageShell";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    setPosts(JSON.parse(localStorage.getItem("czCommunity") || "[]"));
  }, []);

  const save = (updated) => {
    localStorage.setItem("czCommunity", JSON.stringify(updated));
    setPosts(updated);
    const notifs = JSON.parse(localStorage.getItem("czNotifs") || "[]");
    notifs.unshift({ msg: `💬 ${localStorage.getItem("cyberzero_name") || "User"} posted a question`, time: new Date().toLocaleTimeString() });
    localStorage.setItem("czNotifs", JSON.stringify(notifs.slice(0, 50)));
  };

  const post = () => {
    if (!text.trim()) return;
    const name = localStorage.getItem("cyberzero_name") || "Anonymous";
    const updated = [{ id: Date.now(), name, text: text.trim(), time: new Date().toLocaleTimeString(), reply: "" }, ...posts.slice(0, 49)];
    save(updated);
    setText("");
  };

  return (
    <PageShell title="Community" icon="💬">
      {/* Post input */}
      <div className="rounded-2xl p-4 mb-4 border border-[rgba(8,145,178,0.12)] bg-white/3">
        <div className="text-[13px] font-bold text-[#22d3ee] mb-3">Ask a Public Question</div>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Type your question here — admin will reply publicly..."
          rows={3}
          className="w-full bg-white/4 border border-[rgba(8,145,178,0.15)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] transition-colors mb-3 placeholder-white/20 resize-none" />
        <button onClick={post}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#7c3aed,#0891b2)" }}>
          Post Question
        </button>
      </div>

      {/* Posts */}
      {!posts.length && (
        <div className="text-center py-10 text-white/30 text-sm">No posts yet. Be the first to ask!</div>
      )}
      {posts.map(p => (
        <div key={p.id} className="rounded-2xl p-4 mb-3 border border-white/6 bg-white/3">
          <div className="flex justify-between mb-2">
            <span className="text-[12px] font-bold text-[#22d3ee]">👤 {p.name}</span>
            <span className="text-[10px] text-white/30">{p.time}</span>
          </div>
          <div className="text-[13px] text-white/70 leading-relaxed">{p.text}</div>
          {p.reply && (
            <div className="mt-3 border-l-2 border-[#0891b2] pl-3 rounded-r-lg py-1" style={{ background: "rgba(8,145,178,0.06)" }}>
              <div className="text-[10px] font-bold text-[#22d3ee] mb-1">🛡 Admin Reply</div>
              <div className="text-[12px] text-white/60">{p.reply}</div>
            </div>
          )}
        </div>
      ))}
    </PageShell>
  );
}
