// Home.tsx - Hero: PERFECT GLASSMorphism + MAX Background Visibility
import { motion } from "framer-motion";
import {
  FileText,
  Mic,
  Scale,
  Wallet,
  MapPin,
  Shield,
  Phone,
  Brain,
  Lock,
  AlertTriangle,
  Users,
  Zap,
  BarChart3,
  Globe,
  Gavel,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, ReactElement } from "react";
import { useLanguage } from "../LanguageContext";
import SOSButton from "../components/SOSButton";

const stats: {
  en: Array<{ value: string; label: string; icon: React.ElementType }>;
  hi: Array<{ value: string; label: string; icon: React.ElementType }>;
} = {
  en: [
    { value: "50K+", label: "Workers Protected", icon: Users },
    { value: "98%", label: "Case Accuracy", icon: Zap },
    { value: "24/7", label: "Emergency Support", icon: Phone },
  ],
  hi: [
    { value: "50K+", label: "कर्मचारी सुरक्षित", icon: Users },
    { value: "98%", label: "मामले की सटीकता", icon: Zap },
    { value: "24/7", label: "आपातकालीन सहायता", icon: Phone },
  ]
};

const features: {
  en: Array<{ icon: React.ElementType; title: string; desc: string }>;
  hi: Array<{ icon: React.ElementType; title: string; desc: string }>;
} = {
  en: [
    { icon: Shield, title: "Worker-First Architecture", desc: "Designed exclusively for vulnerable labor communities with multilingual support and fear-free reporting." },
    { icon: Lock, title: "Zero-Trace Privacy System", desc: "End-to-end encryption with identity masking and secure evidence storage." },
    { icon: Brain, title: "AI Exploitation Detection", desc: "Risk scoring engine flags repeated abuse and auto-escalates serious cases." },
    { icon: MapPin, title: "City-Level Abuse Heatmap", desc: "Live geo-intelligence dashboard highlights exploitation hotspots." },
  ],
  hi: [
    { icon: Shield, title: "कर्मचारी-प्रथम वास्तुकला", desc: "कमजोर श्रम समुदायों के लिए विशेष रूप से डिज़ाइन किया गया, बहुभाषी समर्थन और भय-मुक्त रिपोर्टिंग के साथ।" },
    { icon: Lock, title: "शून्य-ट्रेस गोपनीयता प्रणाली", desc: "एंड-टू-एंड एन्क्रिप्शन, पहचान छिपाने और सुरक्षित साक्ष्य भंडारण के साथ।" },
    { icon: Brain, title: "एआई शोषण पहचान", desc: "जोखिम स्कोरिंग इंजन दोहराए गए शोषण को चिह्नित करता है और गंभीर मामलों को स्वचालित रूप से बढ़ाता है।" },
    { icon: MapPin, title: "शहर-स्तरीय शोषण हीटमैप", desc: "लाइव भौगोलिक-खुफिया डैशबोर्ड शोषण हॉटस्पॉट्स को हाइलाइट करता है।" },
  ]
};

const steps: {
  en: Array<{ number: string; title: string; desc: string; icon: React.ElementType }>;
  hi: Array<{ number: string; title: string; desc: string; icon: React.ElementType }>;
} = {
  en: [
    { number: "01", title: "Report Abuse", desc: "Submit voice, text, or photo complaint in under 30 seconds.", icon: Mic },
    { number: "02", title: "AI Risk Analysis", desc: "System validates patterns and prioritizes high-risk cases.", icon: Brain },
    { number: "03", title: "Legal Escalation", desc: "Cases routed to NGOs, lawyers, and authorities instantly.", icon: Gavel },
  ],
  hi: [
    { number: "01", title: "शोषण की रिपोर्ट करें", desc: "30 सेकंड के अंदर आवाज, टेक्स्ट या फोटो शिकायत दर्ज करें।", icon: Mic },
    { number: "02", title: "एआई जोखिम विश्लेषण", desc: "सिस्टम पैटर्न की जाँच करता है और उच्च जोखिम वाले मामलों को प्राथमिकता देता है।", icon: Brain },
    { number: "03", title: "कानूनी कार्रवाई", desc: "मामले तुरंत एनजीओ, वकीलों और अधिकारियों को भेजे जाते हैं।", icon: Gavel },
  ]
};

