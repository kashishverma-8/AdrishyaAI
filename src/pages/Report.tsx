import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const categories = [
  "Salary Delay",
  "Workplace Abuse",
  "Harassment",
  "Unsafe Conditions",
  "Overtime Exploitation",
  "Health Hazard",
  "Discrimination",
  "Child Labour",
  "Threat or Violence",
  "Other",
];

// ✅ STEP 3.1 - Risk Calculation Function Added
const calculateRisk = (text: string) => {
  let score = 0;
  let reason = [];

  // 1️⃣ Very short complaint
  if (text.length < 30) {
    score += 0.4;
    reason.push("Too short complaint");
  }

  // 2️⃣ Random characters pattern
  if (/^[a-zA-Z0-9!@#$%^&*()]+$/.test(text)) {
    score += 0.3;
    reason.push("Looks like random characters");
  }

  // 3️⃣ Too many repeated words
  const words = text.split(" ");
  const uniqueWords = new Set(words);
  if (uniqueWords.size < words.length / 2) {
    score += 0.2;
    reason.push("Repetitive content");
  }

  // 4️⃣ Too many links
  if ((text.match(/http/g) || []).length > 2) {
    score += 0.3;
    reason.push("Too many links");
  }

  let label = "Credible";
  if (score > 0.7) label = "Suspicious";
  else if (score > 0.3) label = "Needs Review";

  return {
    risk_score: Number(score.toFixed(2)),
    risk_label: label,
    risk_reason: reason.join(", ") || "Looks genuine",
  };
};

const Report = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  /* ================= LOCATION DETECTION ================= */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setLocation(coords);
        setLocationLoading(false);
      },
      () => {
        setLocationError("Permission denied or unable to fetch location.");
        setLocationLoading(false);
      }
    );
  };

  const handleLocationToggle = (value: boolean) => {
    setUseCurrentLocation(value);
    setLocation("");
    setLocationError("");

    if (value) detectLocation();
  };

  /* ================= AI PRIORITY DETECTION ================= */
  const aiAssessment = useMemo(() => {
    const text = description.toLowerCase();

    if (
      text.includes("hit") ||
      text.includes("violence") ||
      text.includes("threat") ||
      text.includes("bleeding") ||
      text.includes("danger")
    )
      return { label: "High Risk", color: "text-red-500" };

    if (
      text.includes("delay") ||
      text.includes("overwork") ||
      text.includes("harass")
    )
      return { label: "Medium Risk", color: "text-yellow-500" };

    if (description.length > 20)
      return { label: "Low Risk", color: "text-green-500" };

    return null;
  }, [description]);

  /* ================= AI FUNCTIONS ================= */
  const handleHelpWrite = () => {
    let template = "";

    switch (category) {
      case "Salary Delay":
        template = `I have not received my salary for [Month/Duration].

Employer Name:
Amount Due:
How long delayed:
Impact on me:`;
        break;

      case "Harassment":
        template = `On [Date], I experienced harassment at my workplace.

Person involved:
What happened:
Any witnesses:
Impact on me:`;
        break;

      case "Threat or Violence":
        template = `I was threatened or physically harmed at work.

Who was involved:
What happened:
Is there immediate danger:
Additional details:`;
        break;

      case "Unsafe Conditions":
        template = `There are unsafe working conditions.

Type of hazard:
Since when:
Has anyone been injured:
Why it is dangerous:`;
        break;

      case "Workplace Abuse":
        template = `I am facing abuse at my workplace.

Type of abuse:
Who is responsible:
How frequently:
Impact on me:`;
        break;

      default:
        template = `On [Date], at [Workplace Location], I experienced the following issue:

What happened:
Who was involved:
Impact on me:`;
    }

    setDescription(template);
    setAiOpen(false);
  };

  const handleGenerateSummary = () => {
    if (!description) return;

    let prefix = "";

    switch (category) {
      case "Salary Delay":
        prefix = "Salary Delay Case: ";
        break;
      case "Harassment":
        prefix = "Harassment Complaint: ";
        break;
      case "Threat or Violence":
        prefix = "URGENT Violence Report: ";
        break;
      case "Unsafe Conditions":
        prefix = "Unsafe Workplace Condition: ";
        break;
      default:
        prefix = "Workplace Issue: ";
    }

    const short =
      description.length > 120
        ? description.substring(0, 120) + "..."
        : description;

    setDescription(prefix + short);
    setAiOpen(false);
  };

  const handleCheckSeverity = () => {
    setAiOpen(false);
  };

  /* ================= FILE HANDLER ================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  /* ================= ✅ STEP 3.2 - UPDATED SUBMIT FUNCTION ================= */
  const handleSubmit = async () => {
    // ✅ Calculate Risk Before Submit
    const riskData = calculateRisk(description);
    console.log("🔍 AI Risk Analysis:", riskData);

    const formData = new FormData();

    // ✅ Include Risk Data in Form Submission
    formData.append("category", category);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("anonymous", String(anonymous));
    formData.append("risk_score", riskData.risk_score.toString());
    formData.append("risk_label", riskData.risk_label);
    formData.append("risk_reason", riskData.risk_reason);

    files.forEach((file) => {
      formData.append("evidence", file);
    });

    try {
      const response = await fetch("https://adrishyaai.onrender.com/api/report", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setCaseId(data.caseId);
        setSubmitted(true);
        console.log("✅ Report Submitted with Risk Analysis:", {
          ...data,
          riskData
        });
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Upload failed. Make sure backend is running!");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-muted/40 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-muted/60 backdrop-blur shadow-2xl rounded-3xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-border px-8 py-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">
            Report Workplace Issue
          </h1>
        </div>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 space-y-8"
          >

            {/* CATEGORY */}
            <div>
              <h2 className="text-sm font-semibold mb-4">
                Select Category
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-xl px-4 py-2 text-sm transition ${
                      category === cat
                        ? "bg-primary text-white"
                        : "bg-secondary/60 hover:bg-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {category === "Other" && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-4 w-full rounded-lg bg-secondary/60 border border-border p-3 text-sm"
                />
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold">
                  Describe Issue
                </h2>

                <button
                  disabled={!category}
                  onClick={() => setAiOpen(true)}
                  className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-3 py-1 rounded-full disabled:opacity-40"
                >
                  <Sparkles className="h-3 w-3" />
                  AI Assist
                </button>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-xl bg-secondary/60 border border-border p-4 text-sm"
              />

              {aiAssessment && (
                <div className={`mt-3 text-sm flex gap-2 ${aiAssessment.color}`}>
                  <AlertTriangle className="h-4 w-4" />
                  AI Priority: {aiAssessment.label}
                </div>
              )}

              {/* ✅ NEW: Live Risk Score Display */}
              {description && (
                <div className="mt-3 p-3 bg-secondary/50 rounded-xl">
                  <div className="flex justify-between items-center text-xs">
                    <span>🔍 AI Risk Check:</span>
                    <span className="font-bold">
                      {calculateRisk(description).risk_label}
                    </span>
                  </div>
                  <div className="w-full bg-secondary/30 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${calculateRisk(description).risk_score * 100}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {calculateRisk(description).risk_reason}
                  </div>
                </div>
              )}
            </div>

            {/* LOCATION */}
            <div>
              <h2 className="text-sm font-semibold mb-2">
                Incident Location
              </h2>

              <div className="bg-secondary/50 p-4 rounded-xl space-y-3">

                <div className="flex gap-6 text-sm">
                  <label>
                    <input
                      type="radio"
                      checked={useCurrentLocation}
                      onChange={() => handleLocationToggle(true)}
                    />
                    Auto detect
                  </label>

                  <label>
                    <input
                      type="radio"
                      checked={!useCurrentLocation}
                      onChange={() => handleLocationToggle(false)}
                    />
                    Manual
                  </label>
                </div>

                {!useCurrentLocation && (
                  <input
                    type="text"
                    placeholder="Enter workplace location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl bg-secondary/60 border border-border p-3 text-sm"
                  />
                )}

                {useCurrentLocation && (
                  <div className="text-sm">
                    {locationLoading && "Fetching location..."}
                    {location && <p className="text-green-500">{location}</p>}
                    {locationError && (
                      <p className="text-red-500">{locationError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ANONYMOUS */}
            <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-xl">
              <span className="text-sm font-medium">
                Submit Anonymously
              </span>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous(!anonymous)}
              />
            </div>

            {/* UPLOAD */}
            <div>
              <h2 className="text-sm font-semibold mb-3">
                Upload Evidence (Optional)
              </h2>

              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/50 py-6 text-sm hover:bg-secondary transition">
                <Upload className="h-5 w-5" />
                Upload Photo / Video / Audio / Document
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Selected Files Preview */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2 text-sm">
                  {files.map((file, index) => (
                    <div key={index} className="bg-secondary/40 p-2 rounded-lg">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <div className="sticky bottom-20 bg-muted/60 pt-4">
              <button
                disabled={!category || !description || !location}
                onClick={handleSubmit}
                className="gradient-button w-full py-3 rounded-xl"
              >
                Submit Report
              </button>
            </div>

          </motion.div>
        ) : (
          <div className="flex flex-col items-center py-20">
            <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
            <h2 className="text-xl font-bold">
              Report Submitted Successfully
            </h2>
            <p className="text-primary font-bold mt-2">
              {caseId}
            </p>
          </div>
        )}

        {/* AI POPUP */}
        {aiOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-secondary/90 backdrop-blur w-[90%] max-w-sm rounded-2xl p-6 space-y-4 shadow-2xl">
              <h3 className="font-bold text-center">
                🤖 AI Smart Assist
              </h3>

              <button
                onClick={handleHelpWrite}
                className="w-full py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition"
              >
                ✍ Help me write
              </button>

              <button
                onClick={handleGenerateSummary}
                className="w-full py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition"
              >
                🧠 Generate summary
              </button>

              <button
                onClick={handleCheckSeverity}
                className="w-full py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition"
              >
                ⚠ Check severity
              </button>

              <button
                onClick={() => setAiOpen(false)}
                className="w-full text-sm text-red-500 mt-2"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
};

export default Report;
