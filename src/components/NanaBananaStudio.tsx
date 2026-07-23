import React, { useState } from "react";
import { 
  Sparkles, 
  Wand2, 
  Image as ImageIcon, 
  FlaskConical, 
  Download, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  ExternalLink,
  Copy,
  Maximize2,
  X,
  Plus
} from "lucide-react";
import { ProcessedLesson, GeneratedVisual } from "../types";

interface NanaBananaStudioProps {
  lesson: ProcessedLesson;
  onAddVisual?: (visual: GeneratedVisual) => void;
  dyslexiaMode?: boolean;
  bionicReading?: boolean;
  formatBionicText?: (text: string) => React.ReactNode;
  speakText?: (text: string) => void;
  stopSpeaking?: () => void;
  isSpeaking?: boolean;
}

export default function NanaBananaStudio({
  lesson,
  onAddVisual,
  dyslexiaMode = false,
  bionicReading = false,
  formatBionicText,
  speakText,
  stopSpeaking,
  isSpeaking = false
}: NanaBananaStudioProps) {
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("hands_on_experiment");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [imageSize, setImageSize] = useState<string>("1K");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingLabel, setGeneratingLabel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  // Local list of generated visuals (merged with lesson.generatedVisuals if available)
  const [localVisuals, setLocalVisuals] = useState<GeneratedVisual[]>(
    lesson.generatedVisuals || []
  );

  // Modal for viewing image full size
  const [previewVisual, setPreviewVisual] = useState<GeneratedVisual | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync when lesson prop updates
  React.useEffect(() => {
    if (lesson.generatedVisuals) {
      setLocalVisuals(lesson.generatedVisuals);
    }
  }, [lesson.generatedVisuals]);

  // Main visual generation handler
  const handleGenerateVisual = async (promptToUse?: string, styleToUse?: string, titleToUse?: string) => {
    const finalPrompt = promptToUse || customPrompt || `Hands-on experiment for ${lesson.lessonTitle}: ${lesson.handsOnActivity?.title || lesson.summary}`;
    const finalStyle = styleToUse || selectedStyle;
    const title = titleToUse || `Visual: ${finalPrompt.slice(0, 30)}...`;

    setIsGenerating(true);
    setGeneratingLabel(title);
    setError(null);

    try {
      const response = await fetch("/api/generate-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          aspectRatio: aspectRatio,
          imageSize: imageSize,
          style: finalStyle
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || errData.error || "Failed to generate visual using Nana Banana Pro.");
      }

      const data = await response.json();

      const newVisual: GeneratedVisual = {
        id: `vis_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: title,
        imageUrl: data.imageUrl,
        prompt: finalPrompt,
        style: finalStyle,
        timestamp: Date.now()
      };

      setLocalVisuals(prev => [newVisual, ...prev]);

      if (onAddVisual) {
        onAddVisual(newVisual);
      }

      // Reset custom prompt if used
      if (!promptToUse) {
        setCustomPrompt("");
      }
    } catch (err: any) {
      console.error("Nana Banana Pro generation error:", err);
      setError(err?.message || "Failed to generate experiment visual. Please check your API key.");
    } finally {
      setIsGenerating(false);
      setGeneratingLabel("");
    }
  };

  const handleDownloadImage = (visual: GeneratedVisual) => {
    const link = document.createElement("a");
    link.href = visual.imageUrl;
    link.download = `${visual.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = (visual: GeneratedVisual) => {
    navigator.clipboard.writeText(visual.imageUrl);
    setCopiedId(visual.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Banner & Model Badge */}
      <div className="bg-gradient-to-r from-amber-950 via-teal-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-amber-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-amber-950 shadow-md shrink-0 font-bold">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2 flex-wrap">
                <span>Nana Banana Pro Visual Studio</span>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  gemini-3-pro-image
                </span>
              </h3>
              <p className="text-xs text-amber-100/90 font-medium mt-0.5">
                Generate crisp, high-definition AI visuals, labeled lab diagrams, and step-by-step experiment illustrations for your classroom!
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Quick Visual Prompting Buttons for Active Experiment */}
      <div className="bg-white border border-black/[0.1] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-teal-brand" />
            <h4 className="text-sm font-bold text-teal-dark font-sans">
              Instant Experiment & Lesson Visual Prompts
            </h4>
          </div>
          <span className="text-[10px] font-mono text-secondary">
            1-Click Generation
          </span>
        </div>

        <p className="text-xs text-secondary leading-relaxed font-sans">
          Click any preset below to instantly prompt Nana Banana Pro to create a visual tailored to <strong>{lesson.lessonTitle}</strong>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Preset 1: Experiment Setup */}
          <button
            type="button"
            onClick={() => handleGenerateVisual(
              `Hands-on experiment setup for ${lesson.handsOnActivity?.title || lesson.lessonTitle}. Showing materials: ${lesson.handsOnActivity?.materials?.slice(0, 5).join(", ") || "lab equipment"}.`,
              "hands_on_experiment",
              "Main Lab Setup Visual"
            )}
            disabled={isGenerating}
            className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-all text-left space-y-1.5 cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                Lab Setup
              </span>
              <Wand2 className="w-3.5 h-3.5 text-amber-600 opacity-60 group-hover:opacity-100" />
            </div>
            <p className="text-[10px] text-amber-800/80 line-clamp-2">
              Visualizes the complete hands-on experiment setup and equipment in a kids classroom.
            </p>
          </button>

          {/* Preset 2: Step-by-Step Procedure */}
          <button
            type="button"
            onClick={() => handleGenerateVisual(
              `Step-by-step experiment guide illustration for ${lesson.handsOnActivity?.title || lesson.lessonTitle}. Step 1 action: ${lesson.handsOnActivity?.steps?.[0] || "Setting up materials"}.`,
              "step_by_step",
              "Procedure Guide Visual"
            )}
            disabled={isGenerating}
            className="p-3.5 rounded-2xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/60 transition-all text-left space-y-1.5 cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-teal-900 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                Step-by-Step Guide
              </span>
              <Wand2 className="w-3.5 h-3.5 text-teal-600 opacity-60 group-hover:opacity-100" />
            </div>
            <p className="text-[10px] text-teal-800/80 line-clamp-2">
              Creates step-by-step procedure visuals showing students performing the experiment.
            </p>
          </button>

          {/* Preset 3: Labeled Diagram */}
          <button
            type="button"
            onClick={() => handleGenerateVisual(
              `Scientific diagram illustrating key principle: ${lesson.handsOnActivity?.scientificPrinciple || lesson.keyTakeaways?.[0] || lesson.lessonTitle}. Clean labels and colorful educational graphics.`,
              "diagram",
              "Scientific Concept Diagram"
            )}
            disabled={isGenerating}
            className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-all text-left space-y-1.5 cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-blue-900 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                Labeled Diagram
              </span>
              <Wand2 className="w-3.5 h-3.5 text-blue-600 opacity-60 group-hover:opacity-100" />
            </div>
            <p className="text-[10px] text-blue-800/80 line-clamp-2">
              Generates clean, color-coded scientific infographics and labeled diagrams.
            </p>
          </button>

          {/* Preset 4: Vocabulary Card */}
          <button
            type="button"
            onClick={() => handleGenerateVisual(
              `Fun educational vocabulary card artwork for STEM lesson topic: ${lesson.lessonTitle}. High clarity, vibrant cartoon style.`,
              "vocabulary_card",
              "Vocabulary Visual Card"
            )}
            disabled={isGenerating}
            className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 transition-all text-left space-y-1.5 cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-purple-900 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Vocab Art Card
              </span>
              <Wand2 className="w-3.5 h-3.5 text-purple-600 opacity-60 group-hover:opacity-100" />
            </div>
            <p className="text-[10px] text-purple-800/80 line-clamp-2">
              Creates bold visual flashcards weaving key vocabulary into memorable graphics.
            </p>
          </button>
        </div>
      </div>

      {/* Custom Prompt Generator Workspace */}
      <div className="bg-white border border-black/[0.1] rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-teal-dark font-sans">
              Custom Visual Prompt Studio
            </h4>
          </div>
          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
            Nana Banana Pro Engine
          </span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-teal-dark block font-sans">
              Describe the experiment visual or lesson diagram you want to create:
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={`e.g., A kid-friendly classroom experiment showing a baking soda and vinegar chemical reaction volcano with bright foam bubbling into a clear container, labeled with safety goggles...`}
              className="w-full p-3.5 text-xs rounded-2xl border border-black/[0.12] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none font-sans"
            />
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-0/60 p-4 rounded-2xl border border-black/[0.06]">
            {/* Style Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block font-sans">
                Visual Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-black/[0.12] bg-white font-sans font-semibold text-primary outline-none"
              >
                <option value="hands_on_experiment">🧪 Hands-On Experiment Setup</option>
                <option value="diagram">📊 Labeled STEM Diagram</option>
                <option value="step_by_step">📋 Step-by-Step Procedure Action</option>
                <option value="vocabulary_card">🎴 Visual Vocabulary Card</option>
                <option value="custom">🎨 Custom Presentation Art</option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block font-sans">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-black/[0.12] bg-white font-sans font-semibold text-primary outline-none"
              >
                <option value="16:9">16:9 (Slide Presentation)</option>
                <option value="4:3">4:3 (Classroom Card)</option>
                <option value="1:1">1:1 (Square Thumbnail)</option>
                <option value="3:4">3:4 (Portrait Poster)</option>
              </select>
            </div>

            {/* Image Resolution */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block font-sans">
                Resolution Quality
              </label>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-black/[0.12] bg-white font-sans font-semibold text-primary outline-none"
              >
                <option value="1K">1K High Definition (Standard)</option>
                <option value="2K">2K Ultra HD (Nana Banana Pro)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleGenerateVisual()}
              disabled={isGenerating || (!customPrompt && !lesson.handsOnActivity?.title)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-amber-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-950" />
                  <span>Rendering Nana Banana Pro Visual...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-950" />
                  <span>Generate Custom Visual</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hands-on Activity Steps with Direct Visual Generator */}
      {lesson.handsOnActivity && lesson.handsOnActivity.steps && lesson.handsOnActivity.steps.length > 0 && (
        <div className="bg-white border border-black/[0.1] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
            <h4 className="text-sm font-bold text-teal-dark font-sans flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>Experiment Step-by-Step Visual Guides</span>
            </h4>
            <span className="text-[10px] text-secondary font-mono">
              {lesson.handsOnActivity.steps.length} Steps
            </span>
          </div>

          <div className="space-y-3">
            {lesson.handsOnActivity.steps.map((stepText, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl border border-black/[0.06] bg-surface-0/50 hover:bg-surface-0 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-primary leading-relaxed font-sans font-medium">
                    {bionicReading && formatBionicText ? formatBionicText(stepText) : stepText}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateVisual(
                    `Step ${idx + 1} of hands-on experiment (${lesson.handsOnActivity.title}): ${stepText}. Clear kids classroom demonstration visual.`,
                    "step_by_step",
                    `Step ${idx + 1} Visual Guide`
                  )}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-950 font-bold text-[11px] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Prompt Step {idx + 1} Visual</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Visuals Gallery */}
      <div className="bg-white border border-black/[0.1] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-teal-dark font-sans">
              Lesson Visual Gallery ({localVisuals.length})
            </h4>
          </div>
          <span className="text-[10px] text-secondary font-mono">
            High-Res Artifacts
          </span>
        </div>

        {localVisuals.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-surface-0/50 rounded-2xl border border-dashed border-black/[0.1]">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-teal-dark">No visuals generated yet</p>
              <p className="text-[10px] text-secondary mt-0.5 max-w-sm mx-auto">
                Use the 1-click preset buttons above or write a custom prompt to create high-definition visuals for your experiment!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {localVisuals.map((visual) => (
              <div 
                key={visual.id}
                className="group relative bg-surface-0 border border-black/[0.08] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-video bg-black/5 overflow-hidden">
                  <img 
                    src={visual.imageUrl} 
                    alt={visual.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewVisual(visual)}
                      className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-sm transition-all cursor-pointer"
                      title="View full size"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadImage(visual)}
                      className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-sm transition-all cursor-pointer"
                      title="Download PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-teal-dark line-clamp-1">{visual.title}</h5>
                    <p className="text-[10px] text-secondary line-clamp-2 mt-0.5">{visual.prompt}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/[0.06] pt-2 text-[10px]">
                    <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full capitalize">
                      {visual.style.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(visual)}
                        className="p-1 hover:bg-black/5 rounded text-secondary hover:text-primary transition-all cursor-pointer"
                        title="Copy image link"
                      >
                        {copiedId === visual.id ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-brand" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {speakText && (
                        <button
                          type="button"
                          onClick={() => speakText(`Visual description: ${visual.prompt}`)}
                          className="p-1 hover:bg-black/5 rounded text-secondary hover:text-primary transition-all cursor-pointer"
                          title="Speak visual description"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-size Image Preview Modal */}
      {previewVisual && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20">
            <div className="p-4 border-b border-black/[0.08] flex items-center justify-between bg-surface-0">
              <div>
                <h4 className="text-sm font-bold text-teal-dark">{previewVisual.title}</h4>
                <p className="text-[10px] text-secondary max-w-md truncate">{previewVisual.prompt}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVisual(null)}
                className="p-2 hover:bg-black/5 rounded-full text-secondary hover:text-primary transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-slate-900/95">
              <img 
                src={previewVisual.imageUrl} 
                alt={previewVisual.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] object-contain rounded-2xl shadow-xl"
              />
            </div>

            <div className="p-4 border-t border-black/[0.08] bg-surface-0 flex items-center justify-between">
              <span className="text-xs text-secondary font-mono">
                Model: Nana Banana Pro (gemini-3-pro-image)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadImage(previewVisual)}
                  className="px-4 py-2 bg-teal-dark hover:bg-teal-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res PNG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
