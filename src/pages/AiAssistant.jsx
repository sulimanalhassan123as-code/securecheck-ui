import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://securecheck-api.onrender.com/api";

export default function AiAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage
      }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "No response received."
        }
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to contact Cyber-Zero AI."
        }
      ]);
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
            className="w-full min-h-[120px] bg-[#050b1a] border border-gray-700 rounded-lg p-4 text-white"
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
            Conversation
          </h2>

          <div className="space-y-4">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "user"
                    ? "bg-cyan-600/20 border border-cyan-500 rounded-xl p-3"
                    : "bg-purple-600/20 border border-purple-500 rounded-xl p-3"
                }
              >
                <div className="text-xs font-bold mb-2">
                  {msg.role === "user" ? "You" : "Cyber-Zero"}
                </div>

                <div className="whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="bg-purple-600/20 border border-purple-500 rounded-xl p-3">
                Cyber-Zero is thinking...
              </div>
            )}

            {messages.length === 0 && !loading && (
              <div className="text-gray-400">
                No conversation yet.
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
