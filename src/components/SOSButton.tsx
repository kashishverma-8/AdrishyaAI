import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Phone, ShieldCheck, MessageCircle } from "lucide-react";

const SOSButton = () => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 📍 GET LOCATION MESSAGE
  const getSOSMessage = (lat: number, lng: number) => {
    return `🚨 SOS EMERGENCY ALERT 🚨

I need IMMEDIATE HELP!

📍 LIVE LOCATION:
https://maps.google.com/?q=${lat},${lng}

⏰ Time: ${new Date().toLocaleString('en-IN')}

Sent from InvisiblePeople App`;
  };

  // 🚨 TRIGGER SOS
  const triggerSOS = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setTriggered(true);
      },
      () => {
        alert("Please allow location access for SOS");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ⏳ HOLD LOGIC
  const startHold = useCallback(() => {
    setHolding(true);
    setProgress(0);
    let p = 0;

    intervalRef.current = setInterval(() => {
      p += 3.33;
      setProgress(Math.min(p, 100));

      if (p >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setHolding(false);
        triggerSOS();
      }
    }, 100);
  }, []);

  const endHold = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  }, []);

  // 📞 EMERGENCY CONTACTS
  const contacts = [
    { name: "Emergency Police", phone: "100", whatsapp: "9191100" },
    { name: "Ambulance Service", phone: "108", whatsapp: "9191108" },
    { name: "Women Helpline", phone: "181", whatsapp: "9191181" },
    { name: "Child Helpline", phone: "1098", whatsapp: "91911098" },
  ];

  // 👤 TRUSTED CONTACT
  const trustedContact = {
    name: "Trusted Emergency Contact",
    phone: "6392298074",
    whatsapp: "6392298074",
  };

  return (
    <>
      {/* ================= COMPACT SOS BUTTON ================= */}
      <div className="flex flex-col items-center p-3">
        <motion.button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          whileTap={{ scale: holding ? 0.92 : 0.96 }}
          className="group relative flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-xl border-3 border-red-500/60 hover:shadow-2xl active:shadow-xl transition-all duration-200"
        >
          {/* SOS Icon */}
          <AlertTriangle className={`h-8 w-8 transition-all ${holding ? 'rotate-6 scale-105' : ''}`} />
          
          {/* Text */}
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">
            {holding ? "HOLD" : "SOS"}
          </span>

          {/* Compact Progress */}
          {holding && (
            <div className="absolute inset-0 rounded-2xl bg-white/20">
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white to-blue-300/50"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}
        </motion.button>

        <p className="mt-2 text-[11px] text-gray-400 text-center leading-tight max-w-[160px] px-1">
          Hold 3s for emergency alert
        </p>
      </div>

      {/* ================= COMPACT MEDIUM MODAL ================= */}
      <AnimatePresence>
        {triggered && location && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-[340px] bg-gray-900 border-2 border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Compact Header */}
              <div className="bg-gradient-to-r from-red-600/95 to-red-700/95 p-4 text-center border-b border-red-600/40">
                <AlertTriangle className="mx-auto h-10 w-10 text-white mb-2" />
                <h3 className="text-lg font-bold text-white mb-0.5">
                  🚨 EMERGENCY SOS
                </h3>
                <p className="text-xs text-red-100">Location shared with contacts</p>
              </div>

              {/* Trusted Contact - Compact */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-start gap-3 p-3 bg-gray-800/60 rounded-xl border border-green-500/40">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border-2 border-green-400/50">
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{trustedContact.name}</p>
                    <p className="text-xs text-gray-400 truncate">{trustedContact.phone}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <a
                      href={`tel:${trustedContact.phone}`}
                      className="flex items-center gap-1.5 bg-green-600/90 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all w-full justify-center"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${trustedContact.whatsapp}?text=${encodeURIComponent(
                        getSOSMessage(location.lat, location.lng)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-green-500/90 hover:bg-green-500 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts - Compact */}
              <div className="p-4 flex-1 overflow-y-auto">
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
                  📞 Emergency Services
                </h4>
                <div className="space-y-2">
                  {contacts.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-gray-800/50 hover:bg-gray-700/70 p-3 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm truncate">{contact.name}</p>
                          <p className="text-xs text-gray-400 truncate">{contact.phone}</p>
                        </div>
                        <div className="flex gap-1.5 ml-2 opacity-0 group-hover:opacity-100 transition-all">
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-1 bg-blue-600/90 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-md text-[10px] font-semibold shadow-md hover:shadow-lg transition-all flex-shrink-0"
                          >
                            <Phone className="h-3 w-3" />
                            Call
                          </a>
                          <a
                            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                              getSOSMessage(location.lat, location.lng)
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 bg-green-500/90 hover:bg-green-500 text-white p-1.5 rounded-md shadow-md hover:shadow-lg transition-all flex-shrink-0"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Close Button - Compact */}
              <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTriggered(false)}
                  className="w-full flex items-center justify-center gap-1.5 bg-gray-700/80 hover:bg-gray-600/80 text-gray-200 py-2.5 px-4 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all border border-gray-600/50"
                >
                  <X className="h-4 w-4" />
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
