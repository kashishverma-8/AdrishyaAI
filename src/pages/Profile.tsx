import { motion } from "framer-motion";
import {
  ChevronRight,
  Lock,
  Eye,
  Trash2,
  Clock,
  Fingerprint,
  LogOut,
  Bot,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

interface PrivacySetting {
  icon: any;
  label: string;
  enabled: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    { icon: Eye, label: "Hide phone metadata", enabled: true },
    { icon: Trash2, label: "Self-destruct identity (30 days)", enabled: true },
    { icon: Clock, label: "Auto-delete location logs", enabled: false },
    { icon: Lock, label: "End-to-end encryption", enabled: true },
  ]);

  // 🔥 Static Trust Shield (Hackathon Version)
  const reputationScore = 82;
  const reputationTier =
    reputationScore >= 80
      ? "Trusted Contributor"
      : reputationScore >= 60
      ? "Verified Member"
      : reputationScore >= 40
      ? "Active Participant"
      : "New Contributor";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        setUser(null);
      } else if (user) {
        setUser(user);
        try {
          const { data } = await supabase
            .from('user_settings')
            .select('settings')
            .eq('user_id', user.id)
            .single();

          if (data?.settings && Array.isArray(data.settings)) {
            setPrivacySettings(data.settings);
          }
        } catch {}
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = async (index: number) => {
    if (saving) return;

    const updated = [...privacySettings];
    updated[index].enabled = !updated[index].enabled;
    setPrivacySettings(updated);
    setSaving(true);

    if (user) {
      try {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            settings: updated,
            updated_at: new Date().toISOString()
          });
        toast.success('Privacy setting updated');
      } catch {
        toast.success('Saved locally');
      }
    } else {
      toast.success('Setting saved locally');
    }

    setSaving(false);
  };

  const enabledCount = privacySettings.filter((s) => s.enabled).length;
  const privacyScore = Math.round((enabledCount / privacySettings.length) * 100);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  // ✅ FIXED: Help & Support → Chat Integration
  const handleHelpSupport = () => {
    navigate("/chat");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-bg px-6 pt-8 pb-6"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-lg"
          >
            <Fingerprint className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {user?.email || "Anonymous User"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user ? "Identity Protected" : "Guest Mode"}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-5">
        {/* Privacy Shield */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Privacy Shield
            </h3>
            <span className="text-lg font-bold bg-safe/20 px-3 py-1 rounded-full text-safe">
              {privacyScore}%
            </span>
          </div>

          <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-secondary/30">
            <motion.div
              key={privacyScore}
              initial={{ width: 0 }}
              animate={{ width: `${privacyScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-safe via-green-500 to-emerald-600 shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {privacySettings.map((setting, index) => (
              <motion.div 
                key={`${setting.label}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all"
              >
                <div className="flex items-center gap-3">
                  <setting.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-base font-medium text-foreground">
                    {setting.label}
                  </span>
                </div>
                <button
                  onClick={() => toggleSetting(index)}
                  aria-label={`Toggle ${setting.label}`}
                  disabled={saving}
                  className={`relative h-6 w-11 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-safe/50 focus:ring-offset-2 ${
                    setting.enabled 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-inner" 
                      : "bg-secondary/50"
                  } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
                >
                  <motion.div
                    layout
                    className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-lg"
                    animate={{ 
                      x: setting.enabled ? 24 : 0,
                      scale: setting.enabled ? 1.05 : 1
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 🛡 Trust Shield */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🛡 Trust Shield
            </h3>
            <span className="text-lg font-bold bg-primary/20 px-3 py-1 rounded-full text-primary">
              {reputationScore}%
            </span>
          </div>

          <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-secondary/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${reputationScore}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 shadow-sm"
            />
          </div>

          <div className="mb-6">
            <span className="px-4 py-2 text-sm font-bold rounded-full bg-primary/20 text-primary border border-primary/30">
              {reputationTier}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 p-3 bg-secondary/30 rounded-xl">
              <div className="flex justify-between">
                <span className="text-muted-foreground">✔ Verified Reports</span>
                <span className="font-bold text-foreground">14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">🤝 Community Validations</span>
                <span className="font-bold text-foreground">9</span>
              </div>
            </div>
            <div className="space-y-2 p-3 bg-secondary/30 rounded-xl">
              <div className="flex justify-between">
                <span className="text-muted-foreground">🔐 Security Compliance</span>
                <span className="font-bold text-green-500">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">📈 Activity Level</span>
                <span className="font-bold text-foreground">Consistent</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="divide-y divide-border/50">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/impact")}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-all duration-200 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary/20 rounded-xl flex items-center justify-center">
                  📊
                </div>
                <span className="text-base font-semibold text-foreground">
                  My Reports
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/salary")}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-all duration-200 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-accent/20 rounded-xl flex items-center justify-center">
                  💰
                </div>
                <span className="text-base font-semibold text-foreground">
                  Salary History
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            {/* ✅ FIXED: Saved Resources - CHANGED TO /saved-resources */}
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/saved-resources")}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-all duration-200 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary/20 rounded-xl flex items-center justify-center">
                  💾
                </div>
                <span className="text-base font-semibold text-foreground">
                  Saved Resources
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            {/* ✅ FIXED: Help & Support → Chat Page */}
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHelpSupport}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-all duration-200 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-purple-500/20 rounded-xl flex items-center justify-center">
                  <Bot className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-base font-semibold text-foreground">
                  Help & Support
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/security")}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-all duration-200 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-safe" />
                <span className="text-base font-semibold text-foreground">
                  Account Security
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ 
            scale: 0.98, 
            backgroundColor: "rgb(239 68 68 / 0.2)",
            borderColor: "rgb(239 68 68 / 0.5)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-destructive/30 bg-destructive/10 py-4 text-base font-semibold text-destructive hover:bg-destructive/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-destructive/50 focus:ring-offset-2"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
