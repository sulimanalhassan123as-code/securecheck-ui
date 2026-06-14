import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const myName = localStorage.getItem("cyberzero_name") || "Anonymous";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("czCommunity") || "[]");
    setPosts(stored);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 110) + "px";
  };

  const postMsg = () => {
    if (!text.trim()) return;
    const newPost = {
      id: Date.now(),
      name: myName,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reply: null,
    };
    const updated = [...posts, newPost];
    localStorage.setItem("czCommunity", JSON.stringify(updated.slice(-100)));
    setPosts(updated);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "48px";
  };

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      height:"100dvh", background:"#0a1628", color:"#fff", overflow:"hidden"
    }}>
      {/* WhatsApp-style header */}
      <div style={{
        flexShrink:0, display:"flex", alignItems:"center", gap:12,
        padding:"0 14px", height:60, background:"#0d2137",
        borderBottom:"1px solid rgba(8,145,178,0.2)"
      }}>
        <button onClick={() => navigate("/")} style={{
          background:"none", border:"none", color:"#22d3ee",
          fontSize:22, cursor:"pointer", padding:"4px 6px 4px 0"
        }}>←</button>
        <div style={{
          width:40, height:40, borderRadius:"50%",
          background:"linear-gradient(135deg,#0891b2,#6366f1)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0
        }}>💬</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:800 }}>Community Hub</div>
          <div style={{ fontSize:11, color:"#22d3ee" }}>Cyber-Zero Developer Network</div>
        </div>
        <span style={{ fontSize:11, color:"rgba(148,163,184,0.5)" }}>{posts.length} msg{posts.length!==1?"s":""}</span>
      </div>

      {/* Chat messages — scrollable */}
      <div style={{
        flex:1, overflowY:"auto", overflowX:"hidden",
        padding:"12px 14px 8px", display:"flex", flexDirection:"column", gap:6,
        WebkitOverflowScrolling:"touch",
        background:"linear-gradient(180deg,#091525 0%,#0a1628 100%)"
      }}>
        {posts.length === 0 && (
          <div style={{
            flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            color:"rgba(148,163,184,0.3)", fontSize:14, gap:10, paddingTop:80
          }}>
            <span style={{ fontSize:44 }}>💬</span>
            <div>No messages yet</div>
            <div style={{ fontSize:12 }}>Post a question to the community</div>
          </div>
        )}

        {posts.map((p) => {
          const isMe = p.name === myName;
          return (
            <div key={p.id} style={{
              display:"flex", flexDirection:"column",
              alignItems: isMe ? "flex-end" : "flex-start", gap:2
            }}>
              {!isMe && (
                <div style={{ fontSize:11, color:"#22d3ee", marginLeft:10, fontWeight:700 }}>{p.name}</div>
              )}
              <div style={{
                maxWidth:"80%", wordBreak:"break-word",
                background: isMe ? "linear-gradient(135deg,#075e54,#128c7e)" : "rgba(20,32,52,0.97)",
                border: isMe ? "none" : "1px solid rgba(8,145,178,0.2)",
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding:"10px 14px", fontSize:14, lineHeight:1.55, color:"#fff",
                boxShadow:"0 2px 8px rgba(0,0,0,0.3)"
              }}>
                {p.text}
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:4, textAlign:"right" }}>{p.time}</div>
              </div>
              {p.reply && (
                <div style={{ maxWidth:"80%", alignSelf:"flex-start", marginTop:2 }}>
                  <div style={{ fontSize:11, color:"#22d3ee", marginLeft:10, fontWeight:700, marginBottom:2 }}>🛡 Admin</div>
                  <div style={{
                    background:"rgba(8,30,55,0.97)", border:"1px solid rgba(34,211,238,0.3)",
                    borderRadius:"18px 18px 18px 4px", padding:"10px 14px",
                    fontSize:14, lineHeight:1.55, color:"#e2e8f0",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.3)", maxWidth:"100%", wordBreak:"break-word"
                  }}>
                    {p.reply}
                    <div style={{ fontSize:10, color:"rgba(34,211,238,0.5)", marginTop:4, textAlign:"right" }}>Admin · {p.time}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} style={{ height:1 }} />
      </div>

      {/* WhatsApp-style input bar */}
      <div style={{
        flexShrink:0, padding:"8px 12px 18px",
        background:"#0d2137", borderTop:"1px solid rgba(8,145,178,0.15)",
        display:"flex", alignItems:"flex-end", gap:10
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => { setText(e.target.value); autoResize(); }}
          onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); postMsg(); } }}
          placeholder="Type a message..."
          rows={1}
          style={{
            flex:1, height:48, background:"rgba(15,25,40,0.97)",
            border:"1.5px solid rgba(8,145,178,0.2)", borderRadius:24,
            padding:"12px 18px", color:"#e2e8f0", fontSize:15,
            resize:"none", outline:"none", fontFamily:"inherit",
            lineHeight:1.5, caretColor:"#22d3ee", boxSizing:"border-box",
            transition:"border-color 0.2s"
          }}
          onFocus={e => e.target.style.borderColor="rgba(34,211,238,0.5)"}
          onBlur={e => e.target.style.borderColor="rgba(8,145,178,0.2)"}
        />
        <button onClick={postMsg} disabled={!text.trim()} style={{
          width:46, height:46, borderRadius:"50%", flexShrink:0,
          background:"linear-gradient(135deg,#075e54,#128c7e)",
          border:"none", color:"#fff", fontSize:18, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          opacity:!text.trim() ? 0.4 : 1, transition:"opacity 0.2s"
        }}>➤</button>
      </div>
    </div>
  );
}