const impactData: {
  en: { title: string; subtitle: string; stats: Array<{ value: string; label: string; icon: React.ElementType }> };
  hi: { title: string; subtitle: string; stats: Array<{ value: string; label: string; icon: React.ElementType }> };
} = {
  en: {
    title: "Measurable Impact",
    subtitle: "Real accountability. Real recovery. Real systemic change.",
    stats: [
      { value: "₹2.4 Cr+", label: "Recovered unpaid wages", icon: BarChart3 },
      { value: "12,000+", label: "Cases resolved", icon: Users },
      { value: "18 Cities", label: "Active monitoring network", icon: Globe }
    ]
  },
  hi: {
    title: "मापनीय प्रभाव",
    subtitle: "वास्तविक जवाबदेही। वास्तविक पुनर्प्राप्ति। वास्तविक प्रणालीगत परिवर्तन।",
    stats: [
      { value: "₹2.4 Cr+", label: "वसूल किए गए बकाया वेतन", icon: BarChart3 },
      { value: "12,000+", label: "समाधान किए गए मामले", icon: Users },
      { value: "18 शहर", label: "सक्रिय निगरानी नेटवर्क", icon: Globe }
    ]
  }
};

const heroData: {
  en: { line1: string; line2: string; subtitle: string };
  hi: { line1: string; line2: string; subtitle: string };
} = {
  en: { 
    line1: "From Invisible",
    line2: "To Invincible",
    subtitle: "AdrishyaAI safeguards the invisible workforce with secure reporting, intelligent AI detection, and automated legal escalation—ensuring protection and accountability at every step."
  },
  hi: { 
    line1: "अदृश्य",
    line2: "से अजेय तक",
    subtitle: "AdrishyaAI अदृश्य कार्यबल की सुरक्षा करता है, सुरक्षित रिपोर्टिंग, बुद्धिमान एआई पहचान और स्वचालित कानूनी कार्रवाई के माध्यम से—हर कदम पर संरक्षण और जवाबदेही सुनिश्चित करते हुए।"
  }
};

const sectionData: {
  en: {
    featuresTitle: string;
    featuresSubtitle: string;
    howTitle: string;
    howSubtitle: string;
    navbar: { features: string; howItWorks: string; takeAction: string; language: string };
  };
  hi: {
    featuresTitle: string;
    featuresSubtitle: string;
    howTitle: string;
    howSubtitle: string;
    navbar: { features: string; howItWorks: string; takeAction: string; language: string };
  };
} = {
  en: {
    featuresTitle: "Built for Protection",
    featuresSubtitle: "Infrastructure designed for safety, dignity, and accountability.",
    howTitle: "Three Steps to Justice",
    howSubtitle: "From report to resolution in under 48 hours.",
    navbar: { features: "Features", howItWorks: "How It Works", takeAction: "Take Action ▾", language: "Language ▾" }
  },
  hi: {
    featuresTitle: "सुरक्षा के लिए निर्मित",
    featuresSubtitle: "सुरक्षा, गरिमा और जवाबदेही के लिए डिज़ाइन की गई बुनियादी ढांचा।",
    howTitle: "न्याय के तीन चरण",
    howSubtitle: "रिपोर्ट से समाधान तक 48 घंटे के अंदर।",
    navbar: { features: "विशेषताएँ", howItWorks: "यह कैसे काम करता है", takeAction: "कार्रवाई करें ▾", language: "भाषा ▾" }
  }
};

const navTranslations: {
  en: { report: string; voice: string; rights: string; impactStory: string };
  hi: { report: string; voice: string; rights: string; impactStory: string };
} = {
  en: { report: "Report", voice: "Audio Complaint", rights: "Know Rights", impactStory: "Impact Story" },
  hi: { report: "रिपोर्ट", voice: "ऑडियो शिकायत", rights: "अधिकार जानें", impactStory: "प्रभाव कहानी" }
};

const actions = [
  { icon: FileText, label: "Report Issue", path: "/report" },
  { icon: Mic, label: "Audio Complaint", path: "/voice" },
  { icon: Scale, label: "Know Rights", path: "/legal" },
  { icon: Wallet, label: "Salary Tracker", path: "/salary" },
  { icon: MapPin, label: "Abuse Heatmap", path: "/heatmap" },
];

