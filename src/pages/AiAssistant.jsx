import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://securecheck-api.onrender.com/api";

export default function AiAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message
        })
      });

      const data = await res.json();

      setReply(data.reply || "No response received.");
    } catch (err) {
      console.error(err);
      setReply("Failed to contact Cyber-Zero AI.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          AI Assistant
        </h1>

        <p className="text-gray-400 mb-8">
          Cyber-Zero Intelligent Security Assistant
        </p>

        <div className="bg-[#0f172a] border border-purple-500/30 rounded-2xl p-6 mb-6">

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Cyber-Zero anything about cybersecurity..."
            className="w-full min-h-[150px] bg-[#050b1a] border border-gray-700 rounded-lg p-4 text-white"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-500 rounded-lg py-3 font-semibold"
          >
            {loading ? "Thinking..." : "Ask Cyber-Zero"}
          </button>

        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-purple-400 font-bold mb-4">
            AI Response
          </h2>

          <div className="whitespace-pre-wrap text-gray-300">
            {reply || "No response yet."}
          </div>
        </div>

      </div>
    </div>
  );
}
