import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Phone, ArrowRight, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");

  // Phone login states
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Email login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const DEMO_OTP = "123456";

  // Phone validation (10 digits only)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setOtpSent(true);
      toast.success(`Demo Mode: Your OTP is ${DEMO_OTP}`, {
        duration: 8000,
      });
    } else {
      toast.error("Phone number must be exactly 10 digits");
    }
  };

  const handleVerify = () => {
    if (otp === DEMO_OTP) {
      // Simulate login success
      localStorage.setItem("authToken", "demo-token");
      localStorage.setItem("userSession", JSON.stringify({ phone }));
      toast.success("✅ Login successful!");
      setTimeout(() => navigate("/home"), 1000);
    } else {
      toast.error("Invalid OTP. Demo OTP is 123456");
    }
  };

  // Email validation
  const handleEmailLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Simulate login success
    localStorage.setItem("authToken", "demo-token");
    localStorage.setItem("userSession", JSON.stringify({ email }));
    toast.success("✅ Login successful!");
    setTimeout(() => navigate("/home"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-gray-700/50 border border-gray-600 rounded-xl p-1 mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all ${
              loginMethod === "phone"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Phone OTP
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all ${
              loginMethod === "email"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Email + Password
          </motion.button>
        </div>

        {/* PHONE LOGIN */}
        {loginMethod === "phone" && (
          <>
            {!otpSent ? (
              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <div className="flex bg-gray-700/50 border border-gray-600 rounded-xl overflow-hidden">
                    <span className="flex items-center bg-gray-600 px-4 text-sm font-semibold text-gray-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter 10 digit number"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-xl"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendOtp}
                  disabled={phone.length !== 10}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-blue-500/30"
                >
                  {phone.length === 10 ? "Send OTP" : "Enter Phone Number"}
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <p className="text-sm text-gray-300">OTP sent to your phone</p>
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6 digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl py-5 pl-12 pr-4 text-center text-lg tracking-[0.5em] text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerify}
                  disabled={otp.length !== 6}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-emerald-500/30"
                >
                  {otp.length === 6 ? "Login" : "Enter OTP"}
                </motion.button>
              </div>
            )}
          </>
        )}

        {/* EMAIL LOGIN */}
        {loginMethod === "email" && (
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEmailLogin}
              disabled={!email || password.length < 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-blue-500/30"
            >
              Login Securely
            </motion.button>
          </div>
        )}

        {/* Demo Info */}
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500 mb-1">Demo Mode Active</p>
          <div className="text-[10px] text-gray-600 space-y-0.5">
            <p>📱 Phone OTP: 123456</p>
            <p>✉️ Email: demo@example.com / Pass: any6chars</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
