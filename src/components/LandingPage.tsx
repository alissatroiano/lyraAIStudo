import React from "react";
import { 
  Sparkles, 
  Clock, 
  Check, 
  LogIn,
  FileText,
  Image,
  Presentation,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Link2Off,
  Upload,
  Layers,
  Brain,
  Award
} from "lucide-react";

interface LandingPageProps {
  signInWithGoogle: () => Promise<void>;
  authLoading: boolean;
  authError?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ signInWithGoogle, authLoading, authError }) => {
  const isIframe = typeof window !== "undefined" && window.self !== window.top;

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#0f1117] flex flex-col font-sans antialiased">
      {/* Container Wrapper */}
      <div className="w-full max-w-[1300px] mx-auto bg-white min-h-screen shadow-md flex flex-col pb-16">
        
        {/* Navigation Bar */}
        <nav className="px-6 py-4.5 border-b border-black/[0.09] flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e0faf8] flex items-center justify-center shrink-0 border border-[#00C2B2]/30">
              <Sparkles className="w-5 h-5 text-[#00C2B2]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#1a4a45]">
                Lyra<span className="text-[#00C2B2] font-sans">.</span>
              </span>
              <p className="text-[10px] text-[#5a6478] font-sans tracking-wide leading-none">Afterschool STEM Copilot</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#5a6478]">
            <a href="#how" className="hover:text-[#0f1117] transition-all">How it works</a>
            <a href="#pricing" className="hover:text-[#0f1117] transition-all">Pricing</a>
            <a href="#launch" className="hover:text-[#0f1117] transition-all">Launch plan</a>
          </div>

          <div className="flex items-center gap-3">
            {authLoading ? (
              <div className="w-5 h-5 border-2 border-[#00C2B2] border-t-transparent rounded-full animate-spin" />
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-5 py-2.5 bg-[#1a4a45] hover:bg-opacity-95 text-white rounded-full text-xs font-bold transition-all shadow-3xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#00C2B2]" />
                <span>Get Early Access</span>
              </button>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <header className="px-6 sm:px-12 py-16 relative overflow-hidden bg-gradient-to-b from-[#e0faf8]/30 to-transparent border-b border-black/[0.04]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#00C2B2]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-2xl text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#e0faf8] text-[#1a4a45] rounded-full text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#00C2B2] animate-pulse" />
                <span>XPRIZE · Education &amp; Human Potential</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-5.5xl font-bold tracking-tight text-primary leading-tight">
                Your AI copilot for <span className="text-[#1a4a45] underline decoration-[#00C2B2]/40 underline-offset-4">STEM lesson prep</span>
              </h1>
              <p className="text-base text-[#5a6478] leading-relaxed font-sans font-normal max-w-xl">
                Lyra turns long, messy science articles and PDF textbooks into beautiful interactive slide decks, hands-on lab guides, printable worksheets, and broken media link backups instantly.
              </p>
              
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="px-7 py-4 bg-[#1a4a45] hover:bg-opacity-95 text-white rounded-full text-sm font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-[#00C2B2]" />
                  <span>Sign In with Google to Start</span>
                </button>

                {/* Friendly Iframe Sign-in Hint */}
                {isIframe && (
                  <p className="text-[11px] text-[#5a6478] max-w-lg leading-relaxed flex items-start gap-1.5 bg-amber-50/50 border border-amber-200/40 p-2.5 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 text-[#C97D10] shrink-0 mt-0.5" />
                    <span>
                      Viewing in the AI Studio preview pane? Google login popups can sometimes be blocked by iframe sandbox rules. If clicking doesn't open the login window, please click <strong>"Open App in New Tab"</strong> at the top right of the screen.
                    </span>
                  </p>
                )}

                {/* Authentication Error Block */}
                {authError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-left text-xs text-red-700 max-w-lg space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Google Sign-In Popup Interrupted</span>
                    </div>
                    <p className="text-[11px] text-red-600/90 leading-normal">
                      The popup was blocked by your browser, closed prematurely, or blocked by iframe security restrictions (e.g., <code>auth/cancelled-popup-request</code>).
                    </p>
                    <div className="bg-white/80 border border-red-100 p-2.5 rounded-lg text-[11px] text-red-800 space-y-1">
                      <span className="font-bold">How to resolve this:</span>
                      <ol className="list-decimal pl-4 space-y-0.5">
                        <li>Click the <strong>"Open App in New Tab"</strong> button in the top-right corner of AI Studio.</li>
                        <li>Log in seamlessly inside the new tab.</li>
                        <li>Enjoy using Lyra!</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mascot float wrap on the right */}
            <div className="shrink-0 bg-[#e0faf8]/40 border border-[#00C2B2]/10 rounded-3xl p-6 shadow-md animate-float">
              {/* Vector Robot Bunny Mascot SVG */}
              <svg viewBox="0 0 120 120" className="w-40 h-40 sm:w-48 sm:h-48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ears */}
                <g transform="translate(0, -4)">
                  {/* Left Ear */}
                  <rect x="36" y="8" width="14" height="42" rx="7" fill="#1a4a45" />
                  <rect x="40" y="14" width="6" height="30" rx="3" fill="#00C2B2" />
                  {/* Right Ear */}
                  <rect x="70" y="8" width="14" height="42" rx="7" fill="#1a4a45" />
                  <rect x="74" y="14" width="6" height="30" rx="3" fill="#00C2B2" />
                </g>
                {/* Head / Body */}
                <rect x="30" y="44" width="60" height="52" rx="20" fill="#1a4a45" stroke="#00C2B2" strokeWidth="2.5" />
                {/* Face Screen */}
                <rect x="38" y="52" width="44" height="28" rx="10" fill="#0f1117" stroke="#2ec4b8" strokeWidth="1" />
                {/* Glowing Eyes */}
                <circle cx="50" cy="66" r="4.5" fill="#00C2B2" className="animate-pulse" />
                <circle cx="70" cy="66" r="4.5" fill="#00C2B2" className="animate-pulse" />
                {/* Cheek blush */}
                <circle cx="43" cy="72" r="2" fill="#2ec4b8" opacity="0.6" />
                <circle cx="77" cy="72" r="2" fill="#2ec4b8" opacity="0.6" />
                {/* Little happy mouth */}
                <path d="M57 73 Q60 76 63 73" stroke="#00C2B2" strokeWidth="1.5" strokeLinecap="round" />
                {/* Antenna */}
                <line x1="60" y1="44" x2="60" y2="34" stroke="#1a4a45" strokeWidth="3" />
                <circle cx="60" cy="32" r="4.5" fill="#00C2B2" />
                {/* Collar & Badge */}
                <path d="M46 96 L60 92 L74 96 L60 101 Z" fill="#C97D10" />
                {/* Sparkle badge on top right */}
                <path d="M102 32 L104 38 L110 40 L104 42 L102 48 L100 42 L94 40 L100 38 Z" fill="#00C2B2" />
                {/* Little yellow star sparkle on left */}
                <path d="M16 64 L17 68 L21 69 L17 70 L16 74 L15 70 L11 69 L15 68 Z" fill="#C97D10" />
              </svg>
            </div>
          </div>

          {/* Interactive Mock Intake Controller */}
          <div onClick={signInWithGoogle} className="mt-12 bg-white border border-black/[0.12] rounded-2xl p-8 shadow-sm space-y-5 cursor-pointer hover:border-[#00C2B2]/60 transition-all">
            <div className="flex justify-between items-center border-b border-black/[0.06] pb-3">
              <span className="text-[10px] font-bold font-mono tracking-wider text-[#00C2B2] uppercase bg-[#e0faf8] px-2.5 py-0.5 rounded-md">
                1. Upload Curriculum Material (DEMO)
              </span>
              <span className="text-xs font-semibold text-[#5a6478] font-sans flex items-center gap-1">
                🔒 Sign In Required
              </span>
            </div>
            <div className="border-2 border-dashed border-black/[0.12] rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2.5 bg-surface-0/50">
              <Upload className="w-8 h-8 text-[#00C2B2]" />
              <p className="text-sm font-bold text-primary font-sans">
                Drag &amp; drop your lesson plan PDF or Docx here, or click to sign in and unlock
              </p>
              <p className="text-xs text-secondary">
                Transforms dry text into beautiful slideshows, tactile labs, and quizzes instantly
              </p>
            </div>
          </div>
        </header>

        {/* Section: Pain points */}
        <section className="px-6 sm:px-12 py-12 space-y-6">
          <div className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase font-sans">
            The problem Lyra solves
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#eef1f8] border border-black/[0.09] rounded-xl p-5 flex gap-4 items-start text-left">
              <Clock className="w-6 h-6 text-[#C97D10] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-primary mb-1">Hours of manual preparation</h4>
                <p className="text-xs text-[#5a6478] leading-relaxed">Teachers spend an average of 10-15 hours a week outside class converting textbook chapters into slides and worksheets.</p>
              </div>
            </div>
            <div className="bg-[#eef1f8] border border-black/[0.09] rounded-xl p-5 flex gap-4 items-start text-left">
              <Link2Off className="w-6 h-6 text-[#C97D10] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-primary mb-1">Broken media links &amp; references</h4>
                <p className="text-xs text-[#5a6478] leading-relaxed">Shared curriculum templates often contain dead URLs and outdated video links that disrupt classrooms.</p>
              </div>
            </div>
            <div className="bg-[#eef1f8] border border-black/[0.09] rounded-xl p-5 flex gap-4 items-start text-left">
              <Users className="w-6 h-6 text-[#C97D10] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-primary mb-1">Catering to neurodiverse learning</h4>
                <p className="text-xs text-[#5a6478] leading-relaxed">It's incredibly difficult to adapt a single standard lesson plan to dyslexic, ADHD, and tactile learners in the same class.</p>
              </div>
            </div>
            <div className="bg-[#eef1f8] border border-black/[0.09] rounded-xl p-5 flex gap-4 items-start text-left">
              <Briefcase className="w-6 h-6 text-[#C97D10] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-primary mb-1">Disorganized teacher notes</h4>
                <p className="text-xs text-[#5a6478] leading-relaxed">Facilitator scripts and lesson modifications are often stored across separate emails, drives, and printouts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Pipeline */}
        <section className="px-6 sm:px-12 py-12 space-y-6" id="how">
          <div className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase font-sans">
            How Lyra works — 5 AI agents, one learning package
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-stretch gap-6">
            <div className="flex-1 bg-white border border-black/[0.09] rounded-2xl p-5 flex flex-col justify-between items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#e0faf8] flex items-center justify-center text-[#1a4a45]"><FileText className="w-5 h-5" /></div>
              <h4 className="text-xs font-bold text-primary">1. Material Ingestion</h4>
              <p className="text-[11px] text-[#5a6478] leading-relaxed">Upload any textbook PDF, DOCX, or pasted lesson plan up to 50 pages long.</p>
            </div>
            <div className="flex-1 bg-white border border-black/[0.09] rounded-2xl p-5 flex flex-col justify-between items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
              <h4 className="text-xs font-bold text-primary">2. Invariant Extraction</h4>
              <p className="text-[11px] text-[#5a6478] leading-relaxed">Our AI extractors safely parse and outline key STEM concepts and learning goals.</p>
            </div>
            <div className="flex-1 bg-white border border-black/[0.09] rounded-2xl p-5 flex flex-col justify-between items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#C97D10]"><Image className="w-5 h-5" /></div>
              <h4 className="text-xs font-bold text-primary">3. Media Recommendation</h4>
              <p className="text-[11px] text-[#5a6478] leading-relaxed">Generates high-yield safe search queries for animated videos and live science demos.</p>
            </div>
            <div className="flex-1 bg-white border border-black/[0.09] rounded-2xl p-5 flex flex-col justify-between items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600"><Presentation className="w-5 h-5" /></div>
              <h4 className="text-xs font-bold text-primary">4. Layout Generation</h4>
              <p className="text-[11px] text-[#5a6478] leading-relaxed">Assembles beautifully structured slide decks, teaching scripts, and gamified quizzes.</p>
            </div>
            <div className="flex-1 bg-white border border-black/[0.09] rounded-2xl p-5 flex flex-col justify-between items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Brain className="w-5 h-5" /></div>
              <h4 className="text-xs font-bold text-primary">5. Student Adaptation</h4>
              <p className="text-[11px] text-[#5a6478] leading-relaxed">Applies dyslexia-friendly bionic formatting and phonetic aids to the outputs.</p>
            </div>
          </div>
        </section>

        {/* Section: Timeline */}
        <section className="px-6 sm:px-12 py-12 space-y-6" id="launch">
          <div className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase font-sans">
            Our 90-Day Product Roadmap
          </div>
          <div className="relative border-l border-black/[0.08] ml-4 pl-6 space-y-8 text-left">
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#00C2B2] border-2 border-white shadow-3xs" />
              <div className="inline-block text-[10px] font-bold px-2 py-0.5 bg-[#e0faf8] text-[#1a4a45] rounded-full mb-1">Days 1 - 30</div>
              <h4 className="text-xs font-bold text-primary">Core MVP Release</h4>
              <p className="text-xs text-[#5a6478] leading-relaxed max-w-xl">Finalize basic upload pipeline, clean prompt configuration interface, core slide-generation and real-time Text-To-Speech audio player. Setup Stripe payments.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#00C2B2] border-2 border-white shadow-3xs" />
              <div className="inline-block text-[10px] font-bold px-2 py-0.5 bg-[#e0faf8] text-[#1a4a45] rounded-full mb-1">Days 31 - 60</div>
              <h4 className="text-xs font-bold text-primary">Live Classroom Pilot</h4>
              <p className="text-xs text-[#5a6478] leading-relaxed max-w-xl">Invite 20+ afterschool instructors to run live trials. Establish initial paid cohort licenses. Integrate PDF exporting options directly from the web client.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#00C2B2] border-2 border-white shadow-3xs" />
              <div className="inline-block text-[10px] font-bold px-2 py-0.5 bg-[#e0faf8] text-[#1a4a45] rounded-full mb-1">Days 61 - 90</div>
              <h4 className="text-xs font-bold text-primary">Scaling and Admin Suite</h4>
              <p className="text-xs text-[#5a6478] leading-relaxed max-w-xl">Deliver organization-wide management dashboards, centralized shared curriculum folders, and automatic billing systems. Goal: 10+ paid cohorts and $2,000+ ARR.</p>
            </div>
          </div>
        </section>

        {/* Section: Pricing */}
        <section className="px-6 sm:px-12 py-12 space-y-6" id="pricing">
          <div className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase font-sans">
            Simple, Transparent Pricing
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-black/[0.08] bg-white rounded-2xl p-6 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#5a6478]">Instructor Demo</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-serif text-3.5xl font-bold text-primary">$0</span>
                  <span className="text-[10px] text-[#5a6478]">/ month</span>
                </div>
                <p className="text-[11px] text-[#5a6478] leading-relaxed">Try Lyra on your own and generate up to 3 full interactive lesson packages.</p>
              </div>
              <button onClick={signInWithGoogle} className="w-full py-2 bg-white border border-black/[0.1] hover:bg-surface-0 text-primary rounded-full text-[10px] font-bold transition-all shadow-3xs cursor-pointer">
                Try for Free
              </button>
            </div>

            <div className="border-2 border-[#00C2B2] bg-[#e0faf8]/10 rounded-2xl p-6 flex flex-col justify-between text-left space-y-4 relative transform scale-[1.02]">
              <span className="absolute top-0 right-4 -translate-y-1/2 bg-[#00C2B2] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Most Popular
              </span>
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1a4a45]">STEM Educator Pro</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-serif text-3.5xl font-bold text-primary">$29</span>
                  <span className="text-[10px] text-[#5a6478]">/ month</span>
                </div>
                <p className="text-[11px] text-[#5a6478] leading-relaxed">Perfect for active afterschool tutors, classroom teachers, and home educators.</p>
              </div>
              <button onClick={signInWithGoogle} className="w-full py-2 bg-[#1a4a45] text-white rounded-full text-[10px] font-bold transition-all shadow-3xs cursor-pointer">
                Subscribe Now
              </button>
            </div>

            <div className="border border-black/[0.08] bg-white rounded-2xl p-6 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#5a6478]">STEM Camp Director</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-serif text-3.5xl font-bold text-primary">$95</span>
                  <span className="text-[10px] text-[#5a6478]">/ month</span>
                </div>
                <p className="text-[11px] text-[#5a6478] leading-relaxed">For science camps, learning centers, and school administrators running multiple classrooms.</p>
              </div>
              <button onClick={signInWithGoogle} className="w-full py-2 bg-white border border-black/[0.1] hover:bg-surface-0 text-primary rounded-full text-[10px] font-bold transition-all shadow-3xs cursor-pointer">
                Upgrade Team
              </button>
            </div>
          </div>
        </section>

        {/* Section: Tech Stack */}
        <section className="px-6 sm:px-12 py-12 space-y-6">
          <div className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase font-sans">
            Modern, Secure Cloud Architecture
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#eef1f8] border border-black/[0.08] p-4 rounded-xl text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#00C2B2]">UI &amp; App</div>
              <div className="text-xs font-bold text-primary">React &amp; Vite</div>
            </div>
            <div className="bg-[#eef1f8] border border-black/[0.08] p-4 rounded-xl text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#00C2B2]">AI Core</div>
              <div className="text-xs font-bold text-primary">Gemini 3.5 Flash</div>
            </div>
            <div className="bg-[#eef1f8] border border-black/[0.08] p-4 rounded-xl text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#00C2B2]">Database</div>
              <div className="text-xs font-bold text-primary">Cloud Firestore</div>
            </div>
            <div className="bg-[#eef1f8] border border-black/[0.08] p-4 rounded-xl text-center space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#00C2B2]">Payments</div>
              <div className="text-xs font-bold text-primary">Stripe API</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-8 border-t border-black/[0.09] flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div>
            <div className="font-serif text-lg font-bold text-teal-dark">Lyra.</div>
            <div className="text-[10px] text-[#9CA3AF] font-sans">© 2026 Lyra Educational Copilot · XPRIZE STEM Platform</div>
          </div>
          <div className="text-[9px] font-bold uppercase bg-[#e0faf8] text-[#1a4a45] rounded-full px-3 py-1.5 border border-[#00C2B2]/20">
            Education &amp; Human Potential
          </div>
        </footer>

      </div>
    </div>
  );
};
