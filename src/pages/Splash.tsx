import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg"
        >
          <Shield className="h-10 w-10 text-primary-foreground" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4 font-heading text-5xl font-bold tracking-tight"
        >
          <span className="gradient-text">Adrishya</span>
          <span className="text-foreground">AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12 max-w-sm text-lg text-muted-foreground"
        >
          Everyone works. Not everyone is heard.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/login")}
          className="gradient-button flex items-center gap-3 px-8 py-4 text-lg"
        >
          Enter Secure Platform
          <ArrowRight className="h-5 w-5" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Shield className="h-4 w-4 text-safe" />
          End-to-End Encrypted
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Splash;
