import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import emailjs from "@emailjs/browser";
import {
  ArrowLeft,
  Download,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const today = new Date();
const currentMonth = today.toLocaleString("default", {
  month: "long",
  year: "numeric",
});

const months = [
  { month: "Sep", expected: 15000, received: 15000, employer: "ABC Corp" },
  { month: "Oct", expected: 15000, received: 12000, employer: "ABC Corp" },
  { month: "Nov", expected: 15000, received: 8000, employer: "ABC Corp" },
  { month: "Dec", expected: 15000, received: 0, employer: "ABC Corp" },
  { month: "Jan", expected: 15000, received: 0, employer: "ABC Corp" },
  { month: "Feb", expected: 15000, received: 5000, employer: "ABC Corp" },
];

const Salary = () => {
  const navigate = useNavigate();

  const [employerEmail, setEmployerEmail] = useState("");
  const [sendCopy, setSendCopy] = useState(true);

  const totalExpected = months.reduce((a, m) => a + m.expected, 0);
  const totalReceived = months.reduce((a, m) => a + m.received, 0);
  const pending = totalExpected - totalReceived;

  const reliabilityScore =
    totalExpected === 0
      ? 0
      : Math.round((totalReceived / totalExpected) * 100);

  const riskLevel =
    reliabilityScore > 85
      ? "Reliable"
      : reliabilityScore > 60
      ? "Moderate Risk"
      : "High Risk";

  const riskColor =
    reliabilityScore > 85
      ? "bg-green-900 text-green-400"
      : reliabilityScore > 60
      ? "bg-yellow-900 text-yellow-400"
      : "bg-red-900 text-red-400";

  // ================= PDF =================
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Salary Legal Notice Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Employer: ${months[0].employer}`, 20, 35);
    doc.text(`Generated: ${today.toDateString()}`, 20, 42);

    doc.text(`Total Expected: ₹${totalExpected}`, 20, 55);
    doc.text(`Total Received: ₹${totalReceived}`, 20, 62);
    doc.text(`Pending Amount: ₹${pending}`, 20, 69);
    doc.text(`Reliability Score: ${reliabilityScore}% (${riskLevel})`, 20, 76);

    autoTable(doc, {
      startY: 85,
      head: [["Month", "Expected", "Received", "Pending"]],
      body: months.map((m) => [
        m.month,
        `₹${m.expected}`,
        `₹${m.received}`,
        `₹${m.expected - m.received}`,
      ]),
    });

    doc.save("Salary_Legal_Report.pdf");
  };

  // ================= EMAIL =================
  const sendReminderEmail = () => {
    if (!employerEmail) {
      alert("Please enter employer email");
      return;
    }

    const templateParams = {
      to_email: employerEmail,
      cc_email: sendCopy ? "yourpersonalemail@gmail.com" : "",
      title: "Salary Payment Reminder",
      name: "Employee",
      time: new Date().toLocaleString(),
      message: `
Dear ${months[0].employer},

For ${currentMonth}:

Expected Salary: ₹${totalExpected}
Received Salary: ₹${totalReceived}
Pending Amount: ₹${pending}

Reliability Score: ${reliabilityScore}% (${riskLevel})

This is a formal reminder to clear the outstanding dues immediately.

Regards,
Employee
      `,
    };

    emailjs
      .send(
        "service_si3oiwa",
        "template_ziya0z6",
        templateParams,
        "sRFtFeBAwkAMNVGbM"
      )
      .then(() => {
        alert("Reminder email sent successfully ✅");
        generatePDF();
      })
      .catch((error) => {
        console.error("Email error:", error);
        alert("Failed to send email ❌");
      });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-4 bg-black">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </button>
        <h1 className="font-bold text-lg tracking-wide">
          Salary Tracker
        </h1>
      </div>

      <div className="p-6 space-y-6">

        {/* Summary Card */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Salary Overview</h2>
            <span className={`px-3 py-1 text-xs rounded-full ${riskColor}`}>
              {riskLevel}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400">Expected</p>
              <p className="font-bold text-lg">₹{totalExpected}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Received</p>
              <p className="font-bold text-lg text-green-400">
                ₹{totalReceived}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Pending</p>
              <p className="font-bold text-lg text-red-400">
                ₹{pending}
              </p>
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 space-y-4">
          <h3 className="text-sm text-gray-400">
            Send Legal Reminder
          </h3>

          <input
            type="email"
            placeholder="Enter Employer Email"
            value={employerEmail}
            onChange={(e) => setEmployerEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
          />

          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={sendCopy}
              onChange={() => setSendCopy(!sendCopy)}
              className="accent-blue-500"
            />
            Send copy to my email (Legal Proof)
          </label>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800">
          <h3 className="mb-4 text-sm text-gray-400">
            Monthly Salary Chart
          </h3>

          <div className="w-full h-[260px]">
            <ResponsiveContainer>
              <BarChart data={months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Legend />
                <Bar dataKey="expected" fill="#6366f1" radius={[6,6,0,0]} />
                <Bar dataKey="received" fill="#22c55e" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={generatePDF}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl flex justify-center items-center gap-2 shadow-md"
          >
            <Download className="h-4 w-4" />
            Generate Legal Proof Report (PDF)
          </button>

          <button
            onClick={sendReminderEmail}
            className="w-full py-3 bg-red-600 hover:bg-red-700 transition rounded-xl flex justify-center items-center gap-2 shadow-md"
          >
            <Mail className="h-4 w-4" />
            Send Legal Reminder Email
          </button>
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default Salary;
