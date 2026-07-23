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
  Square
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

        {/* RIGHT COLUMN: Step-By-Step Experiment & Scientific Catalyst */}
        <div className="lg:col-span-7 space-y-6">
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
    </div>
  );
}
