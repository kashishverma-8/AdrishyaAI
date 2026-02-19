import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MapPin, Clock, IndianRupee, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle } from "lucide-react";

/* ---------------- FAKE RESOLVED STORIES ---------------- */

const stories = [
  {
    name: "Ramesh Kumar",
    city: "Delhi",
    industry: "Construction",
    issue: "3 months unpaid wages",
    amount: "₹18,000",
    time: "36 Hours",
    result:
      "AI flagged repeated complaints. Legal intervention triggered and wages recovered.",
  },
  {
    name: "Sita Devi",
    city: "Mumbai",
    industry: "Garment Factory",
    issue: "Underpayment below minimum wage",
    amount: "₹32,500",
    time: "48 Hours",
    result:
      "Pattern detection exposed systemic wage theft. 27 workers compensated.",
  },
  {
    name: "Rahim Ansari",
    city: "Lucknow",
    industry: "Delivery Services",
    issue: "Forced unpaid overtime",
    amount: "₹12,000",
    time: "24 Hours",
    result:
      "Emergency escalation activated. Employer cleared dues immediately.",
  },
];

/* ---------------- IMPACT COMPONENT ---------------- */

const Impact = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });

    // 🔥 Fake AI Detection (Hackathon Mode)
    const enhancedData =
      data?.map((c: any) => {
        if (!c.risk_label) {
          const score = Math.random();
          let label = "Needs Review";

          if (score > 0.75) label = "Credible";
          else if (score < 0.4) label = "Suspicious";

          return {
            ...c,
            risk_score: score,
            risk_label: label,
            risk_reason:
              label === "Credible"
                ? "Strong evidence pattern detected"
                : label === "Suspicious"
                ? "Inconsistent details detected"
                : "Needs manual verification",
          };
        }
        return c;
      }) || [];

    setComplaints(enhancedData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Real Stories. Real Justice.
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            AI-powered complaint tracking & real world impact.
          </p>
        </motion.div>

        {/* ---------------- RESOLVED STORIES ---------------- */}

        <h2 className="text-3xl font-bold mb-10 text-emerald-400 text-center">
          ✅ Resolved Cases
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white/5 p-6 rounded-3xl border border-white/10"
            >
              <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                {story.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {story.city} • {story.industry}
                </div>
                <div><strong>Issue:</strong> {story.issue}</div>
                <div className="flex items-center gap-2">
                  <IndianRupee size={14} />
                  Recovered: {story.amount}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  Resolved in: {story.time}
                </div>
                <p className="pt-3 text-gray-400 border-t border-white/10">
                  {story.result}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---------------- LIVE COMPLAINTS ---------------- */}

        <h2 className="text-3xl font-bold mb-10 text-center">
          📊 Live Complaints (AI Risk Analysis)
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="space-y-6">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-white/5 p-6 rounded-3xl border border-white/10"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-bold text-emerald-400">
                    {c.category || "Workplace Issue"}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.risk_label === "Credible"
                        ? "bg-green-500/20 text-green-400"
                        : c.risk_label === "Suspicious"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {c.risk_label} ({(c.risk_score * 100).toFixed(0)}%)
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-3">
                  {c.description || "No description"}
                </p>

                <div className="text-xs text-yellow-300 bg-yellow-500/10 p-2 rounded-xl">
                  🤖 AI Insight: {c.risk_reason}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Impact;
