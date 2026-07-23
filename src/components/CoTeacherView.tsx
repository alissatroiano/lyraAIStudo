import React from "react";
import { 
  Sparkles, 
  Brain, 
  BookOpen, 
  Lightbulb, 
  Layers, 
  CheckCircle2, 
  Search, 
  ShieldAlert,
  Volume2
} from "lucide-react";
import { ProcessedLesson } from "../types";

interface CoTeacherViewProps {
  lesson: ProcessedLesson;
  dyslexiaMode?: boolean;
  bionicReading?: boolean;
  formatBionicText?: (text: string) => React.ReactNode;
  speakText?: (text: string) => void;
}

export default function CoTeacherView({
  lesson,
  dyslexiaMode = false,
  bionicReading = false,
  formatBionicText,
  speakText
}: CoTeacherViewProps) {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Co-Teacher Header Banner */}
      <div className="bg-gradient-to-r from-teal-dark via-teal-900 to-slate-950 text-white rounded-3xl p-6 shadow-md border border-teal-brand/20 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-brand/20 border border-teal-brand/40 flex items-center justify-center text-teal-brand shadow-2xs">
            <Sparkles className="w-5 h-5 text-teal-brand animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Lyra AI STEM Co-Teacher</span>
              <span className="text-[10px] bg-teal-brand text-teal-950 font-bold px-2.5 py-0.5 rounded-full uppercase">
                Active Facilitator Coach
              </span>
            </h3>
            <p className="text-xs text-teal-light/80 font-medium">
              Real-time speaking notes, classroom cues, and adaptive backup plans
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Slide Facilitator Speaking Notes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
              <h4 className="text-sm font-bold text-teal-dark uppercase font-mono tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-brand" />
                <span>Slide-By-Slide Speaking Scripts</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {lesson.slides.length} Slides
              </span>
            </div>

            <div className="space-y-4">
              {lesson.slides.map((slide, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-black/[0.05] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-dark text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h5 className="text-xs font-bold text-teal-dark">
                        {slide.title}
                      </h5>
                    </div>
                    {speakText && (
                      <button
                        type="button"
                        onClick={() => speakText(`Slide ${idx + 1}, ${slide.title}. Facilitator note: ${slide.instructorNotes}`)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-all"
                        title="Read speaking notes"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-950 leading-relaxed font-medium">
                    <span className="font-bold text-amber-800 uppercase text-[9px] block font-mono mb-0.5">
                      🎙️ FACILITATOR CUE:
                    </span>
                    <p className={dyslexiaMode ? "dyslexia-mode-styles" : ""}>
                      {bionicReading && formatBionicText ? formatBionicText(slide.instructorNotes) : slide.instructorNotes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Media Recommendations & Science Core Pillars */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Media Recommendations & Backups */}
          <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
              <h4 className="text-sm font-bold text-teal-dark uppercase font-mono tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-brand" />
                <span>Recommended Classroom Media</span>
              </h4>
            </div>

            <div className="space-y-3">
              {lesson.mediaRecommendations && lesson.mediaRecommendations.length > 0 ? (
                lesson.mediaRecommendations.map((media, mIdx) => (
                  <div key={mIdx} className="p-3.5 rounded-2xl border border-black/[0.05] bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-teal-brand/10 text-teal-dark px-2 py-0.5 rounded-md border border-teal-brand/20 uppercase">
                        {media.resourceType}
                      </span>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(media.suggestedSearchQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-teal-brand hover:underline flex items-center gap-1"
                      >
                        Search YouTube ↗
                      </a>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      &quot;{media.suggestedSearchQuery}&quot;
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {media.whyItHelps}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 border border-black/[0.04] rounded-2xl text-xs text-slate-600">
                  Search YouTube or PhET Simulations for interactive visual demos!
                </div>
              )}
            </div>
          </div>

          {/* Quick Core Summary */}
          <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-6 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-teal-dark uppercase font-mono tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-teal-brand" />
              <span>Lesson Summary</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-black/[0.04]">
              {lesson.summary}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
