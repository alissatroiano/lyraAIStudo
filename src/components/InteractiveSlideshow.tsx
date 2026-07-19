import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  HelpCircle, 
  Play, 
  Pause,
  Award,
  Layers,
  Presentation,
  Volume2,
  VolumeX
} from "lucide-react";
import { Slide } from "../types";

interface InteractiveSlideshowProps {
  slides: Slide[];
  dyslexiaMode: boolean;
  antiGlare: "none" | "cream" | "mint" | "peach";
  readingRuler: boolean;
  bionicReading: boolean;
  ttsSpeed: number;
  speakText: (text: string, speed?: number) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  formatBionicText: (text: string) => React.ReactNode;
}

export default function InteractiveSlideshow({ 
  slides,
  dyslexiaMode,
  antiGlare,
  readingRuler,
  bionicReading,
  ttsSpeed,
  speakText,
  stopSpeaking,
  isSpeaking,
  formatBionicText
}: InteractiveSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [slideTimer, setSlideTimer] = useState<NodeJS.Timeout | null>(null);
  
  const rulerRef = React.useRef<HTMLDivElement>(null);
  const [rulerTop, setRulerTop] = useState(120);

  if (!slides || slides.length === 0) {
    return (
      <div className="bg-surface-0 border border-black/[0.06] rounded-2xl p-8 text-center text-secondary font-sans">
        <p>No interactive slides available for this lesson.</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (slideTimer) {
        clearInterval(slideTimer);
        setSlideTimer(null);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const timer = setInterval(() => {
        handleNext();
      }, 7000);
      setSlideTimer(timer);
    }
  };

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (slideTimer) clearInterval(slideTimer);
    };
  }, [slideTimer]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!readingRuler || !rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const clampedY = Math.max(10, Math.min(rect.height - 10, relativeY));
    setRulerTop(clampedY);
  };

  const isLightBackground = antiGlare !== "none";
  
  const themeStyles = {
    container: isLightBackground
      ? antiGlare === "cream"
        ? "bg-[#FAF3E3] border-[#E8DCC4] text-[#433422]"
        : antiGlare === "mint"
          ? "bg-[#E6F4F1] border-[#C8E4DD] text-[#133835]"
          : "bg-[#FAF0E6] border-[#E6D5C3] text-[#4A2E1B]"
      : "bg-gradient-to-br from-slate-900 via-teal-dark to-slate-950 text-white border-slate-800",
    
    title: isLightBackground ? "text-teal-950" : "text-white",
    pointText: isLightBackground ? "text-slate-900 font-medium" : "text-slate-100",
    bulletNum: isLightBackground
      ? "bg-teal-dark text-white border-teal-900/10"
      : "bg-teal-brand/20 text-teal-brand border-teal-brand/30",
    caption: isLightBackground ? "text-[#5a4c3a]" : "text-slate-400",
    border: isLightBackground ? "border-black/5" : "border-white/10",
  };

  return (
    <div className="space-y-6" id="interactive-slides-container">
      {/* Upper header controls */}
      <div className="bg-surface-0 border border-black/[0.05] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center text-teal-brand border border-teal-brand/10 shrink-0">
            <Presentation className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 text-left">
            <h4 className="text-sm font-bold text-teal-dark font-sans flex items-center gap-1.5">
              <span>Smartboard Interactive Presentation</span>
              <span className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                Dyslexia Friendly
              </span>
            </h4>
            <p className="text-xs text-secondary font-sans leading-none">
              Slide {currentIndex + 1} of {slides.length} — Interactive whiteboard companion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => speakText(`Slide ${currentIndex + 1}: ${currentSlide.title}. ` + currentSlide.content.join(" "), ttsSpeed)}
            className={`p-2 rounded-lg text-xs font-bold font-sans transition-all flex items-center justify-center border cursor-pointer ${
              isSpeaking
                ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                : "bg-white border-black/[0.08] text-teal-brand hover:bg-surface-0"
            }`}
            title={isSpeaking ? "Stop speech" : "Read entire slide aloud"}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-1.5 border cursor-pointer ${
              showNotes 
                ? "bg-teal-brand text-white border-teal-brand" 
                : "bg-white border-black/[0.08] text-secondary hover:bg-surface-0"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showNotes ? "Hide Facilitator Cues" : "Show Facilitator Cues"}</span>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={`p-2 rounded-lg text-xs font-bold font-sans transition-all flex items-center justify-center border cursor-pointer ${
              isPlaying 
                ? "bg-teal-light text-teal-brand border-teal-brand/20" 
                : "bg-white border-black/[0.08] text-secondary hover:bg-surface-0"
            }`}
            title={isPlaying ? "Pause Slideshow" : "Auto-Play Slides (7s)"}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-teal-brand" /> : <Play className="w-4 h-4 text-secondary" />}
          </button>
        </div>
      </div>

      {/* Main Slideshow Stage */}
      <div 
        ref={rulerRef}
        onMouseMove={handleMouseMove}
        className={`relative overflow-hidden border rounded-3xl shadow-xl min-h-[380px] flex flex-col justify-between p-6 sm:p-8 transition-all duration-300 ${themeStyles.container}`}
      >
        {/* Anti-glare and dyslexia focus guide rulers */}
        {readingRuler && (
          <div 
            className={`absolute left-0 right-0 h-11 pointer-events-none transition-all duration-75 z-30 border-y ${
              isLightBackground 
                ? "bg-amber-400/25 border-amber-500/40 mix-blend-multiply" 
                : "bg-white/10 border-white/20 mix-blend-screen"
            }`}
            style={{ top: `${rulerTop - 22}px` }}
          />
        )}

        {/* Subtle grid backing decoration (only in dark mode to avoid glare) */}
        {!isLightBackground && (
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-30" />
        )}
        
        {/* Progress indicators */}
        <div className="absolute top-0 left-0 right-0 p-1 flex gap-1 z-10">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                if (isPlaying && slideTimer) {
                  clearInterval(slideTimer);
                  const timer = setInterval(() => handleNext(), 7000);
                  setSlideTimer(timer);
                }
              }}
              className="h-1 flex-1 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 cursor-pointer transition-all hover:bg-black/20 dark:hover:bg-white/20"
            >
              <div 
                className={`h-full bg-teal-brand transition-all duration-300 ${
                  idx === currentIndex ? "w-full" : idx < currentIndex ? "w-full opacity-40" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Animated content frame */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 font-mono ${isLightBackground ? "text-teal-800" : "text-teal-brand"}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SLIDE {currentIndex + 1} DIRECTIVE</span>
                </span>
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight flex items-center justify-between gap-4 ${themeStyles.title} ${dyslexiaMode ? "dyslexia-mode-styles" : "font-sans"}`}>
                  <span>{currentSlide.title}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(currentSlide.title, ttsSpeed);
                    }}
                    className={`p-1.5 rounded-lg transition-all ${isLightBackground ? "hover:bg-teal-900/5 text-teal-900" : "hover:bg-white/5 text-teal-400"}`}
                    title="Speak slide header"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </h3>
              </div>

              {/* Main Content points */}
              <div className="space-y-4 max-w-2xl">
                {currentSlide.content.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${themeStyles.bulletNum}`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 flex justify-between items-start gap-4">
                      <p className={`text-sm sm:text-base leading-relaxed ${themeStyles.pointText} ${dyslexiaMode ? "dyslexia-mode-styles" : "font-sans"}`}>
                        {bionicReading ? formatBionicText(point) : point}
                      </p>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(point, ttsSpeed);
                        }}
                        className={`p-1 rounded-md opacity-40 group-hover:opacity-100 focus:opacity-100 transition-all shrink-0 ${
                          isLightBackground ? "hover:bg-black/5 text-slate-800" : "hover:bg-white/10 text-teal-400"
                        }`}
                        title="Read this point aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Deck Footer */}
        <div className={`relative z-10 flex items-center justify-between border-t pt-4 mt-6 ${themeStyles.border}`}>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                isLightBackground 
                  ? "bg-white border-black/10 hover:bg-black/5 text-teal-950" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
              }`}
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                isLightBackground 
                  ? "bg-white border-black/10 hover:bg-black/5 text-teal-950" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
              }`}
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-right">
            <span className={`text-[10px] font-mono block uppercase ${themeStyles.caption}`}>Presenter Deck</span>
            <span className="text-xs font-sans text-teal-brand font-bold">
              {currentIndex + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Concept Block */}
      {currentSlide.visualConcept && (
        <div className="bg-slate-50 border border-black/[0.05] rounded-2xl p-5 space-y-3 shadow-3xs text-left" id="visual-concept-card">
          <div className="flex items-center gap-2.5 text-teal-dark">
            <div className="w-7 h-7 rounded-lg bg-teal-light flex items-center justify-center text-teal-brand">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase font-sans tracking-tight">Smartboard Visual Concept</h5>
              <p className="text-[9px] text-secondary leading-none">Suggested live illustration or board sketch</p>
            </div>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-sans bg-white border border-black/[0.04] p-3 rounded-xl italic">
            "{currentSlide.visualConcept}"
          </p>
        </div>
      )}

      {/* Facilitator Notes (Collapsible or toggleable) */}
      <AnimatePresence>
        {showNotes && currentSlide.instructorNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            id="instructor-notes-card"
          >
            <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-5 space-y-3 text-left">
              <div className="flex items-center gap-2.5 text-amber-900">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase font-sans tracking-tight">Facilitator Cues & Speaking Prompts</h5>
                  <p className="text-[9px] text-amber-800/80 leading-none">Pedagogical recommendations by Lyra</p>
                </div>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-sans bg-white/70 border border-amber-200/30 p-3 rounded-xl">
                {currentSlide.instructorNotes}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
