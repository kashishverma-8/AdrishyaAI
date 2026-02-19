import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Smartphone,
  LogOut,
  History,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const Security = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        const savedTwoFA = localStorage.getItem('twofa_enabled');
        setTwoFAEnabled(savedTwoFA === 'true');
        
        const mockSessions = [
          {
            id: 1,
            device: "iPhone 15 Pro • Chrome",
            location: "Delhi, India",
            ip: "103.12.45.67",
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
            active: true
          },
          {
            id: 2,
            device: "Samsung Galaxy • Firefox",
            location: "Mumbai, India", 
            ip: "192.168.1.45",
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
            active: false
          }
        ];
        setSessions(mockSessions);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.email) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!currentPassword) {
      toast.error("Current password is required!");
      return;
    }

    setPasswordLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect!");
        setPasswordLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      toast.success("✅ Password updated successfully!");
      await supabase.auth.signOut();
      navigate("/login");

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Password update failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleShowPasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    if (showPasswordForm) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const toggleTwoFA = () => {
    const newState = !twoFAEnabled;
    setTwoFAEnabled(newState);
    localStorage.setItem('twofa_enabled', newState.toString());
    toast.success(newState ? "✅ 2FA enabled" : "✅ 2FA disabled");
  };

  const logoutAllDevices = async () => {
    if (!confirm("Logout from ALL devices?")) return;
    try {
      await supabase.auth.signOut();
      toast.success("✅ Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-gray-700 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Clean Header */}
      <div className="px-6 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center border-2 border-gray-600">
              <Shield className="w-7 h-7 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white">Account Security</h1>
              {user?.email && (
                <p className="text-sm text-gray-400 mt-1 truncate font-medium">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 pb-20 space-y-4 max-w-md mx-auto">
        {/* Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Password</h3>
                <p className="text-sm text-gray-400">Change your account password</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!showPasswordForm ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShowPasswordForm}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Edit
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShowPasswordForm}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 border border-gray-500 text-gray-300 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>

          {showPasswordForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 overflow-hidden"
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                    placeholder="New password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    Confirm
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePasswordChange}
                disabled={passwordLoading || newPassword.length < 8 || newPassword !== confirmPassword}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-semibold text-sm shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-blue-500/30"
              >
                {passwordLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* 2FA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                twoFAEnabled
                  ? "bg-green-600/80 border-green-500"
                  : "bg-gray-700 border-gray-600"
              }`}>
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Extra layer of security</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleTwoFA}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all border ${
                twoFAEnabled
                  ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
                  : "bg-green-600 hover:bg-green-700 border-green-600 text-white"
              }`}
            >
              {twoFAEnabled ? "Disable" : "Enable"}
            </motion.button>
          </div>
          {twoFAEnabled && (
            <div className="flex items-center gap-2 mt-4 pl-15">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Active</span>
            </div>
          )}
        </motion.div>

        {/* Sessions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 max-h-72 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              {sessions.filter(s => s.active).length} active
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border transition-all group cursor-pointer hover:shadow-2xl hover:border-gray-500 ${
                  session.active
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-gray-700/40 bg-gray-700/20"
                }`}
                onClick={() => toast.info("Session logged out")}
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${
                      session.active ? "bg-green-500" : "bg-gray-500"
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{session.device}</p>
                      <p className="text-xs text-gray-400 truncate">{session.location}</p>
                    </div>
                  </div>
                  <div className="text-xs text-right ml-2">
                    <p className="text-gray-500 font-mono text-xs mb-1">{session.ip}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(session.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Logout All Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/70 border border-red-600/30 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-gray-700 border-2 border-red-600 rounded-xl flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Logout All Devices</h3>
              <p className="text-sm text-red-300">Sign out from all sessions instantly</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logoutAllDevices}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl font-semibold text-sm shadow-xl hover:shadow-2xl border border-red-500/30 transition-all"
          >
            🚪 Logout All Devices
          </motion.button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Security;
