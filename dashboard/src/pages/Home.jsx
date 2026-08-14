import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Video, Mic, Brain, FileText, MessageSquare, Shield,
  Zap, Clock, ChevronRight, Sun, Moon, Star, ArrowRight,
  Sparkles, Users
} from 'lucide-react';
import axios from 'axios';

/* ────────────────── tiny reusable pieces ────────────────── */



const WaveformBar = ({ delay }) => (
  <div
    className="w-1 rounded-full bg-gradient-to-t from-[#00796b] to-emerald-400"
    style={{
      animation: 'waveform 1.2s ease-in-out infinite',
      animationDelay: `${delay}s`,
      height: '16px',
    }}
  />
);

const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <div
    className={`group relative bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-7
      hover:border-[#00796b] dark:hover:border-[#80cbc4] hover:shadow-md transition-all duration-500 hover:-translate-y-1
      opacity-0 animate-fade-in-up`}
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5
        ${color} transition-transform duration-300 group-hover:scale-110`}
    >
      <Icon size={22} className="text-white" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description, delay }) => (
  <div
    className="relative flex flex-col items-center text-center opacity-0 animate-fade-in-up"
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00796b] to-[#80cbc4] flex items-center justify-center text-white text-xl font-bold mb-5 shadow-lg shadow-teal-500/20">
      {number}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">{description}</p>
  </div>
);

const StatBadge = ({ value, label }) => (
  <div className="text-center">
    <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#00796b] to-[#80cbc4] bg-clip-text text-transparent">
      {value}
    </p>
    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{label}</p>
  </div>
);

const TestimonialCard = ({ quote, name, role, delay }) => (
  <div
    className="bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-500 opacity-0 animate-fade-in-up"
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 italic">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00796b] to-[#80cbc4] flex items-center justify-center text-white text-xs font-bold">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-slate-900 dark:text-white text-sm font-medium">{name}</p>
        <p className="text-slate-500 text-xs">{role}</p>
      </div>
    </div>
  </div>
);

const Loader = () => (
  <div className="flex items-center justify-center h-screen bg-[#f8f9fa] dark:bg-[#202124]">
    <div className="w-12 h-12 border-4 border-[#00796b] border-t-transparent rounded-full animate-spin"></div>
  </div>
);
/* ────────────────── main component ────────────────── */

const Home = () => {
  // const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/auth`, { withCredentials: true }).then(() => {
      setTimeout(() => {
        setLogged(true);
        setLoading(false);
      }, 1000)
    }).catch(err => {
      setLoading(false);
      console.log(err);
    })
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: Mic, title: 'Live Transcription', description: 'Capture every word in real time with AI-powered speech recognition during your Google Meet sessions.', color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { icon: Brain, title: 'AI-Powered Insights', description: 'Automatically extract key decisions, action items, and discussion topics from your meetings.', color: 'bg-gradient-to-br from-[#00796b] to-emerald-500' },
    { icon: MessageSquare, title: 'Smart Chat Assistant', description: 'Ask natural language questions about any past meeting and get instant, context-aware answers.', color: 'bg-gradient-to-br from-emerald-500 to-teal-500' },
    { icon: FileText, title: 'Meeting Summaries', description: 'Get concise, AI-generated summaries with key takeaways as soon as your meeting ends.', color: 'bg-gradient-to-br from-amber-500 to-orange-500' },
    { icon: Shield, title: 'Private & Secure', description: 'Your meeting data stays private. All transcriptions are encrypted and accessible only to you.', color: 'bg-gradient-to-br from-rose-500 to-red-500' },
    { icon: Zap, title: 'Instant Setup', description: 'Install the Chrome extension, sign in, and start transcribing — no complex configuration needed.', color: 'bg-gradient-to-br from-indigo-500 to-violet-500' },
  ];

  const steps = [
    { title: 'Install Extension', description: 'Add MeetAssist to Chrome from the Web Store. It takes less than 10 seconds.' },
    { title: 'Join a Meeting', description: 'Open Google Meet as usual. Our overlay activates automatically and stays out of your way.' },
    { title: 'Start Recording', description: 'Hit record. The AI captures, transcribes, and analyses your meeting in real time.' },
    { title: 'Query Anytime', description: 'Visit your dashboard to review insights, ask questions, or export summaries.' },
  ];

  const testimonials = [
    { quote: 'This completely replaced my manual note-taking. The AI summaries are shockingly accurate — it catches details I would have missed.', name: 'Aarav Mehta', role: 'Product Manager' },
    { quote: 'Being able to query past meetings like a search engine has saved our team hours every week. Genuinely game-changing.', name: 'Priya Sharma', role: 'Engineering Lead' },
    { quote: 'The setup was ridiculously easy. Install, sign in, done. The transcription quality rivals premium enterprise tools.', name: 'Daniel Kim', role: 'Startup Founder' },
  ];

  return (
    loading ? <Loader /> : <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#202124] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden font-sans">
      {/* ════════ Ambient background glows ════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/5 dark:bg-[#00796b]/10 blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/8 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-emerald-500/3 dark:bg-emerald-500/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      </div>

      {/* ════════ Navigation ════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/80 dark:bg-[#202124]/80 backdrop-blur-xl border-b border-[#dadce0] dark:border-[#3c4043] shadow-md shadow-slate-200/10'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00796b] flex items-center justify-center shadow-lg shadow-teal-500/20 text-white">
              <Video size={18} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent">
              MeetAssist
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#extension-setup" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Extension Setup</a>
            <a href="#testimonials" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Testimonials</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            {!logged && (<Link
              to="/login"
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>)}
            {!logged && (<Link
              to="/signup"
              className="text-sm font-medium bg-[#00796b] hover:bg-[#00695c] text-white px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/10"
            >
              Get Started
            </Link>)}
            {logged && (<Link
              to="/dashboard"
              className="text-sm font-medium bg-[#00796b] hover:bg-[#00695c] text-white px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/10"
            >
              Dashboard
            </Link>)}
          </div>
        </div>
      </nav>

      {/* ════════ Hero Section ════════ */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Tag line chip */}
          <div className="inline-flex items-center gap-2 bg-[#00796b]/10 border border-[#00796b]/20 dark:border-teal-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
            <Sparkles size={14} className="text-[#00796b] dark:text-teal-400" />
            <span className="text-xs text-[#00796b] dark:text-teal-300 font-medium">AI-Powered Meeting Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-slate-900 dark:text-white animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Never miss a word
            <br />
            <span className="bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent animate-gradient-text inline-block">
              from your meetings
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            MeetAssist records, transcribes, and analyses your Google Meet sessions in real time.
            Ask questions, extract insights, and search through any past meeting — instantly.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            {!logged && (<Link
              to="/signup"
              className="group flex items-center gap-2 bg-[#00796b] text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#00695c] transition-all hover:-translate-y-0.5 shadow-xl shadow-teal-500/10"
            >
              Start Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>)}
            {logged && (<Link
              to="/dashboard"
              className="group flex items-center gap-2 bg-[#00796b] text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#00695c] transition-all hover:-translate-y-0.5 shadow-xl shadow-teal-500/10"
            >
              Go to Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>)}
            <a
              href="#how-it-works"
              className="flex items-center gap-2 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] text-slate-700 dark:text-slate-300 px-8 py-4 rounded-2xl text-base font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              See How It Works
              <ChevronRight size={18} />
            </a>
          </div>

          {/* ─── Animated waveform / visual hero ─── */}
          <div className="relative max-w-3xl mx-auto animate-scale-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', opacity: 0 }}>
            <div className="bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl p-8 shadow-2xl">
              {/* Mock meeting header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-600 dark:text-red-400 text-xs font-medium">Recording</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-xs">Google Meet — Team Standup</div>
              </div>

              {/* Waveform */}
              <div className="flex items-center justify-center gap-[3px] h-16 mb-6">
                {[...Array(40)].map((_, i) => (
                  <WaveformBar key={i} delay={i * 0.06} />
                ))}
              </div>

              {/* Mock transcript lines */}
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-white">A</div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Aarav — 0:42</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Let's finalize the Q4 roadmap priorities today. I think we should focus on the AI pipeline improvements first.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00796b] to-[#80cbc4] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-white">P</div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">Priya — 1:15</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Agreed. The latency reduction work will unblock three other teams. I can share the benchmarks after this call.</p>
                  </div>
                </div>
                <div className="h-5 w-2/3 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
              </div>
            </div>

            {/* Floating badges around the hero card */}
            <div className="absolute -left-6 top-12 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-xl px-4 py-2.5 shadow-xl animate-float hidden lg:flex items-center gap-2">
              <Brain size={16} className="text-purple-500 dark:text-purple-400" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">AI Insights</span>
            </div>
            <div className="absolute -right-6 top-24 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-xl px-4 py-2.5 shadow-xl animate-float hidden lg:flex items-center gap-2" style={{ animationDelay: '1s' }}>
              <FileText size={16} className="text-cyan-500 dark:text-cyan-400" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Auto Summary</span>
            </div>
            <div className="absolute -left-4 bottom-8 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-xl px-4 py-2.5 shadow-xl animate-float hidden lg:flex items-center gap-2" style={{ animationDelay: '2s' }}>
              <MessageSquare size={16} className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Ask Anything</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Stats bar ════════ */}
      <section className="relative py-12 border-y border-[#dadce0] dark:border-[#3c4043]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBadge value="10x" label="Faster Reviews" />
          <StatBadge value="100%" label="Accuracy" />
          <StatBadge value="<1s" label="Query Response" />
          <StatBadge value="∞" label="Meetings Stored" />
        </div>
      </section>

      {/* ════════ Features ════════ */}
      <section id="features" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#00796b]/10 border border-[#00796b]/20 dark:border-teal-500/20 rounded-full px-4 py-1.5 mb-5">
              <Zap size={14} className="text-amber-500 dark:text-amber-400" />
              <span className="text-xs text-[#00796b] dark:text-teal-300 font-medium">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
              Everything you need to
              <span className="bg-gradient-to-r from-[#00796b] to-[#80cbc4] bg-clip-text text-transparent"> master meetings</span>
            </h2>
            <p className="text-slate-655 dark:text-slate-400 max-w-xl mx-auto">
              From live transcription to AI-powered insights, MeetAssist gives your meetings superpowers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={0.1 + i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ How it Works ════════ */}
      <section id="how-it-works" className="relative py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#00796b]/10 border border-[#00796b]/20 dark:border-teal-500/20 rounded-full px-4 py-1.5 mb-5">
              <Clock size={14} className="text-cyan-500 dark:text-cyan-400" />
              <span className="text-xs text-[#00796b] dark:text-teal-300 font-medium">Simple Setup</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
              Up and running in
              <span className="bg-gradient-to-r from-cyan-500 to-[#00796b] bg-clip-text text-transparent"> minutes</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              No lengthy onboarding. Install, sign in, and let the AI handle the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-teal-500/20" />
            {steps.map((s, i) => (
              <StepCard key={s.title} number={i + 1} {...s} delay={0.1 + i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Extension Setup / Installation Guide ════════ */}
      <section id="extension-setup" className="relative py-28 px-6 border-t border-[#dadce0] dark:border-[#3c4043]/60 bg-white/30 dark:bg-black/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side text / download button */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#00796b]/10 border border-[#00796b]/20 dark:border-teal-500/20 rounded-full px-4 py-1.5">
                <Video size={14} className="text-[#00796b] dark:text-teal-400" />
                <span className="text-xs text-[#00796b] dark:text-teal-300 font-medium">Chrome Extension Setup</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                Load the extension in <span className="bg-gradient-to-r from-blue-500 via-[#00796b] to-emerald-500 bg-clip-text text-transparent">Chrome Developer Mode</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                Since MeetAssist is a developer-preview extension, you can download the built extension folder directly and load it locally in your Chrome browser in just a few clicks.
              </p>

              <div className="pt-2">
                <a
                  target="_blank"
                  download
                  href="https://github.com/radhechaudhary/Transcriptor.AI/raw/refs/heads/main/extension/meet-extension.zip"
                  className="group inline-flex items-center gap-2.5 bg-[#00796b] hover:bg-[#00695c] text-white px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/10"
                >
                  Download Extension ZIP
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right side steps */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 flex gap-4 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#00796b]/10 dark:bg-[#00796b]/20 flex items-center justify-center text-[#00796b] dark:text-[#80cbc4] font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Download &amp; Extract</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Click the download button to get the repository ZIP. Extract it on your computer.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 flex gap-4 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#00796b]/10 dark:bg-[#00796b]/20 flex items-center justify-center text-[#00796b] dark:text-[#80cbc4] font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Open Extensions Page</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Open a new tab in Google Chrome, navigate to <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[11px] text-blue-600 dark:text-blue-400 select-all">chrome://extensions</code>.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 flex gap-4 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#00796b]/10 dark:bg-[#00796b]/20 flex items-center justify-center text-[#00796b] dark:text-[#80cbc4] font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Enable Developer Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    In the top-right corner of the Extensions page, toggle the switch that says <strong>Developer mode</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 flex gap-4 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#00796b]/10 dark:bg-[#00796b]/20 flex items-center justify-center text-[#00796b] dark:text-[#80cbc4] font-bold text-sm shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Load Unpacked Extension</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Click the <strong>Load unpacked</strong> button in the top-left, and select the extracted <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[11px] text-[#00796b] dark:text-[#80cbc4]">extension/dist</code> folder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Testimonials ════════ */}
      <section id="testimonials" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#00796b]/10 border border-[#00796b]/20 dark:border-teal-500/20 rounded-full px-4 py-1.5 mb-5">
              <Users size={14} className="text-pink-500 dark:text-pink-400" />
              <span className="text-xs text-[#00796b] dark:text-teal-300 font-medium">Loved by Teams</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
              What our users
              <span className="bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent"> say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} {...t} delay={0.1 + i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="relative py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-teal-500/5 to-blue-500/5 dark:from-[#00796b]/10 dark:to-blue-500/10 border border-[#dadce0] dark:border-[#3c4043] rounded-3xl p-12 md:p-16 backdrop-blur-lg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-500/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-5 text-slate-900 dark:text-white">
                Ready to transform your
                <span className="bg-gradient-to-r from-[#00796b] to-[#80cbc4] bg-clip-text text-transparent"> meetings</span>?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto">
                Join thousands of professionals who never miss a detail. Start free — no credit card required.
              </p>
              {!logged ? <Link
                to="/signup"
                className="group inline-flex items-center gap-2 bg-[#00796b] text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-[#00695c] transition-all hover:-translate-y-0.5 shadow-xl shadow-teal-500/10"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link> : <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 bg-[#00796b] text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-[#00695c] transition-all hover:-translate-y-0.5 shadow-xl shadow-teal-500/10"
              >
                Go to Dashboard
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Footer ════════ */}
      <footer className="border-t border-[#dadce0] dark:border-[#3c4043] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00796b] flex items-center justify-center text-white">
              <Video size={16} />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent">
              MeetAssist
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">How It Works</a>
            <a href="#extension-setup" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Extension Setup</a>
            <Link to="/login" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-600">© 2026 MeetAssist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
