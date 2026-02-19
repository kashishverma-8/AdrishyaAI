require("dotenv").config();
console.log("🚀 Production Server Starting...");

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const { createClient } = require("@supabase/supabase-js");

const app = express();

/* ================= BASIC CONFIG ================= */

const PORT = process.env.PORT || 5000;

// Secure CORS for production
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("✅ Beacon Backend Running Successfully");
});

/* ================= SUPABASE CONFIG ================= */

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing Supabase environment variables!");
  process.exit(1);
}

if (!process.env.HF_TOKEN) {
  console.error("❌ Missing HF_TOKEN in environment!");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/* ================= ENSURE UPLOADS FOLDER ================= */

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

/* ================= REPORT ROUTE ================= */

app.post("/api/report", upload.array("evidence", 10), async (req, res) => {
  try {
    const { category, description, location, anonymous } = req.body;

    const caseId = `CASE-${Math.floor(10000 + Math.random() * 90000)}`;

    const files = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
        }))
      : [];

    const { data, error } = await supabase
      .from("complaints")
      .insert([
        {
          case_id: caseId,
          category,
          description,
          location,
          anonymous,
          files,
        },
      ]);

    if (error) {
      console.error("❌ Supabase Error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, caseId, message: "Saved", data });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ================= LEGAL ASSISTANT ROUTE ================= */

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ error: "Message required" });

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          messages: [
            {
              role: "system",
              content:
                "You are a legal rights assistant. Provide general legal information only. Always add disclaimer: This is not legal advice.",
            },
            { role: "user", content: message },
          ],
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();
    const botReply =
      data.choices?.[0]?.message?.content || "No response";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Chat Error:", error);
    res.status(500).json({ error: "LLM error" });
  }
});

/* ================= VOLUNTEER CHAT ================= */

app.post("/chat-volunteer", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ error: "Message required" });

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          messages: [
            {
              role: "system",
              content:
                "You are a trained NGO volunteer helping workers with salary, labor law, and workplace issues. Be polite, practical, and supportive.",
            },
            { role: "user", content: message },
          ],
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();
    const botReply =
      data.choices?.[0]?.message?.content || "No response";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Volunteer Chat Error:", error);
    res.status(500).json({ error: "Volunteer LLM error" });
  }
});

/* ================= TRANSLATE ROUTE ================= */

app.post("/translate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ error: "Text required" });

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          messages: [
            {
              role: "system",
              content:
                "Translate the given English text into simple Hindi. Only return Hindi.",
            },
            { role: "user", content: text },
          ],
          max_tokens: 400,
        }),
      }
    );

    const data = await response.json();
    const translatedText =
      data.choices?.[0]?.message?.content || "";

    res.json({ translatedText });
  } catch (error) {
    console.error("❌ Translation Error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
