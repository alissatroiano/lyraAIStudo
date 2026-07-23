import React, { useState } from "react";
import { 
  Gamepad2, 
  Tv, 
  Sparkles, 
  Search, 
  Play, 
  Film, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Clapperboard, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Video
} from "lucide-react";
import { GamifiedVideoPackage, ProcessedLesson } from "../types";

interface GamifiedVideoStudioProps {
  lesson: ProcessedLesson;
  onUpdateGamifiedPackage?: (pkg: GamifiedVideoPackage) => void;
  dyslexiaMode?: boolean;
  bionicReading?: boolean;
  formatBionicText?: (text: string) => React.ReactNode;
  speakText?: (text: string) => void;
  stopSpeaking?: () => void;
  isSpeaking?: boolean;
}

export default function GamifiedVideoStudio({
  lesson,
  onUpdateGamifiedPackage,
  dyslexiaMode = false,
  bionicReading = false,
  formatBionicText,
  speakText,
  stopSpeaking,
  isSpeaking = false
}: GamifiedVideoStudioProps) {
  const [isGamifying, setIsGamifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Veo Video Generation States
  const [generatingCutsceneVideo, setGeneratingCutsceneVideo] = useState<boolean>(false);
  const [cutsceneVideoProgress, setCutsceneVideoProgress] = useState<string>("");
  const [cutsceneVideoUrl, setCutsceneVideoUrl] = useState<string | null>(null);

  const [generatingCartoonVideo, setGeneratingCartoonVideo] = useState<boolean>(false);
  const [cartoonVideoProgress, setCartoonVideoProgress] = useState<string>("");
  const [cartoonVideoUrl, setCartoonVideoUrl] = useState<string | null>(null);

  const pkg = lesson.gamifiedVideoPackage;

  // Function to call /api/gamify-video with Google Search Grounding
  const handleGenerateGamifiedPackage = async () => {
    setIsGamifying(true);
    setError(null);

    try {
      const response = await fetch("/api/gamify-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: lesson.lessonTitle,
          lessonContent: `${lesson.summary} ${lesson.keyTakeaways.join(" ")}`,
          summary: lesson.summary
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || errData.error || "Failed to generate gamified concepts");
      }

      const data: GamifiedVideoPackage = await response.json();
      if (onUpdateGamifiedPackage) {
        onUpdateGamifiedPackage(data);
      }
    } catch (err: any) {
      console.error("Gamification generation error:", err);
      setError(err?.message || "Failed to generate gamified concepts. Please check your API key.");
    } finally {
      setIsGamifying(false);
    }
  };

  // Function to generate Veo 3 Video for Cutscene or Cartoon
  const handleGenerateVeoVideo = async (type: "cutscene" | "cartoon") => {
    const isCutscene = type === "cutscene";
    const prompt = isCutscene 
      ? pkg?.cutsceneConcept?.visualPromptForVeo || `Cinematic 3D video game cutscene of ${lesson.lessonTitle}`
      : pkg?.cartoonConcept?.visualPromptForVeo || `2D cartoon animation explaining ${lesson.lessonTitle}`;

    if (isCutscene) {
      setGeneratingCutsceneVideo(true);
      setCutsceneVideoProgress("Initializing Veo 3.1 Fast Video Engine...");
    } else {
      setGeneratingCartoonVideo(true);
      setCartoonVideoProgress("Initializing Veo 3.1 Fast Video Engine...");
    }

    try {
      // Step 1: Initiate video generation operation
      const startRes = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio: "16:9",
          resolution: "720p",
          mode: isCutscene ? "cut_scene" : "cartoon"
        })
      });

      if (!startRes.ok) {
        const startErr = await startRes.json();
        throw new Error(startErr.details || startErr.error || "Failed to start Veo video generation");
      }

      const { operationName } = await startRes.json();

      // Step 2: Poll operation status until done
      let isDone = false;
      let attempts = 0;
      const progressMessages = [
        "Synthesizing 3D camera angles & game engine lighting...",
        "Rendering character motion & fluid visual effects...",
        "Applying educational animation styling...",
        "Finalizing high-definition MP4 render...",
        "Optimizing video stream for instant classroom playback..."
      ];

      while (!isDone && attempts < 60) {
        attempts++;
        if (isCutscene) {
          setCutsceneVideoProgress(progressMessages[attempts % progressMessages.length]);
        } else {
          setCartoonVideoProgress(progressMessages[attempts % progressMessages.length]);
        }

        await new Promise((res) => setTimeout(res, 5000));

        const statusRes = await fetch("/api/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName })
        });

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.done) {
            isDone = true;
            if (statusData.error) {
              throw new Error(statusData.error.message || "Veo video generation error");
            }
          }
        }
      }

      if (!isDone) {
        throw new Error("Video generation timed out. Please try again.");
      }

      // Step 3: Download video binary and create blob URL
      if (isCutscene) setCutsceneVideoProgress("Downloading completed MP4 render...");
      else setCartoonVideoProgress("Downloading completed MP4 render...");

      const downloadRes = await fetch("/api/video-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationName })
      });

      if (!downloadRes.ok) {
        throw new Error("Failed to download generated video binary.");
      }

      const blob = await downloadRes.blob();
      const videoBlobUrl = URL.createObjectURL(blob);

      if (isCutscene) {
        setCutsceneVideoUrl(videoBlobUrl);
      } else {
        setCartoonVideoUrl(videoBlobUrl);
      }
    } catch (err: any) {
      console.error("Veo video generation error:", err);
      alert(`Video Generation Notice: ${err?.message || "Veo video generation failed."}`);
    } finally {
      if (isCutscene) {
        setGeneratingCutsceneVideo(false);
        setCutsceneVideoProgress("");
      } else {
        setGeneratingCartoonVideo(false);
        setCartoonVideoProgress("");
      }
    }
  };

  // Read script out loud via Voiceover
  const handleReadScript = (type: "cutscene" | "cartoon") => {
    if (isSpeaking && stopSpeaking) {
      stopSpeaking();
      return;
    }
    if (!speakText) return;

    const concept = type === "cutscene" ? pkg?.cutsceneConcept : pkg?.cartoonConcept;
    if (!concept) return;

    let fullScriptText = `${concept.title}. ${type === "cutscene" ? "Setting: " + concept.settingAndLore : "Scenario: " + concept.scenario}. `;
    concept.script.forEach((line) => {
      if (line.visual) fullScriptText += `Visual cue: ${line.visual}. `;
      if (line.character && line.dialogue) fullScriptText += `${line.character} says: ${line.dialogue}. `;
    });

    speakText(fullScriptText);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-purple-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Gamepad2 className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>Lyra Video Gamification Engine</span>
                <span className="text-[10px] bg-purple-400 text-purple-950 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Google Search Grounded
                </span>
              </h3>
              <p className="text-xs text-purple-200/80 font-medium mt-0.5">
                Transforms rigid STEM lesson plans into high-octane 3D Video Game Cutscenes & 2D Cartoon Animations!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateGamifiedPackage}
            disabled={isGamifying}
            className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-purple-950 font-bold text-xs transition-all flex items-center gap-2.5 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isGamifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-950" />
                <span>Searching Trends & Scripting...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-purple-950" />
                <span>{pkg ? "Regenerate with Search Grounding" : "Generate Video Concepts"}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {!pkg && !isGamifying && (
        <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-10 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
            <Clapperboard className="w-8 h-8 text-purple-700" />
          </div>
          <h4 className="text-lg font-bold text-teal-dark">Ready to Gamify This STEM Lesson?</h4>
          <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
            Click the button above to launch Lyra&apos;s 3-step Gamify, Script, and Storyboard pipeline. Gemini will search live gaming trends (Minecraft, Fortnite, Roblox) to craft custom Video Game Cutscenes & Cartoon Scripts!
          </p>
          <button
            type="button"
            onClick={handleGenerateGamifiedPackage}
            className="px-6 py-3 rounded-xl bg-teal-dark hover:bg-teal-950 text-white font-bold text-xs transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-brand" />
            <span>Generate Gamified Video Package Now</span>
          </button>
        </div>
      )}

      {isGamifying && (
        <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-12 text-center space-y-4 shadow-2xs animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7 text-purple-600 animate-spin" />
          </div>
          <h4 className="text-base font-bold text-teal-dark">Researching Gaming Trends & Crafting Scripts...</h4>
          <p className="text-xs text-secondary max-w-md mx-auto">
            Querying Google Search grounding for popular mechanics in survival, crafting, and sandbox games to map to {lesson.lessonTitle}.
          </p>
        </div>
      )}

      {pkg && !isGamifying && (
        <div className="space-y-6">

          {/* 🎮 SECTION 1: THE GAMIFICATION BREAKDOWN */}
          <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Gamepad2 className="w-5 h-5 text-purple-700" />
                </span>
                <h4 className="text-base font-extrabold text-teal-dark flex items-center gap-2">
                  <span>🎮 The Gamification Breakdown</span>
                </h4>
              </div>

              {pkg.gamificationBreakdown.groundingSources && pkg.gamificationBreakdown.groundingSources.length > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-teal-dark font-bold font-mono bg-teal-brand/10 border border-teal-brand/20 px-2.5 py-1 rounded-full">
                  <Search className="w-3 h-3 text-teal-brand" />
                  <span>Google Search Grounded</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Target Concept */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Target STEM Concept
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {pkg.gamificationBreakdown.targetConcept}
                </p>
              </div>

              {/* Gaming Hook */}
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 block">
                  Gaming & Pop-Culture Hook
                </span>
                <p className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{pkg.gamificationBreakdown.gamingPopCultureHook}</span>
                </p>
              </div>

              {/* Analogy */}
              <div className="p-4 rounded-2xl bg-teal-brand/10 border border-teal-brand/20 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-dark block">
                  The Game Analogy
                </span>
                <p className={`text-xs text-slate-800 leading-relaxed font-medium ${dyslexiaMode ? "dyslexia-mode-styles" : ""}`}>
                  {bionicReading && formatBionicText ? formatBionicText(pkg.gamificationBreakdown.theAnalogy) : pkg.gamificationBreakdown.theAnalogy}
                </p>
              </div>
            </div>

            {/* Grounding Web Citations */}
            {pkg.gamificationBreakdown.groundingSources && pkg.gamificationBreakdown.groundingSources.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Research Sources:
                </span>
                {pkg.gamificationBreakdown.groundingSources.map((source, sIdx) => (
                  <a
                    key={sIdx}
                    href={source.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-dark hover:text-teal-brand bg-slate-100 hover:bg-slate-200 border border-black/[0.05] px-2.5 py-1 rounded-lg transition-all"
                  >
                    <span>{source.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* GRID OF CONCEPTS: CONCEPT 1 (CUTSCENE) & CONCEPT 2 (CARTOON) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 🎬 CONCEPT 1: VIDEO GAME CUTSCENE */}
            <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Concept Header */}
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-purple-100 text-purple-800">
                      <Film className="w-4 h-4 text-purple-800" />
                    </span>
                    <h4 className="text-sm font-extrabold text-teal-dark uppercase tracking-wider font-mono">
                      Concept 1: Video Game Cutscene
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-full">
                    Duration: ~{pkg.cutsceneConcept.duration || "60-90s"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">
                    {pkg.cutsceneConcept.title}
                  </h3>
                  
                  <div className="bg-slate-900 text-purple-100 p-3.5 rounded-2xl text-xs space-y-1.5 font-sans border border-purple-900/50">
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-400 block tracking-wider">
                      🌐 Setting & Lore
                    </span>
                    <p className="leading-relaxed">
                      {pkg.cutsceneConcept.settingAndLore}
                    </p>
                  </div>
                </div>

                {/* Character Roster */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                    Cast & Character Roster
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pkg.cutsceneConcept.characters.map((char, cIdx) => (
                      <span key={cIdx} className="text-xs font-bold bg-slate-100 text-slate-800 border border-black/[0.05] px-2.5 py-1 rounded-xl">
                        👤 {char}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Script & Visual Directions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Script & Visual Directions
                    </span>

                    {speakText && (
                      <button
                        type="button"
                        onClick={() => handleReadScript("cutscene")}
                        className="text-[10px] font-bold text-teal-dark hover:text-teal-brand flex items-center gap-1 cursor-pointer"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-teal-brand" />}
                        <span>{isSpeaking ? "Stop Voiceover" : "Listen to Script"}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {pkg.cutsceneConcept.script.map((line, lIdx) => (
                      <div key={lIdx} className="p-3 rounded-2xl border border-black/[0.05] bg-slate-50/70 space-y-1.5 text-xs">
                        {line.visual && (
                          <div className="bg-purple-950 text-purple-200 text-[11px] font-mono font-medium p-2 rounded-xl border border-purple-800/60 leading-relaxed">
                            <span className="font-bold text-purple-400 mr-1.5">🎬 Visual Cue:</span>
                            {line.visual}
                          </div>
                        )}
                        {line.character && line.dialogue && (
                          <div className="pl-1 pt-1 font-medium text-slate-900">
                            <span className="font-extrabold text-teal-dark font-mono mr-1.5 uppercase text-[11px]">
                              {line.character}:
                            </span>
                            <span className={dyslexiaMode ? "dyslexia-mode-styles" : ""}>
                              &quot;{bionicReading && formatBionicText ? formatBionicText(line.dialogue) : line.dialogue}&quot;
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Educational Takeaway */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-0.5">
                  <span className="font-bold text-amber-800 uppercase text-[10px] font-mono block">
                    🎯 Educational Takeaway
                  </span>
                  <p className="font-medium leading-relaxed">{pkg.cutsceneConcept.takeaway}</p>
                </div>

              </div>

              {/* Veo 3 Video Generation Box */}
              <div className="pt-4 border-t border-black/[0.06] space-y-3">
                {cutsceneVideoUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-teal-dark">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Veo 3.1 Cutscene Preview Ready!</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleGenerateVeoVideo("cutscene")}
                        className="text-[10px] text-slate-500 hover:underline cursor-pointer"
                      >
                        Re-render Video
                      </button>
                    </div>
                    <video
                      src={cutsceneVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full rounded-2xl shadow-md border border-purple-500/30 bg-black aspect-video object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-white">Veo 3 Video Generator</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full">
                        16:9 Landscape
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      Generate a photorealistic 3D game engine cinematic clip preview using Google Veo 3.1!
                    </p>

                    <button
                      type="button"
                      onClick={() => handleGenerateVeoVideo("cutscene")}
                      disabled={generatingCutsceneVideo}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-purple-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {generatingCutsceneVideo ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-purple-950" />
                          <span>{cutsceneVideoProgress || "Rendering Veo Cutscene..."}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-purple-950 text-purple-950" />
                          <span>Render Veo Cutscene Video Clip</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* 🎨 CONCEPT 2: CARTOON ANIMATION */}
            <div className="bg-surface-0 border border-black/[0.06] rounded-3xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Concept Header */}
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
                      <Tv className="w-4 h-4 text-amber-800" />
                    </span>
                    <h4 className="text-sm font-extrabold text-teal-dark uppercase tracking-wider font-mono">
                      Concept 2: Cartoon Animation
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    Duration: ~{pkg.cartoonConcept.duration || "60-90s"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">
                    {pkg.cartoonConcept.title}
                  </h3>
                  
                  <div className="bg-amber-50 text-amber-950 p-3.5 rounded-2xl text-xs space-y-1.5 font-sans border border-amber-200">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-800 block tracking-wider">
                      🎭 The Scenario Setup
                    </span>
                    <p className="leading-relaxed font-medium">
                      {pkg.cartoonConcept.scenario}
                    </p>
                  </div>
                </div>

                {/* Character Roster */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                    Cast & Character Roster
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pkg.cartoonConcept.characters.map((char, cIdx) => (
                      <span key={cIdx} className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl">
                        🎨 {char}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Script & Visual Directions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Script & Visual Directions
                    </span>

                    {speakText && (
                      <button
                        type="button"
                        onClick={() => handleReadScript("cartoon")}
                        className="text-[10px] font-bold text-teal-dark hover:text-teal-brand flex items-center gap-1 cursor-pointer"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-teal-brand" />}
                        <span>{isSpeaking ? "Stop Voiceover" : "Listen to Script"}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {pkg.cartoonConcept.script.map((line, lIdx) => (
                      <div key={lIdx} className="p-3 rounded-2xl border border-black/[0.05] bg-amber-50/40 space-y-1.5 text-xs">
                        {line.visual && (
                          <div className="bg-amber-100 text-amber-950 text-[11px] font-mono font-medium p-2 rounded-xl border border-amber-300 leading-relaxed">
                            <span className="font-bold text-amber-800 mr-1.5">🎨 Visual Cue:</span>
                            {line.visual}
                          </div>
                        )}
                        {line.character && line.dialogue && (
                          <div className="pl-1 pt-1 font-medium text-slate-900">
                            <span className="font-extrabold text-amber-900 font-mono mr-1.5 uppercase text-[11px]">
                              {line.character}:
                            </span>
                            <span className={dyslexiaMode ? "dyslexia-mode-styles" : ""}>
                              &quot;{bionicReading && formatBionicText ? formatBionicText(line.dialogue) : line.dialogue}&quot;
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Educational Takeaway */}
                <div className="p-3 bg-teal-brand/10 border border-teal-brand/20 rounded-2xl text-xs text-teal-dark space-y-0.5">
                  <span className="font-bold text-teal-dark uppercase text-[10px] font-mono block">
                    🎯 Educational Takeaway
                  </span>
                  <p className="font-medium leading-relaxed">{pkg.cartoonConcept.takeaway}</p>
                </div>

              </div>

              {/* Veo 3 Video Generation Box */}
              <div className="pt-4 border-t border-black/[0.06] space-y-3">
                {cartoonVideoUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-teal-dark">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Veo 3.1 Cartoon Preview Ready!</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleGenerateVeoVideo("cartoon")}
                        className="text-[10px] text-slate-500 hover:underline cursor-pointer"
                      >
                        Re-render Video
                      </button>
                    </div>
                    <video
                      src={cartoonVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full rounded-2xl shadow-md border border-amber-500/30 bg-black aspect-video object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">Veo 3 Video Generator</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                        16:9 Landscape
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      Generate a whimsical 2D animated cartoon clip preview using Google Veo 3.1!
                    </p>

                    <button
                      type="button"
                      onClick={() => handleGenerateVeoVideo("cartoon")}
                      disabled={generatingCartoonVideo}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {generatingCartoonVideo ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-950" />
                          <span>{cartoonVideoProgress || "Rendering Veo Cartoon..."}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-amber-950 text-amber-950" />
                          <span>Render Veo Cartoon Video Clip</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
