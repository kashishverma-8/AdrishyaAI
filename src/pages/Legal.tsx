import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Bot, Sparkles, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

type ChatMessage = {
  id: number;
  from: "worker" | "bot";
  text: string;
  hindi?: string;
  time: string;
};

const suggestions = [
  "Minimum wage?",
  "Leave rules?",
  "What if unpaid?",
  "Working hours limit?",
];

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "bot",
    text: "Hello! I'm your AI Legal Rights Assistant. Ask me anything about labor laws, salary issues, overtime, or workplace rights.",
    time: "Now",
  },
];

const Legal = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHindi, setShowHindi] = useState(false);
  const [listening, setListening] = useState(false); // 🎤 Listening state

  // 🔹 Hindi Translation
  const translateToHindi = async (text: string) => {
    try {
      const res = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) return "";

      const data = await res.json();
      return data.translatedText || "";
    } catch {
      return "";
    }
  };

  // 🎤 Voice to Text Function
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // auto type
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      from: "worker",
      text,
      time: "Now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      const originalText =
        data.reply || "Sorry, I couldn't process that.";

      let hindiText = "";
      if (showHindi) {
        hindiText = await translateToHindi(originalText);
      }

      const botReply: ChatMessage = {
        id: Date.now() + 1,
        from: "bot",
        text: originalText,
        hindi: hindiText,
        time: "Now",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          from: "bot",
          text: "⚠️ Server error. Please make sure backend is running.",
          time: "Now",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">

      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ai-purple/20">
                <Bot className="h-4 w-4 text-ai-purple" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">
                  Legal Rights Assistant
                </h1>
                <p className="flex items-center gap-1 text-[10px] text-ai-purple">
                  <Sparkles className="h-2.5 w-2.5" /> AI-Powered
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHindi(!showHindi)}
            className="rounded-full bg-ai-purple/20 px-3 py-1 text-xs text-ai-purple hover:bg-ai-purple/30"
          >
            {showHindi ? "Hindi ON" : "Hindi OFF"}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.from === "worker" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.from === "worker"
                  ? "rounded-br-md bg-secondary text-foreground"
                  : "rounded-bl-md border border-ai-purple/20 bg-ai-purple/5 text-foreground"
              }`}
            >
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {msg.text}
              </p>

              {showHindi && msg.hindi && (
                <p className="mt-3 whitespace-pre-line text-sm text-green-400 border-t border-border pt-2">
                  {msg.hindi}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="text-sm text-muted-foreground">
            AI is typing...
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            className="whitespace-nowrap rounded-full border border-ai-purple/30 bg-ai-purple/10 px-3 py-1.5 text-xs text-ai-purple hover:bg-ai-purple/20"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input + Mic */}
      <div className="border-t border-border bg-card/50 px-4 py-3 mb-16">
        <div className="flex items-center gap-2">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your rights..."
            className="flex-1 rounded-full border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-ai-purple focus:outline-none"
          />

          {/* 🎤 Mic Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={startListening}
            className={`flex h-10 w-10 items-center justify-center rounded-full 
            ${listening ? "bg-red-500" : "bg-ai-purple/20"}`}
          >
            <Mic className="h-4 w-4 text-white" />
          </motion.button>

          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage(input)}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ai-purple text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </motion.button>

        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Legal;
