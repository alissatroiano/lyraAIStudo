import React, { useState } from "react";
import {
  Sparkles,
  Clock,
  LogIn,
  FileText,
  Image,
  Presentation,
  CheckCircle2,
  Users,
  AlertCircle,
  Link2Off,
  Brain,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { useNocturneTheme } from "../hooks/useNocturneTheme";
import { ThemeToggle } from "./ThemeToggle";

interface LandingPageProps {
  signInWithGoogle: () => Promise<void>;
  authLoading: boolean;
  authError?: string | null;
}

const PROBLEMS = [
  { icon: Clock, title: "Hours of manual preparation", body: "Teachers spend an average of 10-15 hours a week outside class converting textbook chapters into slides and worksheets." },
  { icon: Link2Off, title: "Broken media links & references", body: "Shared curriculum templates often contain dead URLs and outdated video links that disrupt classrooms." },
  { icon: Users, title: "Catering to neurodiverse learning", body: "It's incredibly difficult to adapt a single standard lesson plan to dyslexic, ADHD, and tactile learners in the same class." },
  { icon: Briefcase, title: "Disorganized teacher notes", body: "Facilitator scripts and lesson modifications are often stored across separate emails, drives, and printouts." }
];

const STEPS = [
  { n: 1, icon: FileText, title: "Material Ingestion", body: "Upload any textbook PDF, DOCX, or pasted lesson plan up to 50 pages long." },
  { n: 2, icon: CheckCircle2, title: "Invariant Extraction", body: "Our AI extractors safely parse and outline key STEM concepts and learning goals." },
  { n: 3, icon: Image, title: "Media Recommendation", body: "Generates high-yield safe search queries for animated videos and live science demos." },
  { n: 4, icon: Presentation, title: "Layout Generation", body: "Assembles beautifully structured slide decks, teaching scripts, and gamified quizzes." },
  { n: 5, icon: Brain, title: "Student Adaptation", body: "Applies dyslexia-friendly bionic formatting and phonetic aids to the outputs." }
];

export const LandingPage: React.FC<LandingPageProps> = ({ signInWithGoogle, authLoading, authError }) => {
  const isIframe = typeof window !== "undefined" && window.self !== window.top;
  const [localLoading, setLocalLoading] = useState(false);
  const { theme, toggleTheme } = useNocturneTheme();

  const handleSignIn = async () => {
    if (localLoading || authLoading) return;
    try {
      setLocalLoading(true);
      await signInWithGoogle();
    } catch (e) {
      console.error("Local sign-in wrapper failed:", e);
    } finally {
      setLocalLoading(false);
    }
  };

  const isBusy = localLoading || authLoading;

  return (
    <div data-theme={theme} className="min-h-screen bg-noct-bg text-noct-text font-nocturne antialiased">
      <div className="w-full max-w-[1240px] mx-auto flex flex-col">

        {/* Navigation Bar */}
        <nav className="px-2 py-5 border-b border-noct-border/40 flex items-center gap-6 sticky top-0 bg-noct-bg/95 backdrop-blur-md z-50">
          <div className="flex items-center gap-2.5 mr-auto">
            <img
              src="/lyra.png"
              alt="Snori Learning Logo"
              className="h-[30px] w-auto object-contain rounded-md"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith("/lyra.png")) {
                  target.src = "/logo.png";
                }
              }}
            />
            <span className="text-[11px] text-noct-text/50 border-l border-noct-border/60 pl-2.5">Afterschool STEM Copilot</span>
          </div>
          <a href="#how" className="hidden md:inline text-sm text-noct-text hover:text-noct-accent-light transition-colors">How it works</a>
          <a href="#pricing" className="hidden md:inline text-sm text-noct-text hover:text-noct-accent-light transition-colors">Pricing</a>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button
            type="button"
            onClick={handleSignIn}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap font-medium text-sm text-noct-accent bg-transparent border border-noct-accent px-3.5 py-2 rounded-lg cursor-pointer hover:bg-noct-accent/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isBusy ? (
              <div className="w-3.5 h-3.5 border-2 border-noct-accent border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <LogIn className="w-[15px] h-[15px]" />
            )}
            <span>Get Early Access</span>
          </button>
        </nav>

        {/* Hero */}
        <header className="px-2 pt-20 pb-16 flex items-center justify-between gap-14 flex-wrap">
          <div className="max-w-[600px]">
            <span className="inline-flex items-center gap-1.5 border border-noct-accent text-noct-accent text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md mb-6">
              <Sparkles className="w-3 h-3" /> XPRIZE · Education &amp; Human Potential
            </span>
            <h1 className="font-medium text-4xl sm:text-5xl leading-[1.1] tracking-tight mb-6">
              Your AI copilot for{" "}
              <span className="text-noct-accent-light underline decoration-noct-accent/50 underline-offset-[6px]">
                STEM lesson prep
              </span>
            </h1>
            <p className="text-base text-noct-text/65 leading-relaxed max-w-[520px] mb-8">
              Snori turns long, messy science articles and PDF textbooks into interactive slide decks, hands-on lab guides, printable worksheets, and gamified video briefs — instantly.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isBusy}
                className="inline-flex items-center gap-2 whitespace-nowrap font-medium text-sm text-noct-accent bg-transparent border border-noct-accent px-[22px] py-3.5 rounded-lg cursor-pointer hover:bg-noct-accent/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed select-none"
              >
                {isBusy ? (
                  <div className="w-4 h-4 border-2 border-noct-accent border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>{isBusy ? "Signing In with Google..." : "Sign In with Google to Start"}</span>
              </button>

              {isIframe && (
                <p className="text-[11px] text-noct-text/60 max-w-lg leading-relaxed flex items-start gap-1.5 bg-noct-surface border border-noct-border/60 p-2.5 rounded-xl">
                  <AlertCircle className="w-3.5 h-3.5 text-noct-accent-light shrink-0 mt-0.5" />
                  <span>
                    Viewing in the AI Studio preview pane? Google login popups can sometimes be blocked by iframe sandbox rules. If clicking doesn't open the login window, please click <strong>"Open App in New Tab"</strong> at the top right of the screen.
                  </span>
                </p>
              )}

              {authError && (
                <div className={`p-4 bg-noct-surface border border-red-500/30 rounded-xl text-left text-xs max-w-lg space-y-2 ${theme === "dark" ? "text-red-300" : "text-red-700"}`}>
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className={`w-4 h-4 shrink-0 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                    <span>Google Sign-In Popup Interrupted</span>
                  </div>
                  <p className={`text-[11px] leading-normal ${theme === "dark" ? "text-red-300/80" : "text-red-700/80"}`}>
                    The popup was blocked by your browser, closed prematurely, or blocked by iframe security restrictions (e.g., <code>auth/cancelled-popup-request</code>).
                  </p>
                  <div className="bg-noct-bg-deep border border-noct-border/60 p-2.5 rounded-lg text-[11px] text-noct-text/90 space-y-1">
                    <span className="font-bold">How to resolve this:</span>
                    <ol className="list-decimal pl-4 space-y-0.5">
                      <li>Click the <strong>"Open App in New Tab"</strong> button in the top-right corner of AI Studio.</li>
                      <li>Log in seamlessly inside the new tab.</li>
                      <li>Enjoy using Snori!</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="shrink-0 w-[280px] h-[280px] rounded-2xl flex items-center justify-center"
            style={{
              background: theme === "dark"
                ? "radial-gradient(circle at 50% 45%, rgba(145,132,217,0.16), transparent 70%)"
                : "radial-gradient(circle at 50% 45%, rgba(0,194,178,0.12), transparent 70%)",
              boxShadow: theme === "dark" ? "0 0 0 1px #3f424d" : "0 0 0 1px rgba(15,17,23,0.09)"
            }}
          >
            <img
              src="/lyra.png"
              alt="Snori mark"
              className="w-[200px] h-[200px] object-contain"
              style={theme === "dark" ? { mixBlendMode: "lighten" } : undefined}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith("/lyra.png")) {
                  target.src = "/logo.png";
                }
              }}
            />
          </div>
        </header>

        {/* Problem section */}
        <section className="px-2 py-12">
          <h6 className="text-[13px] font-semibold tracking-wider text-noct-text/50 uppercase mb-6">The problem Snori solves</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="bg-noct-surface rounded-lg p-5 flex gap-4 items-start">
                <p.icon className="w-[22px] h-[22px] text-noct-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium mb-1">{p.title}</h4>
                  <p className="text-[13px] text-noct-text/60 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="px-2 pt-6 pb-12">
          <h6 className="text-[13px] font-semibold tracking-wider text-noct-text/50 uppercase mb-6">How Snori works — 5 AI agents, one learning package</h6>
          <div className="flex gap-4 flex-wrap">
            {STEPS.map((st) => (
              <div
                key={st.n}
                className="flex-1 min-w-[170px] bg-noct-surface rounded-2xl p-5 flex flex-col items-start gap-3"
                style={{ boxShadow: "0 0 0 1px #3f424d" }}
              >
                <div className="w-9 h-9 rounded-lg bg-noct-accent-ghost flex items-center justify-center text-noct-accent-light">
                  <st.icon className="w-[17px] h-[17px]" />
                </div>
                <h4 className="text-[13px] font-medium">{st.n}. {st.title}</h4>
                <p className="text-xs text-noct-text/60 leading-relaxed">{st.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-2 pt-6 pb-12">
          <h6 className="text-[13px] font-semibold tracking-wider text-noct-text/50 uppercase mb-6">Simple, Transparent Pricing</h6>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-noct-border bg-noct-surface rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-noct-text/60">Instructor Demo</span>
                <div className="flex items-baseline gap-0.5 my-2">
                  <span className="text-3xl font-medium">$0</span>
                  <span className="text-[11px] text-noct-text/50">/ month</span>
                </div>
                <p className="text-xs text-noct-text/60 leading-relaxed">Try Snori on your own and generate up to 3 full interactive lesson packages.</p>
              </div>
              <button onClick={handleSignIn} className="w-full py-2.5 bg-transparent border border-noct-border text-noct-text rounded-lg text-xs font-medium cursor-pointer hover:bg-white/5 transition-colors">
                Try for Free
              </button>
            </div>

            <div className="border border-noct-accent bg-noct-surface rounded-2xl p-6 flex flex-col justify-between gap-4 relative">
              <span className="absolute top-0 right-4 -translate-y-1/2 bg-noct-accent text-noct-bg text-[9px] font-semibold uppercase tracking-wider px-2.5 py-[3px] rounded-full">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-medium text-noct-accent-light">STEM Educator Pro</span>
                <div className="flex items-baseline gap-0.5 my-2">
                  <span className="text-3xl font-medium">$19.99</span>
                  <span className="text-[11px] text-noct-text/50">/ month</span>
                </div>
                <p className="text-xs text-noct-text/60 leading-relaxed">Perfect for active afterschool tutors, classroom teachers, and home educators.</p>
              </div>
              <button onClick={handleSignIn} className="w-full py-2.5 bg-transparent border border-noct-accent text-noct-accent rounded-lg text-xs font-medium cursor-pointer hover:bg-noct-accent/10 transition-colors">
                Subscribe Now
              </button>
            </div>

            <div className="border border-noct-border bg-noct-surface rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-noct-text/60">STEM Camp Director</span>
                <div className="flex items-baseline gap-0.5 my-2">
                  <span className="text-3xl font-medium">$49.99</span>
                  <span className="text-[11px] text-noct-text/50">/ month</span>
                </div>
                <p className="text-xs text-noct-text/60 leading-relaxed">For science camps, learning centers, and school administrators running multiple classrooms.</p>
              </div>
              <button onClick={handleSignIn} className="w-full py-2.5 bg-transparent border border-noct-border text-noct-text rounded-lg text-xs font-medium cursor-pointer hover:bg-white/5 transition-colors">
                Upgrade Team
              </button>
            </div>
          </div>
        </section>

        {/* Tech stack - fixed accent gradient, stays constant across both themes */}
        <section
          className="mx-2 my-2 rounded-2xl p-10 text-white"
          style={{
            background: "linear-gradient(135deg, #262a60, #353b80)",
            boxShadow: "0 0 0 1px #4c5397"
          }}
        >
          <h6 className="text-xs font-semibold tracking-widest text-white/65 uppercase mb-5">Modern, Secure Cloud Architecture</h6>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-200 mb-1">UI &amp; App</div>
              <div className="text-sm font-medium">React &amp; Vite</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-200 mb-1">AI Core</div>
              <div className="text-sm font-medium">Gemini 3.5 Flash</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-200 mb-1">Database</div>
              <div className="text-sm font-medium">Cloud Firestore</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-200 mb-1">Payments</div>
              <div className="text-sm font-medium">Stripe API</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-2 py-10 flex items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/lyra.png"
              alt="Snori"
              className="h-5 w-auto"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith("/lyra.png")) {
                  target.src = "/logo.png";
                }
              }}
            />
            <span className="text-[11px] text-noct-text/40">© 2026 Snori Educational Copilot · XPRIZE STEM Platform</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wide border border-noct-accent text-noct-accent rounded-full px-3 py-1.5">
            Education &amp; Human Potential
          </div>
        </footer>
      </div>
    </div>
  );
};
