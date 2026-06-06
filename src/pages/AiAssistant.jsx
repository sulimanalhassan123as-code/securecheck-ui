import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://securecheck-api.onrender.com/api";

export default function AiAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const quickPrompts = [
    "Analyze this source code",
    "Explain this vulnerability",
    "Review API security",
    "Generate secure code",
    "Technology intelligence"
  ];

  const sendMessage = async (customMessage = null) => {
    const userMessage = customMessage || message;

    if (!userMessage.trim()) return;

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
      const res = await fetch(`${API_BASE}/assistant-v2/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      const data = await res.json();

     let assistantContent =
  data.reply || "No response received.";

if (data.type === "WEB_SCAN") {
  assistantContent =
`🔍 ${data.message}

Scan started successfully.

Cyber-Zero is analyzing the target.
Please wait for the scan report.`;
}

if (data.type === "CODE_ANALYSIS") {
  assistantContent =
    JSON.stringify(data.report, null, 2);
}

setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    content: assistantContent
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

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
    } catch {
      alert("Copy failed");
    }
  };

  const shareMessage = async (text) => {
    try {
      if (navigator.share) {
        await navigator.share({
          text
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Copied for sharing");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white flex flex-col">

      <div className="border-b border-gray-800 bg-[#0f172a] px-6 py-4">
        <h1 className="text-3xl font-bold">
          🤖 Cyber-Zero AI Assistant
        </h1>

        <p className="text-gray-400 mt-1">
          Security • Development • Technology Intelligence
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">

        <div className="max-w-4xl mx-auto">

          {messages.length === 0 && (
            <div className="mb-6">

              <div className="text-gray-400 mb-4">
                Try one of these:
              </div>

              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(prompt)}
                    className="px-4 py-2 rounded-full border border-purple-500 text-purple-300 hover:bg-purple-500/20"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

            </div>
          )}

          <div className="space-y-4">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 border ${
                  msg.role === "user"
                    ? "bg-cyan-600/20 border-cyan-500 ml-8"
                    : "bg-purple-600/20 border-purple-500 mr-8"
                }`}
              >

                <div className="font-bold text-sm mb-2">
                  {msg.role === "user"
                    ? "You"
                    : "Cyber-Zero"}
                </div>

                <div className="whitespace-pre-wrap text-gray-200">
                  {msg.content}
                </div>

                {msg.role === "assistant" && (
                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={() => copyMessage(msg.content)}
                      className="text-xs px-3 py-1 rounded bg-cyan-600"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => shareMessage(msg.content)}
                      className="text-xs px-3 py-1 rounded bg-purple-600"
                    >
                      Share
                    </button>

                  </div>
                )}

              </div>
            ))}

            {loading && (
              <div className="bg-purple-600/20 border border-purple-500 rounded-2xl p-4 mr-8">
                <div className="font-bold text-sm mb-2">
                  Cyber-Zero
                </div>

                <div className="animate-pulse">
                  ● ● ●
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>

          </div>

        </div>

      </div>

      <div className="sticky bottom-0 border-t border-gray-800 bg-[#0f172a] p-4">

        <div className="max-w-4xl mx-auto">

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Cyber-Zero anything..."
            className="w-full bg-[#050b1a] border border-gray-700 rounded-xl p-4 text-white resize-none"
            rows="3"
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="mt-3 w-full bg-purple-600 hover:bg-purple-500 rounded-xl py-3 font-bold"
          >
            {loading ? "Thinking..." : "Send Message"}
          </button>

        </div>

      </div>

      <Footer />

    </div>
  );
}