const Home = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const featuresRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const [isTakeActionOpen, setIsTakeActionOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentData = {
    stats: stats[language as keyof typeof stats],
    features: features[language as keyof typeof features],
    steps: steps[language as keyof typeof steps],
    impact: impactData[language as keyof typeof impactData],
    hero: heroData[language as keyof typeof heroData],
    section: sectionData[language as keyof typeof sectionData],
    nav: { 
      ...navTranslations[language as keyof typeof navTranslations], 
      ...sectionData[language as keyof typeof sectionData].navbar 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsTakeActionOpen(false);
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTakeAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTakeActionOpen(!isTakeActionOpen);
    setIsLanguageOpen(false);
  };

  const toggleLanguage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLanguageOpen(!isLanguageOpen);
    setIsTakeActionOpen(false);
  };

  const handleImpactClick = () => {
    navigate("/impact");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR - ULTRA TRANSPARENT */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/20 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg group-hover:scale-105 transition-all duration-200">
              AdrishyaAI
            </div>
          </div>
          <nav className="hidden lg:flex gap-8 text-white/90 font-medium items-center backdrop-blur-sm">
            <button 
              onClick={() => scrollToSection(featuresRef)} 
              className="hover:text-emerald-400 transition-all duration-200 font-semibold drop-shadow-sm"
            >
              {currentData.nav.features}
            </button>
            <button 
              onClick={() => scrollToSection(howRef)} 
              className="hover:text-emerald-400 transition-all duration-200 font-semibold drop-shadow-sm"
            >
              {currentData.nav.howItWorks}
            </button>
            <button 
              onClick={() => navigate("/report")} 
              className="hover:text-emerald-400 transition-all duration-200 font-semibold drop-shadow-sm"
            >
              {currentData.nav.report}
            </button>
            <button 
              onClick={() => navigate("/voice")} 
              className="hover:text-emerald-400 transition-all duration-200 font-semibold drop-shadow-sm"
            >
              {currentData.nav.voice}
            </button>
            <button 
              onClick={() => navigate("/legal")} 
              className="hover:text-emerald-400 transition-all duration-200 font-semibold drop-shadow-sm"
            >
              {currentData.nav.rights}
            </button>
            <div className="dropdown-container relative">
              <button
                onClick={toggleTakeAction}
                className="flex items-center gap-1 hover:text-emerald-400 text-white/90 font-semibold transition-all duration-200 drop-shadow-sm"
              >
                {currentData.nav.takeAction}
              </button>
              <div 
                className={`absolute left-0 mt-2 w-64 bg-black/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden transition-all duration-200 ease-in-out z-[1000] ${
                  isTakeActionOpen
                    ? 'opacity-100 visible scale-100 translate-y-0'
                    : 'opacity-0 invisible scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                {actions.map((action, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(action.path as string);
                      setIsTakeActionOpen(false);
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-emerald-500/20 border-b border-white/10 last:border-b-0 first:pt-4 last:pb-4 cursor-pointer transition-all duration-200 hover:translate-x-2"
                  >
                    <action.icon className="w-5 h-5 text-emerald-400 flex-shrink-0 drop-shadow-sm" />
                    <span className="text-sm font-semibold text-white">{action.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={handleImpactClick}
              className="hover:text-emerald-400 transition-all duration-200 font-semibold drop-shadow-sm"
            >
              {currentData.nav.impactStory}
            </button>
            <div className="dropdown-container relative">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 hover:text-emerald-400 text-white/90 font-semibold transition-all duration-200 drop-shadow-sm"
              >
                {currentData.nav.language}
              </button>
              <div 
                className={`absolute right-0 mt-2 w-32 bg-black/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden transition-all duration-200 ease-in-out z-[1000] ${
                  isLanguageOpen
                    ? 'opacity-100 visible scale-100 translate-y-0'
                    : 'opacity-0 invisible scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage("en");
                    setIsLanguageOpen(false);
                  }}
                  className="p-3 hover:bg-emerald-500/20 border-b border-white/10 cursor-pointer transition-all duration-200 text-sm font-semibold text-white hover:translate-x-2 drop-shadow-sm"
                >
                  English
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage("hi");
                    setIsLanguageOpen(false);
                  }}
                  className="p-3 hover:bg-emerald-500/20 cursor-pointer transition-all duration-200 text-sm font-semibold text-white hover:translate-x-2 drop-shadow-sm"
                >
                  हिन्दी
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO SECTION - PERFECT GLASSMorphism */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-32 text-center bg-cover bg-center bg-no-repeat bg-fixed relative overflow-hidden" 
        style={{ 
          backgroundImage: "url('https://images.ctfassets.net/ukazlt65o6hl/4rOdXsv4DHvliTBYOQr92s/744c608842ba7ff420f1e46b64f14800/Thumbnail')"
        }}
      >
        {/* ✅ BEST Balanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/15 z-10"></div>
        
        {/* ✅ MAIN GLASS BOX - PERFECT */}
        <div className="max-w-4xl mx-auto backdrop-blur-md bg-black/15 rounded-3xl p-12 border border-white/20 shadow-2xl relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-transparent bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text leading-tight drop-shadow-2xl [text-shadow:0_4px_8px_rgba(0,0,0,0.8)]"
          >
            {currentData.hero.line1}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-transparent bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text leading-tight drop-shadow-2xl [text-shadow:0_4px_8px_rgba(0,0,0,0.8)]"
          >
            {currentData.hero.line2}
          </motion.div>
          
          {/* ✅ SUBTITLE - PERFECT GLASS */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/95 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-xl font-medium bg-black/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10"
          >
            {currentData.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 px-6 text-center relative z-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {currentData.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="group"
            >
              <stat.icon className="w-16 h-16 text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <h3 className="text-5xl md:text-6xl font-black text-emerald-400 mb-4 group-hover:text-emerald-300 transition-all duration-300 drop-shadow-xl">{stat.value}</h3>
              <p className="text-white/90 text-lg font-semibold drop-shadow-md">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION - ULTRA TRANSPARENT */}
      <section ref={featuresRef} className="py-24 px-6 bg-gradient-to-b from-black/10 to-transparent relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl"
            >
              {currentData.section.featuresTitle}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-xl max-w-3xl mx-auto drop-shadow-lg font-medium"
            >
              {currentData.section.featuresSubtitle}
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentData.features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-8 bg-white/3 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/10 hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-4 shadow-2xl"
              >
                <feature.icon className="w-16 h-16 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500 mx-auto drop-shadow-xl" />
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-white group-hover:text-emerald-300 transition-all duration-300 drop-shadow-lg">{feature.title}</h3>
                <p className="text-white/90 text-base text-center leading-relaxed drop-shadow-md font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section ref={howRef} className="py-24 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl"
            >
              {currentData.section.howTitle}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-xl max-w-3xl mx-auto drop-shadow-lg font-medium"
            >
              {currentData.section.howSubtitle}
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
            {currentData.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center group"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl font-black shadow-2xl group-hover:scale-110 transition-all duration-500 drop-shadow-2xl border-4 border-white/20">
                  {step.number}
                </div>
                <step.icon className="w-16 h-16 text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl" />
                <h3 className="text-2xl font-bold mb-6 group-hover:text-emerald-400 transition-all duration-300 drop-shadow-xl">{step.title}</h3>
                <p className="text-white/90 text-lg leading-relaxed max-w-md mx-auto font-semibold drop-shadow-lg">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT SECTION - ULTRA TRANSPARENT */}
      <section ref={impactRef} className="py-24 px-6 bg-gradient-to-b from-transparent to-black/10 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl"
            >
              {currentData.impact.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-xl max-w-3xl mx-auto drop-shadow-lg font-medium"
            >
              {currentData.impact.subtitle}
              <br />
              <span className="text-base text-emerald-400 mt-4 block font-bold drop-shadow-md">
                👆 Click "Impact Story" above to see real success stories
              </span>
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {currentData.impact.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group p-10 bg-white/3 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/10 hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-4 shadow-2xl cursor-pointer"
                onClick={handleImpactClick}
              >
                <stat.icon className="w-16 h-16 text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl" />
                <h3 className="text-4xl md:text-5xl font-black mb-4 text-emerald-400 group-hover:text-emerald-300 transition-all duration-300 drop-shadow-2xl">{stat.value}</h3>
                <p className="text-white/90 text-lg font-semibold drop-shadow-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER - ULTRA TRANSPARENT */}
      <footer className="py-16 px-6 text-center text-white/80 border-t border-white/20 bg-black/30 backdrop-blur-xl relative z-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl mb-6 font-semibold drop-shadow-md">
            {language === "en" 
              ? "© 2026 InvisiblePeople. Empowering the invisible workforce nationwide."
              : "© 2026 InvisiblePeople. अदृश्य कार्यबल को देशव्यापी सशक्त बना रहे हैं।"
            }
          </p>
          <div className="text-lg font-medium drop-shadow-lg">
            Built with ❤️ for the workers who build our nation.
          </div>
        </div>
      </footer>
      <SOSButton />
      
      <button className="lg:hidden fixed top-20 right-6 p-4 bg-emerald-600/95 backdrop-blur-xl rounded-full z-50 shadow-2xl border-2 border-white/20 hover:scale-110 transition-all duration-200">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export default Home;
