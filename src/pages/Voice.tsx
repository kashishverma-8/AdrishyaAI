import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
const API_BASE = "https://adrishyaai.onrender.com";


const languages = ["Hindi", "English", "Regional"];

const Voice = () => {
  const navigate = useNavigate();

  const [lang, setLang] = useState("Hindi");
  const [state, setState] = useState<"idle" | "listening" | "done">("idle");
  const [text, setText] = useState("");

  /* 🔥 GOOGLE TRANSLATE FUNCTION */
  const translateToEnglish = async (input: string) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
      input
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    return data[0][0][0]; // translated text
  };

  /* ================= MIC FUNCTION ================= */

  const handleMic = () => {
    if (state === "listening") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    // 🔥 Language Selection
    if (lang === "Hindi") recognition.lang = "hi-IN";
    else if (lang === "English") recognition.lang = "en-US";
    else recognition.lang = "hi-IN"; // regional detect auto later

    recognition.continuous = false;
    recognition.interimResults = false;

    setState("listening");
    recognition.start();

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;

      if (lang === "Hindi") {
        // Hindi mode → save as Hindi
        setText(transcript);
      } else {
        // English or Regional → translate to English
        const translated = await translateToEnglish(transcript);
        setText(translated);
      }

      setState("done");
    };

    recognition.onerror = () => {
      setState("idle");
      alert("Voice recognition failed");
    };
  };

  /* ================= POST FUNCTION ================= */

  const handlePost = async () => {
    if (!text) {
      alert("Please speak first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category", "Voice Complaint");
      formData.append("description", text); // 🔥 Final text (Hindi or English)
      formData.append("location", "Village Area");
      formData.append("anonymous", "true");

      const res = await fetch(`${API_BASE}/api/report`, {
        method: "POST",
        body: formData,
      });

      await res.json();

      alert("Complaint submitted!");

      setText("");
      setState("idle");

      navigate("/home");
    } catch (error) {
      alert("Backend not connected");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center gap-3 border-b px-4 py-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">Voice Report</h1>
      </div>

      <div className="flex flex-col items-center px-6 pt-8">
        <div className="mb-10 flex items-center gap-2 rounded-lg bg-secondary/50 p-1">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-md px-4 py-2 text-sm ${
                lang === l
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMic}
          className={`flex h-32 w-32 items-center justify-center rounded-full ${
            state === "listening"
              ? "bg-purple-600 text-white"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          <Mic className="h-12 w-12" />
        </motion.button>

        <p className="mt-6 text-lg font-medium">
          {state === "idle" && "Tap to speak"}
          {state === "listening" && "Listening..."}
          {state === "done" && "Converted Text"}
        </p>

        {state === "done" && (
          <div className="mt-6 w-full space-y-4">
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-sm">{text}</p>
            </div>

            <button
              onClick={handlePost}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-green-500 py-3 text-sm text-white"
            >
              Post Complaint
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Voice;
