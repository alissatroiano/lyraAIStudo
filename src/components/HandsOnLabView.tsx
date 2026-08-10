import React, { useState } from "react";
import { 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Box, 
  Flame,
  Lightbulb,
  CheckSquare,
  Square,
  Maximize2,
  X,
  Code,
  Copy,
  Layers
} from "lucide-react";
import { HandsOnActivity } from "../types";

interface HandsOnLabViewProps {
  activity: HandsOnActivity;
  lessonTitle: string;
  checkedMaterials: Record<string, boolean>;
  onToggleMaterial: (material: string) => void;
  onResetMaterials?: () => void;
  dyslexiaMode?: boolean;
  bionicReading?: boolean;
  formatBionicText?: (text: string) => React.ReactNode;
  speakText?: (text: string) => void;
  stopSpeaking?: () => void;
  isSpeaking?: boolean;
}

const generateDefaultSvgForActivity = (title: string, materials: string[] = []): string => {
  const cleanTitle = (title || "STEM Hands-On Experiment").toUpperCase();
  const mat1 = materials[0] || "Component A";
  const mat2 = materials[1] || "Component B";
  const mat3 = materials[2] || "Component C";

  if (cleanTitle.includes("BRIDGE") || cleanTitle.includes("TRUSS") || cleanTitle.includes("STRUCTURE")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#0f172a; border-radius:16px;">
      <defs>
        <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
        <pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>
      </defs>
      <rect width="700" height="420" fill="url(#bgG)" rx="16"/>
      <rect width="700" height="420" fill="url(#gr)" rx="16"/>
      <rect x="25" y="20" width="260" height="28" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
      <text x="35" y="38" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">FINISHED ASSEMBLY BLUEPRINT</text>
      <text x="25" y="72" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="800">${cleanTitle.slice(0, 36)}</text>
      <text x="25" y="92" fill="#94a3b8" font-family="sans-serif" font-size="12">Structural Truss Load Distribution Diagram</text>
      <rect x="60" y="250" width="80" height="110" fill="#334155" stroke="#64748b" stroke-width="2"/>
      <rect x="560" y="250" width="80" height="110" fill="#334155" stroke="#64748b" stroke-width="2"/>
      <rect x="120" y="250" width="460" height="20" fill="#0ea5e9" stroke="#bae6fd" stroke-width="2"/>
      <path d="M 140 250 L 230 170 L 320 250 L 410 170 L 500 250 L 560 250" stroke="#f59e0b" stroke-width="4" fill="none"/>
      <line x1="140" y1="250" x2="560" y2="250" stroke="#f59e0b" stroke-width="4"/>
      <line x1="230" y1="170" x2="410" y2="170" stroke="#f59e0b" stroke-width="4"/>
      <line x1="230" y1="170" x2="230" y2="250" stroke="#38bdf8" stroke-width="2"/>
      <line x1="320" y1="170" x2="320" y2="250" stroke="#38bdf8" stroke-width="2"/>
      <line x1="410" y1="170" x2="410" y2="250" stroke="#38bdf8" stroke-width="2"/>
      <path d="M 350 90 L 350 160" stroke="#ef4444" stroke-width="6"/>
      <polygon points="350,165 340,145 360,145" fill="#ef4444"/>
      <text x="350" y="80" fill="#ef4444" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">DOWNWARD LOAD FORCE</text>
      <text x="230" y="150" fill="#f59e0b" font-family="sans-serif" font-size="10" font-weight="bold">COMPRESSION (Orange)</text>
      <text x="350" y="280" fill="#38bdf8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">TENSION DECK (Blue)</text>
    </svg>`;
  }

  if (cleanTitle.includes("MAGNET") || cleanTitle.includes("ELECTRO") || cleanTitle.includes("CIRCUIT") || cleanTitle.includes("SOLENOID")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#0f172a; border-radius:16px;">
      <defs>
        <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
        <pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>
      </defs>
      <rect width="700" height="420" fill="url(#bgG)" rx="16"/>
      <rect width="700" height="420" fill="url(#gr)" rx="16"/>
      <rect x="25" y="20" width="260" height="28" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
      <text x="35" y="38" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">FINISHED ASSEMBLY BLUEPRINT</text>
      <text x="25" y="72" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="800">${cleanTitle.slice(0, 36)}</text>
      <text x="25" y="92" fill="#94a3b8" font-family="sans-serif" font-size="12">Temporary Electromagnetic Solenoid Coil Setup</text>
      <rect x="80" y="160" width="100" height="150" rx="10" fill="#334155" stroke="#ca8a04" stroke-width="3"/>
      <rect x="110" y="145" width="40" height="15" rx="3" fill="#f59e0b"/>
      <text x="130" y="235" fill="#fef08a" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">1.5V D-CELL</text>
      <text x="130" y="178" fill="#4ade80" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">+</text>
      <text x="130" y="295" fill="#f87171" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">-</text>
      <rect x="320" y="220" width="260" height="20" rx="4" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>
      <polygon points="580,220 610,230 580,240" fill="#64748b"/>
      <circle cx="310" cy="230" r="14" fill="#64748b"/>
      <path d="M 350 215 Q 360 200 370 215 T 390 215 T 410 215 T 430 215 T 450 215 T 470 215 T 490 215 T 510 215 T 530 215" stroke="#f97316" stroke-width="6" fill="none"/>
      <path d="M 130 145 L 130 100 L 350 100 L 350 215" stroke="#ef4444" stroke-width="3" fill="none"/>
      <path d="M 130 310 L 130 360 L 530 360 L 530 245" stroke="#3b82f6" stroke-width="3" fill="none"/>
      <ellipse cx="440" cy="230" rx="160" ry="80" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4" fill="none" opacity="0.6"/>
      <ellipse cx="440" cy="230" rx="190" ry="110" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4" fill="none" opacity="0.3"/>
      <path d="M 600 240 Q 610 260 600 280 Q 590 300 600 320" stroke="#facc15" stroke-width="3" fill="none"/>
      <text x="440" y="130" fill="#38bdf8" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Magnetic Flux Lines B-Field</text>
      <text x="580" y="340" fill="#facc15" font-family="sans-serif" font-size="11" font-weight="bold">Attracted Metal Clips</text>
    </svg>`;
  }

  // General STEM Blueprint Setup
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 420" width="100%" height="100%" style="background:#0f172a; border-radius:16px;">
    <defs>
      <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
      <pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern>
    </defs>
    <rect width="700" height="420" fill="url(#bgG)" rx="16"/>
    <rect width="700" height="420" fill="url(#gr)" rx="16"/>
    <rect x="25" y="20" width="260" height="28" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
    <text x="35" y="38" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">FINISHED ASSEMBLY BLUEPRINT</text>
    <text x="25" y="72" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="800">${cleanTitle.slice(0, 36)}</text>
    <text x="25" y="92" fill="#94a3b8" font-family="sans-serif" font-size="12">Lab Station Prototype & Finished Apparatus Setup</text>
    <rect x="50" y="320" width="600" height="12" rx="4" fill="#334155" stroke="#475569" stroke-width="1.5"/>
    <path d="M 300 320 L 250 200 L 280 140 L 420 140 L 450 200 L 400 320 Z" fill="#0284c7" opacity="0.3" stroke="#38bdf8" stroke-width="2"/>
    <path d="M 280 320 L 260 230 Q 350 210 440 230 L 420 320 Z" fill="#38bdf8" opacity="0.5"/>
    <circle cx="330" cy="260" r="8" fill="#bae6fd"/>
    <circle cx="370" cy="240" r="12" fill="#bae6fd"/>
    <circle cx="350" cy="200" r="10" fill="#38bdf8"/>
    <path d="M 350 140 L 350 80 L 520 80 L 520 220" stroke="#f59e0b" stroke-width="4" fill="none"/>
    <rect x="470" y="220" width="100" height="80" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
    <text x="520" y="265" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">MEASUREMENT</text>
    <rect x="70" y="150" width="140" height="30" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
    <text x="140" y="169" fill="#38bdf8" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">${mat1.slice(0, 18)}</text>
    <line x1="210" y1="165" x2="270" y2="200" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
    <rect x="70" y="220" width="140" height="30" rx="6" fill="#1e293b" stroke="#4ade80" stroke-width="1"/>
    <text x="140" y="239" fill="#4ade80" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">${mat2.slice(0, 18)}</text>
    <line x1="210" y1="235" x2="310" y2="280" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="3,3"/>
  </svg>`;
};

interface HandsOnLabViewProps {
  activity: HandsOnActivity;
  lessonTitle: string;
  checkedMaterials: Record<string, boolean>;
  onToggleMaterial: (material: string) => void;
  onResetMaterials?: () => void;
  dyslexiaMode?: boolean;
  bionicReading?: boolean;
  formatBionicText?: (text: string) => React.ReactNode;
  speakText?: (text: string) => void;
  stopSpeaking?: () => void;
  isSpeaking?: boolean;
}

export default function HandsOnLabView({
  activity,
  lessonTitle,
  checkedMaterials,
  onToggleMaterial,
  onResetMaterials,
  dyslexiaMode = false,
  bionicReading = false,
  formatBionicText,
  speakText,
  stopSpeaking,
  isSpeaking = false
}: HandsOnLabViewProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isSvgModalOpen, setIsSvgModalOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const materials = activity?.materials && activity.materials.length > 0
    ? activity.materials
    : [
        "12-inch latex balloons (high stretch)",
        "15-foot nylon fishing line (the track)",
        "Standard plastic drinking straw",
        "Cellulose tape (Scotch tape)",
        "Metal binder clips or clothespins",
        "Measuring tape or ruler"
      ];

  const steps = activity?.steps && activity.steps.length > 0
    ? activity.steps
    : [
        "Secure one end of the nylon fishing line to a heavy chair or door handle.",
        "Thread the plastic straw onto the line, then pull the line tight and tie the other end across the room.",
        "Blow up your balloon completely, but DO NOT tie it. Clamp the nozzle shut with a binder clip.",
        "Tape the inflated balloon securely to the straw using 3 pieces of tape, making sure the balloon points straight.",
        "Slide the straw-balloon assembly back to the starting line.",
        "Unclamp the binder clip and watch your rocket fly! Measure and record the distance traveled."
      ];

  const scientificPrinciple = activity?.scientificPrinciple || 
    "When you release the clip, the stretched latex squeezes the air out of the nozzle (Action). The escaping air pushes forward against the inside of the balloon, launching the balloon-straw car along the fishing line in the opposite direction (Reaction)!";

  const labTitle = activity?.title || `${lessonTitle} - Hands-On Experiment`;

  const rawSvg = activity?.finishedProductSvg;
  const renderedSvgString = (rawSvg && typeof rawSvg === "string" && rawSvg.trim().startsWith("<svg"))
    ? rawSvg.trim()
    : generateDefaultSvgForActivity(labTitle, materials);

  const totalMaterials = materials.length;
  const checkedCount = materials.filter(m => checkedMaterials[m]).length;
  const isAllChecked = totalMaterials > 0 && checkedCount === totalMaterials;

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const speakAllSteps = () => {
    if (!speakText) return;
    if (isSpeaking && stopSpeaking) {
      stopSpeaking();
      return;
    }
    const fullSpeech = `Hands-on Lab: ${labTitle}. Materials needed: ${materials.join(", ")}. Step by step experiment: ${steps.join(". ")}. Scientific principle: ${scientificPrinciple}`;
    speakText(fullSpeech);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Banner Control Bar */}
      <div className="bg-surface-0 border border-black/[0.06] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-dark text-teal-brand flex items-center justify-center shrink-0 shadow-2xs">
            <Flame className="w-5 h-5 text-teal-brand" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-dark flex items-center gap-2">
              <span>Interactive Hands-On Lab</span>
              <span className="text-[10px] bg-teal-brand/10 border border-teal-brand/20 text-teal-dark font-bold px-2 py-0.5 rounded-full uppercase">
                Building & Experiment
              </span>
            </h3>
            <p className="text-xs text-secondary font-medium">
              Bin checklists & student-led experiment procedures
            </p>
          </div>
        </div>

        {speakText && (
          <button
            type="button"
            onClick={speakAllSteps}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isSpeaking
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-teal-dark text-white hover:bg-teal-950 shadow-2xs"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-brand" />}
            <span>{isSpeaking ? "Stop Audio" : "Read Lab Out Loud"}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Left Column (Pre-Class Logistics) & Right Column (Step-by-Step Experiment) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Pre-Class Logistics & Materials Bin Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
                PRE-CLASS LOGISTICS
              </span>
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-extrabold text-teal-dark flex items-center gap-2">
                  <span>Lab Bin Materials</span>
                </h3>
                <span className="text-[11px] font-bold text-teal-brand bg-teal-brand/10 px-2.5 py-1 rounded-full border border-teal-brand/20">
                  {checkedCount}/{totalMaterials} Ready
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-black/[0.04]">
              <div 
                className="bg-teal-brand h-full transition-all duration-300 rounded-full"
                style={{ width: `${totalMaterials > 0 ? (checkedCount / totalMaterials) * 100 : 0}%` }}
              />
            </div>

            {/* Checkbox Items */}
            <div className="space-y-2 pt-1">
              {materials.map((mat, index) => {
                const isChecked = !!checkedMaterials[mat];
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onToggleMaterial(mat)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      isChecked
                        ? "bg-teal-brand/5 border-teal-brand/30 text-teal-dark shadow-2xs"
                        : "bg-white border-black/[0.06] text-secondary hover:border-teal-brand/30 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isChecked
                        ? "bg-teal-brand text-white border border-teal-brand shadow-2xs"
                        : "border-2 border-slate-300 bg-white"
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-xs sm:text-sm leading-snug font-medium ${
                      isChecked ? "line-through text-slate-500 font-normal" : "text-slate-800"
                    } ${dyslexiaMode ? "dyslexia-mode-styles" : ""}`}>
                      {bionicReading && formatBionicText ? formatBionicText(mat) : mat}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Informational Callout Box */}
            <div className="bg-teal-brand/10 border border-teal-brand/20 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-brand text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs text-teal-950 font-medium leading-relaxed">
                <strong>Check bins off</strong> to streamline pre-class preparation. Designed for simple classroom storage management.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Finished Product SVG, Step-By-Step Experiment & Scientific Catalyst */}
        <div className="lg:col-span-7 space-y-6">
          {/* FINISHED PRODUCT VECTOR BLUEPRINT CARD */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white font-sans">
                      Finished Product Vector Blueprint
                    </h4>
                    <span className="text-[9px] bg-sky-500/20 text-sky-300 font-mono font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
                      Lyra AI Vector SVG
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Assembly illustration for instructors &amp; students
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{showCode ? "Hide Markup" : "View Code"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSvgModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </button>
              </div>
            </div>

            {/* SVG Visual Canvas */}
            <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2 sm:p-4 shadow-inner flex items-center justify-center">
              <div 
                className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: renderedSvgString }}
              />
            </div>

            {/* Optional SVG Code Drawer */}
            {showCode && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono text-sky-300 overflow-x-auto space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-[10px]">
                  <span>Source Vector SVG Code:</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(renderedSvgString);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-sky-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? "Copied!" : "Copy SVG"}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap break-all max-h-40 overflow-y-auto p-2 bg-slate-900/90 rounded-xl text-[10px] text-slate-300 leading-relaxed font-mono">
                  {renderedSvgString}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
                  STEP-BY-STEP EXPERIMENT
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-teal-dark leading-tight">
                  {labTitle}
                </h3>
              </div>
              <span className="bg-teal-dark text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono shrink-0">
                STUDENT LED
              </span>
            </div>

            {/* Numbered Steps List */}
            <div className="space-y-3">
              {steps.map((stepText, sIdx) => {
                const isDone = !!completedSteps[sIdx];
                return (
                  <div
                    key={sIdx}
                    onClick={() => toggleStep(sIdx)}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                      isDone
                        ? "bg-teal-brand/5 border-teal-brand/20 text-slate-500"
                        : "bg-white border-black/[0.05] hover:border-teal-brand/30 shadow-2xs"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center shrink-0 text-xs transition-all ${
                      isDone
                        ? "bg-teal-brand text-white shadow-2xs"
                        : "bg-slate-100 text-slate-700 border border-black/[0.05]"
                    }`}>
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : sIdx + 1}
                    </div>
                    <div className="space-y-1 pt-0.5 flex-1">
                      <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                        isDone ? "line-through text-slate-400" : "text-slate-800"
                      } ${dyslexiaMode ? "dyslexia-mode-styles" : ""}`}>
                        {bionicReading && formatBionicText ? formatBionicText(stepText) : stepText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scientific Catalyst / Core Principle Banner */}
          <div className="bg-teal-dark text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-teal-brand/30 relative overflow-hidden space-y-3">
            <div className="relative z-10 flex items-center gap-2 text-teal-brand">
              <Sparkles className="w-5 h-5 text-teal-brand animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
                THE SCIENTIFIC CATALYST BEHIND THE LAB
              </span>
            </div>

            <p className={`relative z-10 text-xs sm:text-sm text-teal-light leading-relaxed font-medium ${
              dyslexiaMode ? "dyslexia-mode-styles text-white" : ""
            }`}>
              {bionicReading && formatBionicText ? formatBionicText(scientificPrinciple) : scientificPrinciple}
            </p>

            {/* Subtle background glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-brand/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>

      </div>

      {/* FULLSCREEN VECTOR BLUEPRINT MODAL FOR SMARTBOARD PROJECTION */}
      {isSvgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {labTitle} — Finished Assembly Vector Blueprint
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Smartboard Projection View for Students
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSvgModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-950">
              <div 
                className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: renderedSvgString }}
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-sans shrink-0">
              <span>Vector SVG auto-generated by Lyra AI Studio</span>
              <button
                type="button"
                onClick={() => setIsSvgModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-sans transition-all cursor-pointer"
              >
                Close Projection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
