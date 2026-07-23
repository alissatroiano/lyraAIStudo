import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  Activity, 
  FileText, 
  HelpCircle, 
  Link2Off, 
  FileCode, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Users,
  Search,
  ExternalLink,
  Printer,
  ChevronRight,
  RefreshCw,
  Sliders,
  Check,
  X,
  Play,
  Upload,
  Database,
  Cloud,
  LogIn,
  LogOut,
  Trash2,
  Bookmark,
  Briefcase,
  HelpCircle as HelpIcon,
  ShieldAlert,
  Terminal,
  Video,
  Music,
  Brain,
  Save,
  Volume2,
  VolumeX
} from "lucide-react";
import { PRELOADED_LESSONS } from "./data/preloadedLessons";
import { INITIAL_PROCESSED_LESSON } from "./data/initialProcessedLesson";
import { ProcessedLesson, PreloadedLesson } from "./types";
import { useFirebase } from "./context/FirebaseContext";
import InteractiveSlideshow from "./components/InteractiveSlideshow";
import { SLIDE_STYLES } from "./lib/slideStyles";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { LandingPage } from "./components/LandingPage";
import { SubscriptionWall } from "./components/SubscriptionWall";

const stripePromise = fetch("/api/stripe-config")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load Stripe config");
    return res.json();
  })
  .then((data) => {
    const key = data.publishableKey || "pk_live_51NcyntHSk9zSqYTt2S2OH75n7DKrXoTpkPTeGqZ9ndOrSAOOqGZEiLbNNKk449JQ0c2vFmWiZNeIm0o1HcdIs2qf00WRqNovyW";
    return loadStripe(key);
  })
  .catch((err) => {
    console.error("Error loading Stripe config dynamically:", err);
    return loadStripe("pk_live_51NcyntHSk9zSqYTt2S2OH75n7DKrXoTpkPTeGqZ9ndOrSAOOqGZEiLbNNKk449JQ0c2vFmWiZNeIm0o1HcdIs2qf00WRqNovyW");
  });

// Lyra Logo Component using the uploaded logo image (lyra.png/logo.png)
const LyraLogo = ({ className = "w-28 h-28" }: { className?: string }) => (
  <img 
    src="/lyra.png" 
    alt="Lyra Learning Logo" 
    className={`${className} object-contain rounded-xl`}
    referrerPolicy="no-referrer"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      if (target.src.endsWith("/lyra.png")) {
        target.src = "/logo.png";
      }
    }}
  />
);

export default function App() {
  const { 
    user, 
    profile,
    signInWithGoogle, 
    logOut, 
    savedLessons, 
    saveLessonToCloud, 
    deleteLessonFromCloud, 
    saveInstructorPreferences,
    loadLessons,
    authLoading, 
    dbLoading,
    error: authError
  } = useFirebase();

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [isManuallyEdited, setIsManuallyEdited] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>("dashboard");

  useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const search = window.location.search;
      
      if (search.includes("presentation=true")) {
        setCurrentRoute("presentation");
      } else if (
        hash === "#/success" || 
        hash.startsWith("#/success") || 
        path === "/success" || 
        path.startsWith("/success")
      ) {
        setCurrentRoute("success");
      } else if (
        hash === "#/failure" || 
        hash.startsWith("#/failure") || 
        path === "/failure" || 
        path.startsWith("/failure") ||
        hash === "#/cancel" ||
        path === "/cancel"
      ) {
        setCurrentRoute("failure");
      } else {
        setCurrentRoute("dashboard");
      }
    };

    handleRouting();
    window.addEventListener("hashchange", handleRouting);
    window.addEventListener("popstate", handleRouting);
    return () => {
      window.removeEventListener("hashchange", handleRouting);
      window.removeEventListener("popstate", handleRouting);
    };
  }, []);

  useEffect(() => {
    if (currentRoute === "success" || currentRoute === "failure") {
      const timer = setTimeout(() => {
        setCurrentRoute("dashboard");
        if (window.location.hash) {
          window.location.hash = "#/";
        } else {
          window.history.pushState({}, "", "/");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentRoute]);

  const handleSaveToCloud = async () => {
    if (!isSubscribed && savedLessons.length >= 1) {
      setShowUpgradeModal(true);
      setError("To save more than 1 lesson plan to the cloud, please upgrade to STEM Educator Pro.");
      return;
    }
    try {
      await saveLessonToCloud(lesson);
      setSaveStatus("Saved successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      console.error("Failed to save lesson:", err);
      setError("Failed to save lesson: " + err.message);
    }
  };

  // Selection and Input states
  const [selectedPreload, setSelectedPreload] = useState<string>("rocketry");
  const [customContent, setCustomContent] = useState<string>(PRELOADED_LESSONS[0]?.rawContent || "");
  const [customPreferences, setCustomPreferences] = useState<string>("");
  const [transformationGoal, setTransformationGoal] = useState<"gamify" | "presentation">("gamify");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  
  // App states
  const [lesson, setLesson] = useState<ProcessedLesson>(INITIAL_PROCESSED_LESSON);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"slides" | "quiz">("slides");
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  // Synchronize the current active lesson to localStorage for presentation popup windows
  useEffect(() => {
    if (lesson && lesson.lessonTitle && lesson.lessonTitle !== "Untitled STEM Lesson") {
      try {
        localStorage.setItem("active_lesson", JSON.stringify(lesson));
      } catch (err) {
        console.error("Failed to sync active lesson to localStorage:", err);
      }
    }
  }, [lesson]);

  // Dyslexia & Neurodiverse Assistive states
  const [dyslexiaMode, setDyslexiaMode] = useState<boolean>(false);
  const [antiGlare, setAntiGlare] = useState<"none" | "cream" | "mint" | "peach">("none");
  const [readingRuler, setReadingRuler] = useState<boolean>(false);
  const [bionicReading, setBionicReading] = useState<boolean>(false);
  const [ttsSpeed, setTtsSpeed] = useState<number>(0.9);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");

  // Load and sort browser voices for TTS, prioritizing friendly ones
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const getVoiceFriendlinessScore = (name: string): number => {
      const lower = name.toLowerCase();
      if (lower.includes("natural")) return 100;
      if (lower.includes("google")) return 90;
      if (lower.includes("samantha")) return 80;
      if (lower.includes("hazel")) return 70;
      if (lower.includes("zira")) return 60;
      if (lower.includes("david")) return 50;
      if (lower.includes("female")) return 40;
      return 0;
    };

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter English or friendly-sounding voices
      let filtered = allVoices.filter(v => v.lang.toLowerCase().startsWith("en"));
      if (filtered.length === 0) {
        filtered = allVoices;
      }

      // Sort to prioritize friendly voices
      const sorted = [...filtered].sort((a, b) => {
        const scoreA = getVoiceFriendlinessScore(a.name);
        const scoreB = getVoiceFriendlinessScore(b.name);
        return scoreB - scoreA; // Descending friendliness
      });

      setVoices(sorted);

      if (sorted.length > 0) {
        setSelectedVoiceURI(prev => {
          if (prev && sorted.some(v => v.voiceURI === prev)) {
            return prev;
          }
          return sorted[0].voiceURI;
        });
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Text-To-Speech Audio Reader Engine
  const speakText = (text: string, speed: number = 0.9) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Clean phonetic spelling bracket annotations so they aren't read aloud literally
    const cleanText = text.replace(/\[[^\]]*\]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speed;
    
    // Find the voice by selectedVoiceURI
    const allVoices = window.speechSynthesis.getVoices();
    const voice = allVoices.find(v => v.voiceURI === selectedVoiceURI);
    if (voice) {
      utterance.voice = voice;
      // Adjust pitch slightly for certain voices for extra friendliness
      if (voice.name.toLowerCase().includes("google") || voice.name.toLowerCase().includes("natural")) {
        utterance.pitch = 1.05;
      } else {
        utterance.pitch = 1.0;
      }
    } else {
      utterance.pitch = 1.0;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Stop TTS reader when active tab changes
  useEffect(() => {
    stopSpeaking();
  }, [activeTab]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Bionic Reading conversion formatter
  const formatBionicText = (text: string) => {
    if (!text) return "";
    const words = text.split(/\s+/);
    return words.map((word, wIdx) => {
      if (!word) return null;
      
      // If it is a phonetic bracket guide e.g. [frik-shun], render it simply without bionic formatting
      if (word.startsWith("[") || word.endsWith("]")) {
        return (
          <span key={wIdx} className="inline-block mr-1 text-teal-500 font-mono text-xs select-none">
            {word}{" "}
          </span>
        );
      }

      const match = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/);
      if (!match) return <span key={wIdx}>{word} </span>;
      
      const prefix = match[1];
      const coreWord = match[2];
      const suffix = match[3];

      if (coreWord.length <= 1) {
        return <span key={wIdx}>{word} </span>;
      }

      const boldLen = Math.ceil(coreWord.length * 0.4) || 1;
      const boldPart = coreWord.substring(0, boldLen);
      const restPart = coreWord.substring(boldLen);

      const isLightBg = antiGlare !== "none";
      const boldColorClass = isLightBg 
        ? "font-extrabold text-teal-950 text-shadow-sm" 
        : "font-extrabold text-amber-300";

      return (
        <span key={wIdx} className="inline-block mr-1">
          {prefix}
          <strong className={boldColorClass}>{boldPart}</strong>
          <span>{restPart}</span>
          {suffix}
        </span>
      );
    });
  };

  // Quiz ruler focus states
  const quizRulerRef = React.useRef<HTMLDivElement>(null);
  const [quizRulerTop, setQuizRulerTop] = useState(120);

  const handleQuizMouseMove = (e: React.MouseEvent) => {
    if (!readingRuler || !quizRulerRef.current) return;
    const rect = quizRulerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const clampedY = Math.max(10, Math.min(rect.height - 10, relativeY));
    setQuizRulerTop(clampedY);
  };
  
  // Interactive Quiz states
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Lab material checking states
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});

  // Worksheet simulated answers
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [showSampleAnswers, setShowSampleAnswers] = useState<boolean>(false);

  // Interactive Chip parameters state (for easy configuration)
  const [selectedGrade, setSelectedGrade] = useState<string>("Middle (6-8)");
  const [selectedSize, setSelectedSize] = useState<string>("15-20 kids");
  const [selectedDuration, setSelectedDuration] = useState<string>("60 mins");
  const [selectedTech, setSelectedTech] = useState<string>("Smart Board");
  const [selectedStyle, setSelectedStyle] = useState<string>("Modern STEM");

  // Helper to format directive text
  const formatDirectiveText = (
    grade = selectedGrade,
    size = selectedSize,
    duration = selectedDuration,
    tech = selectedTech,
    style = selectedStyle
  ) => {
    return `Tailor for ${grade} grade, class size of ${size}, duration of ${duration}, with ${tech} available, styled in ${style} slide deck theme.`;
  };

  const handleGradeSelect = (newGrade: string) => {
    setSelectedGrade(newGrade);
    setIsManuallyEdited(false);
    if (customPreferences && customPreferences.includes("Tailor for ") && customPreferences.includes("grade")) {
      const updated = customPreferences.replace(/Tailor for [^,]+ grade/, `Tailor for ${newGrade} grade`);
      setCustomPreferences(updated);
    } else {
      setCustomPreferences(formatDirectiveText(newGrade, selectedSize, selectedDuration, selectedTech, selectedStyle));
    }
  };

  const handleTechSelect = (newTech: string) => {
    setSelectedTech(newTech);
    setIsManuallyEdited(false);
    if (customPreferences && customPreferences.includes("with ") && customPreferences.includes("available")) {
      const updated = customPreferences.replace(/with [^,]+ available/, `with ${newTech} available`);
      setCustomPreferences(updated);
    } else {
      setCustomPreferences(formatDirectiveText(selectedGrade, selectedSize, selectedDuration, newTech, selectedStyle));
    }
  };

  const handleStyleSelect = (newStyle: string) => {
    setSelectedStyle(newStyle);
    setIsManuallyEdited(false);
    if (customPreferences && customPreferences.includes("styled in ")) {
      const updated = customPreferences.replace(/styled in [^,]+ slide deck theme/, `styled in ${newStyle} slide deck theme`);
      setCustomPreferences(updated);
    } else if (customPreferences && customPreferences.trim().length > 0) {
      setCustomPreferences(`${customPreferences.trim()}, styled in ${newStyle} slide deck theme.`);
    } else {
      setCustomPreferences(formatDirectiveText(selectedGrade, selectedSize, selectedDuration, selectedTech, newStyle));
    }
  };

  // Sync selected preload into custom content textbox
  useEffect(() => {
    const found = PRELOADED_LESSONS.find(p => p.id === selectedPreload);
    if (found) {
      setCustomContent(found.rawContent);
    }
  }, [selectedPreload]);

  // Reset quiz state when lesson changes
  useEffect(() => {
    setCurrentQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
    
    // Clear material checkmarks
    const initialChecked: Record<string, boolean> = {};
    if (lesson?.handsOnActivity?.materials) {
      lesson.handsOnActivity.materials.forEach(m => {
        initialChecked[m] = false;
      });
    }
    setCheckedMaterials(initialChecked);
    setStudentAnswers({});
  }, [lesson]);

  // Append parameters helper on initialization if directive is empty
  useEffect(() => {
    if (!customPreferences || customPreferences.trim() === "") {
      setCustomPreferences(formatDirectiveText(selectedGrade, selectedSize, selectedDuration, selectedTech, selectedStyle));
    }
  }, []);

  // Load preferences from Firebase Profile when logged in
  useEffect(() => {
    if (profile) {
      if (profile.customPreferences !== undefined && profile.customPreferences !== "") {
        setCustomPreferences(profile.customPreferences);
        setIsManuallyEdited(true);
      }
      if (profile.grade) setSelectedGrade(profile.grade);
      if (profile.classSize) setSelectedSize(profile.classSize);
      if (profile.duration) setSelectedDuration(profile.duration);
      if (profile.tech) setSelectedTech(profile.tech);
      if (profile.style) setSelectedStyle(profile.style);
    }
  }, [profile]);

  const handleAutoGenerateFromChips = () => {
    const specs = formatDirectiveText(selectedGrade, selectedSize, selectedDuration, selectedTech, selectedStyle);
    setCustomPreferences(specs);
    setIsManuallyEdited(false);
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    setProfileSaving(true);
    try {
      await saveInstructorPreferences(
        customPreferences,
        selectedGrade,
        selectedSize,
        selectedDuration,
        selectedTech,
        undefined,
        selectedStyle
      );
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save instructor preferences:", err);
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle uploaded files by reading them as text
  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!isSubscribed && savedLessons.length >= 1) {
      setShowUpgradeModal(true);
      setError("To generate or upload more than 1 lesson plan, please upgrade to STEM Educator Pro.");
      return;
    }
    setUploadedFileName(file.name);
    setExtractionError(null);

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === "pdf" || fileExt === "docx") {
      setIsExtracting(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target?.result as string;
          // strip data url prefix if exists (e.g. "data:application/pdf;base64,")
          const base64Data = base64String.split(",")[1] || base64String;

          const response = await fetch("/api/extract-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileBase64: base64Data,
              fileName: file.name
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to extract text from document");
          }

          const data = await response.json();
          if (data.text) {
            setCustomContent(data.text);
          } else {
            throw new Error("No text content could be extracted from this document.");
          }
        } catch (err: any) {
          console.error("Text extraction failed:", err);
          setExtractionError(err?.message || String(err));
          setUploadedFileName(null);
        } finally {
          setIsExtracting(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setCustomContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Call server-side backend API to process lesson using Gemini
  const handleProcessLesson = async () => {
    if (!isSubscribed && savedLessons.length >= 1) {
      setShowUpgradeModal(true);
      setError("To generate more than 1 lesson plan, please upgrade to STEM Educator Pro.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Autosave custom preferences immediately before processing
      if (user) {
        try {
          await saveInstructorPreferences(
            customPreferences,
            selectedGrade,
            selectedSize,
            selectedDuration,
            selectedTech
          );
        } catch (saveErr) {
          console.error("Frictionless preferences autosave failed:", saveErr);
        }
      }

      const goalDirective = "Objective: Gamify this lesson specifically optimized for differently-abled and dyslexic students. Emphasize multi-sensory and game-based learning, scannable short bullet points, bracketed phonetic spellings for key scientific words, active hands-on classroom physical activities, and interactive group jeopardy-style smart quizzes.";

      const response = await fetch("/api/process-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonContent: customContent,
          customPreferences: customPreferences 
            ? `${customPreferences}. ${goalDirective}` 
            : goalDirective
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = JSON.parse(responseText);
        } catch {
          // Response is not JSON
        }
        throw new Error(errData.error || `Server returned ${response.status}: ${responseText.substring(0, 150)}`);
      }

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error(`The server returned an invalid response format (HTML instead of JSON). First 150 characters: ${responseText.substring(0, 150)}`);
      }
      setLesson(data);

      // Save extractedStyleNotes from Gemini into instructor's profile memory
      if (user && data.extractedStyleNotes) {
        try {
          await saveInstructorPreferences(
            customPreferences,
            selectedGrade,
            selectedSize,
            selectedDuration,
            selectedTech,
            data.extractedStyleNotes
          );
        } catch (saveNotesErr) {
          console.error("Autosaving Lyra's extracted style notes failed:", saveNotesErr);
        }
      }

      setActiveTab("slides");
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || 
        "Something went wrong while communicating with Gemini. Please check your network connection or API Key."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Quick helper to fill local mock preview
  const handleQuickDemoFill = (preloadId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      if (preloadId === "rocketry") {
        setLesson(INITIAL_PROCESSED_LESSON);
      } else if (preloadId === "bridges") {
        setLesson({
          lessonTitle: "Bridge Physics & The Power of Triangles",
          duration: "45-60 minutes",
          summary: "Learn how civil structures balance physical tension and compression using balsa wood. Explore bridge-building mechanics through active material testing and structural design!",
          keyTakeaways: [
            "Tension is a pulling force, while Compression is a squeezing force.",
            "Triangles are the strongest shape in structural engineering because they resist warping.",
            "Truss bridges distribute vertical weight loads sideways into solid abutments.",
            "Material testing helps civil engineers find exact load limits before collapsing."
          ],
          slides: [
            {
              title: "What is Structural Balance?",
              content: [
                "Bridges carry enormous weight without bending or collapsing.",
                "To do this, engineers balance two invisible opposite forces: Tension and Compression.",
                "Tension pulls and stretches materials, while Compression squeezes and crushes them."
              ],
              visualConcept: "A detailed 3D rendering of a simple beam bridge with a large red truck crossing it. Compression is illustrated with solid red downward arrows on the upper surface, while Tension is shown with blue pulling arrows on the bottom surface.",
              instructorNotes: "Ask kids to place their hands together flat and push as hard as they can. That's compression! Now have them clasp their fingers together and pull. That's tension!"
            },
            {
              title: "The Magic of Triangles",
              content: [
                "Square structures fold or buckle easily under heavy pressure.",
                "Triangles cannot be deformed without altering the length of their sides.",
                "A Truss Bridge uses interconnected triangular patterns to withstand enormous weight."
              ],
              visualConcept: "Side-by-side comparative animation. On the left: a wooden square frame leaning over, collapsing sideways under a weight. On the right: a triangular frame staying completely rigid under double the weight.",
              instructorNotes: "Show them a cardboard triangle and square. Let them push down on both to feel how easily the square collapses versus the absolute rigidness of the triangle."
            }
          ],
          handsOnActivity: {
            title: "Popsicle Stick Truss Challenge",
            materials: [
              "50 wooden craft popsicle sticks",
              "Quick-drying non-toxic school craft glue",
              "12-inch heavy ruler / guide template",
              "A small plastic bucket with handle",
              "Weights (dry sand, pebbles, or heavy metal coins)"
            ],
            steps: [
              "Design a simple 12-inch truss span using popsicle sticks forming triangular grids (Warrens truss style).",
              "Glue the sticks together overlapping securely and allow 10-15 minutes to dry partially.",
              "Set up a bridge testbed by placing your bridge span between two tables spaced exactly 10 inches apart.",
              "Hang the bucket S-hook from the exact center beam of your popsicle stick deck.",
              "Slowly add sand or pebbles cup-by-cup, recording the total weights on your data sheet.",
              "Observe structural behavior. Identify which joint starts cracking or twisting first!"
            ],
            scientificPrinciple: "The triangular design of the truss forces the vertical downward pull of the bucket to distribute evenly as tension (stretching) and compression (squeezing) through all popsicle sticks, directing the force safely to the two table edges!"
          },
          worksheet: {
            title: "Truss Strength Testing Report",
            instructions: "Conduct the load stress test on your popsicle bridge and answer these engineering questions.",
            questions: [
              {
                id: "Q1",
                questionText: "What is the total weight in grams or ounces your bridge supported before failure?",
                answerType: "Fill in the Blank",
                sampleAnswer: "Answers will vary (typically around 5 to 15 pounds of sand)."
              },
              {
                id: "Q2",
                questionText: "Which shape did you use repeatedly in your truss design, and why?",
                answerType: "Short Answer",
                sampleAnswer: "Triangles, because they distribute forces evenly and don't warp or slide under vertical pressure."
              }
            ]
          },
          quiz: [
            {
              question: "Which physical force pulls and stretches bridge materials?",
              options: [
                "Compression",
                "Tension",
                "Friction",
                "Gravity"
              ],
              correctAnswerIndex: 1,
              explanation: "Tension is the force that pulls or stretches materials apart."
            },
            {
              question: "Why are triangles considered the absolute strongest shape in engineering?",
              options: [
                "Because they are lightweight and aerodynamic.",
                "Because their three corners cannot deform without changing side lengths.",
                "Because they require the least amount of glue to build.",
                "Because they look modern and beautiful."
              ],
              correctAnswerIndex: 1,
              explanation: "A triangle is geometrically rigid; it cannot warp or collapse unless one of its sides physically snaps or compresses."
            }
          ],
          mediaRecommendations: [
            {
              resourceType: "Interactive Map & Video",
              suggestedSearchQuery: "Tacoma Narrows Bridge collapse structural resonance lesson",
              whyItHelps: "Perfect historical demonstration of what happens when torsional forces are not accounted for in structural designs, turning a giant bridge into waves!"
            }
          ]
        });
      } else {
        setLesson({
          lessonTitle: "The Invisible Force: Electromagnetism",
          duration: "45-60 minutes",
          summary: "Uncover how moving electrical current generates magnetic fields. Build a temporary electromagnet from an iron nail and wire, and test its capabilities in this electrifying lab!",
          keyTakeaways: [
            "Moving electrical charges (current) create corresponding magnetic fields.",
            "Wrapping wire into a coil (solenoid) concentrates and multiplies magnetic strength.",
            "Adding an iron core aligns magnetic domains, making the electromagnet super strong.",
            "Electromagnets are temporary—turning off the current instantly stops the magnetism."
          ],
          slides: [
            {
              title: "What is Electromagnetism?",
              content: [
                "Electricity and magnetism are two sides of the same fundamental force.",
                "Danish physicist Hans Christian Ørsted discovered this when a live wire moved his compass needle!",
                "Whenever electricity flows through a wire, it creates a circular magnetic field around it."
              ],
              visualConcept: "An illustration of a straight copper wire carrying yellow energy sparks. Around the wire are concentric circular green magnetic field rings, with a compass needle pointing parallel to the circular field lines.",
              instructorNotes: "Ask kids: 'Who has a magnet on their fridge? How is that different from a computer or phone?' Fridge magnets are permanent, but electromagnets can be switched ON and OFF with a button!"
            }
          ],
          handsOnActivity: {
            title: "Supercharged Solenoid Electromagnet",
            materials: [
              "3-inch heavy steel nail (ferromagnetic core)",
              "5 feet of insulated 24-gauge magnet wire",
              "Standard 1.5V D-cell battery",
              "A handful of steel paperclips (magnetic test targets)",
              "Sandpaper (to strip wire insulation)"
            ],
            steps: [
              "Leave 6 inches of wire loose, then wrap the copper wire tightly around the steel nail at least 40 times in one direction.",
              "Keep the coils closely packed together, like a spring.",
              "Use sandpaper to scrape off the colored plastic coating from both ends of the wire.",
              "Hold one stripped end to the battery's positive (+) side and the other to the negative (-) side (be careful, wires can get warm!).",
              "Touch the tip of the coiled nail to paperclips and see how many you can pick up!",
              "Disconnect one wire end and observe the paperclips instantly drop to the table."
            ],
            scientificPrinciple: "Electricity flowing through the copper coil creates a magnetic field. This field aligns all the micro-domains inside the iron nail, turning it into a temporary magnet. Unclamping the wire collapses the field, reverting the nail to normal metal!"
          },
          worksheet: {
            title: "Electromagnet Testing & Design Lab",
            instructions: "Count paperclips picked up under different designs and answer the questions.",
            questions: [
              {
                id: "Q1",
                questionText: "What happens to the number of paperclips picked up if you double the number of wire wraps from 40 to 80?",
                answerType: "Multiple Choice",
                options: [
                  "It picks up double the paperclips because more loops strengthen the magnetic field.",
                  "It picks up fewer because there is too much wire for the battery.",
                  "It does not change at all."
                ],
                sampleAnswer: "It picks up double the paperclips because more loops strengthen the magnetic field."
              }
            ]
          },
          quiz: [
            {
              question: "Who discovered that electrical currents deflect compass needles?",
              options: [
                "Isaac Newton",
                "Thomas Edison",
                "Hans Christian Ørsted",
                "Albert Einstein"
              ],
              correctAnswerIndex: 2,
              explanation: "Hans Christian Ørsted observed this deflection in 1820, proving that electricity creates magnetic fields!"
            }
          ],
          mediaRecommendations: [
            {
              resourceType: "Video Demonstration",
              suggestedSearchQuery: "Scrapyard giant electromagnet crane picking up cars",
              whyItHelps: "A spectacular visual example showing how a massive crane picks up heavy scrap cars, shifts them, and drops them simply by flipping an electrical switch!"
            }
          ]
        });
      }
      setIsLoading(false);
      setActiveTab("slides");
    }, 500);
  };

  // Toggle checklist materials
  const toggleMaterial = (material: string) => {
    setCheckedMaterials(prev => ({
      ...prev,
      [material]: !prev[material]
    }));
  };

  // Grade Quiz Selection
  const handleQuizOptionClick = (optionIndex: number) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(optionIndex);
    setShowExplanation(true);
    
    const isCorrect = optionIndex === lesson.quiz[currentQuizIndex].correctAnswerIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  // Go to next quiz question
  const handleNextQuiz = () => {
    setSelectedQuizOption(null);
    setShowExplanation(false);
    if (currentQuizIndex < lesson.quiz.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Reset current quiz game
  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
  };

  const isLightBackground = antiGlare !== "none";

  if (currentRoute === "presentation") {
    const savedLessonRaw = localStorage.getItem("active_lesson");
    let presentationLesson = lesson;
    if (savedLessonRaw) {
      try {
        presentationLesson = JSON.parse(savedLessonRaw);
      } catch (e) {
        console.error("Failed to parse active lesson:", e);
      }
    }
    
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans antialiased flex flex-col p-6 md:p-12 justify-between">
        {/* Header with Exit controls, school branding */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-brand animate-pulse" />
            <div className="text-left">
              <span className="font-serif text-lg font-bold text-teal-light">
                {presentationLesson.lessonTitle || "STEM Interactive Class Presentation"}
              </span>
              <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                Powered by Lyra Smartboard Presentation Engine
              </p>
            </div>
          </div>
          <button
            onClick={() => window.close()}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-full text-xs font-bold transition-all cursor-pointer"
          >
            Close Presentation
          </button>
        </div>

        {/* Full-width Slideshow */}
        <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full">
          <InteractiveSlideshow
            slides={presentationLesson.slides || []}
            dyslexiaMode={dyslexiaMode}
            antiGlare={antiGlare}
            readingRuler={readingRuler}
            bionicReading={bionicReading}
            ttsSpeed={ttsSpeed}
            speakText={speakText}
            stopSpeaking={stopSpeaking}
            isSpeaking={isSpeaking}
            formatBionicText={formatBionicText}
            selectedStyle={selectedStyle}
            onStyleChange={handleStyleSelect}
          />
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-teal-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-teal-dark font-sans">Verifying Educator Credentials...</p>
        </div>
      </div>
    );
  }

  if (currentRoute === "success") {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center font-sans antialiased">
        <div className="bg-white border border-black/[0.08] p-8 rounded-3xl max-w-md w-full mx-4 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-md animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-teal-dark">Payment successful</h2>
          <p className="text-sm text-secondary">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (currentRoute === "failure") {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center font-sans antialiased">
        <div className="bg-white border border-black/[0.08] p-8 rounded-3xl max-w-md w-full mx-4 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto shadow-md">
            <AlertCircle className="w-9 h-9" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-red-900">Payment cancelled</h2>
          <p className="text-sm text-secondary">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LandingPage signInWithGoogle={signInWithGoogle} authLoading={authLoading} authError={authError} />
    );
  }

  const isSubscribed = profile?.isSubscribed === true;
  const hasAccess = isSubscribed || savedLessons.length <= 1;
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] text-[#0f1117] flex flex-col font-sans antialiased">
        <div className="w-full max-w-[1300px] mx-auto bg-white min-h-screen shadow-md flex flex-col pb-16">
          <nav className="px-6 py-4.5 border-b border-black/[0.09] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center shrink-0 border border-teal-brand/30">
                <Sparkles className="w-5 h-5 text-teal-brand" />
              </div>
              <div>
                <span className="font-serif text-2xl font-semibold tracking-tight text-teal-dark">
                  Lyra<span className="text-teal-brand font-sans">.</span>
                </span>
                <p className="text-[10px] text-secondary font-sans tracking-wide leading-none">Afterschool STEM Copilot</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logOut}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-sans"
            >
              Sign Out
            </button>
          </nav>
          <Elements stripe={stripePromise}>
            <SubscriptionWall user={user} onSuccess={loadLessons} />
          </Elements>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 text-primary flex flex-col antialiased">
      {/* Centered column wrapper matching the layout width */}
      <div className="w-full max-w-[1300px] mx-auto bg-white min-h-screen shadow-md flex flex-col pb-16">
        
        {/* Navigation Bar (ly-nav) */}
        <nav className="px-6 py-4.5 border-b border-black/[0.09] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mascot in mini logo format */}
            <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center shrink-0 border border-teal-brand/30">
              <Sparkles className="w-5 h-5 text-teal-brand" />
            </div>
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-teal-dark">
                Lyra<span className="text-teal-brand font-sans">.</span>
              </span>
              <p className="text-[10px] text-secondary font-sans tracking-wide leading-none">Afterschool STEM Copilot</p>
            </div>
          </div>

          {/* Nav Links / Active Auth badge */}
          <div className="flex items-center gap-3">
            {!isSubscribed && user && (
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-1.5 bg-[#e0faf8] hover:bg-[#bbf7f2] border border-teal-brand/20 text-teal-dark rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-sans shadow-3xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-brand animate-pulse shrink-0" />
                <span>Upgrade to Pro</span>
              </button>
            )}
            {authLoading ? (
              <div className="w-5 h-5 border-2 border-teal-brand border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-2 bg-surface-1 p-1 pr-3 rounded-full border border-black/[0.05] shadow-3xs text-xs">
                {user.photoURL ? (
                  <img referrerPolicy="no-referrer" src={user.photoURL} alt={user.displayName || 'Educator'} className="w-6.5 h-6.5 rounded-full object-cover border border-teal-brand/20" />
                ) : (
                  <div className="w-6.5 h-6.5 rounded-full bg-teal-dark text-white flex items-center justify-center font-bold text-[10px]">
                    {user.displayName?.[0]?.toUpperCase() || 'E'}
                  </div>
                )}
                <span className="font-sans font-medium text-teal-dark max-w-[80px] truncate">{user.displayName?.split(" ")[0]}</span>
                <button
                  type="button"
                  onClick={logOut}
                  className="ml-1 text-[10px] text-red-600 hover:text-red-700 font-bold transition-all px-1.5 py-0.5 rounded-md hover:bg-red-50"
                  title="Sign Out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-3.5 py-1.5 bg-teal-dark hover:bg-opacity-95 text-white rounded-full text-xs font-bold transition-all shadow-3xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-brand" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </nav>

        {/* Hero Section (ly-hero) */}
        <header className="px-6 sm:px-8 py-10 relative overflow-hidden bg-gradient-to-b from-teal-light/20 to-transparent border-b border-black/[0.04]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-brand/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg">
              <span className="inline-block text-[10px] font-bold tracking-widest text-gold-brand uppercase font-sans">
                XPRIZE · Education & Human Potential
              </span>
              <h1 className="font-serif text-3.5xl sm:text-4xl font-bold tracking-tight text-primary leading-tight">
                Your AI copilot for <span className="text-teal-dark underline decoration-teal-brand/40 underline-offset-4">STEM lesson prep</span>
              </h1>
              <p className="text-sm text-secondary leading-relaxed font-sans font-normal">
                Lyra turns long, messy science articles and PDF textbooks into beautiful interactive slide decks, hands-on lab guides, printable worksheets, and broken media link backups instantly.
              </p>
            </div>

            {/* Mascot float wrap on the right */}
            <div className="self-center md:self-auto shrink-0 bg-teal-light/40 border border-teal-brand/10 rounded-2xl p-4 shadow-3xs animate-float">
              <LyraLogo className="w-24 h-24 sm:w-28 sm:h-28" />
            </div>
          </div>

          {/* Interactive Core Intake Controller (ly-upload-zone) */}
          <div className="mt-8 bg-white border border-black/[0.12] rounded-2xl p-6 shadow-sm space-y-5" id="intake-panel">
            
            {/* Step Header */}
            <div className="flex justify-between items-center border-b border-black/[0.06] pb-3">
              <span className="text-[10px] font-bold font-mono tracking-wider text-teal-brand uppercase bg-teal-light px-2.5 py-0.5 rounded-md">
                1. Upload Curriculum Material
              </span>
              <span className="text-xs font-semibold text-secondary font-sans flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-gold-brand" />
                Configuration
              </span>
            </div>

            {/* Selection of transformation goal is locked to Gamify for Accessibility */}
            <div className="space-y-2 text-left animate-fade-in">
              <label className="text-xs font-bold text-teal-dark block font-sans flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-brand animate-pulse" />
                <span>Pedagogical Mode (Dyslexia & Accessibility Active):</span>
              </label>
              <div className="p-4.5 rounded-2xl border border-teal-brand/35 bg-teal-light/25 flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-teal-brand text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-teal-dark font-sans flex items-center gap-1.5">
                    <span>Gamify Lesson (Neurodiverse & Dyslexia Optimized)</span>
                    <span className="text-[8px] uppercase tracking-wider bg-teal-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">
                      Locked Active
                    </span>
                  </p>
                  <p className="text-[10px] text-secondary leading-relaxed font-sans">
                    This mode is permanently active to maximize cognitive accessibility. It transforms dry lesson plans into dynamic smartboard slide decks with bracketed phonetic aids (e.g. <em>friction [FRIK-shun]</em>) and structures interactive classroom jeopardy trivia. This delivers multi-sensory and game-based learning.
                  </p>
                </div>
              </div>
            </div>

            {/* PDF / Docx File Dropzone (ly-upload-zone) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-dark block font-sans">Upload your file (PDF, DOCX, TXT):</label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={(e) => {
                  if (!isSubscribed && savedLessons.length >= 1) {
                    e.stopPropagation();
                    setShowUpgradeModal(true);
                    setError("To generate or upload more than 1 lesson plan, please upgrade to STEM Educator Pro.");
                    return;
                  }
                  const el = document.getElementById("file-upload-input");
                  if (el) (el as HTMLInputElement).click();
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                  dragActive 
                    ? "border-teal-brand bg-teal-light/30" 
                    : "border-black/[0.12] hover:border-black/[0.22] bg-surface-0/50 hover:bg-surface-0"
                }`}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".txt,.json,.md,.html,.pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                {isExtracting ? (
                  <div className="space-y-2">
                    <RefreshCw className="w-8 h-8 text-teal-brand animate-spin mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-primary font-sans">Reading file securely...</p>
                      <p className="text-[10px] text-secondary font-sans mt-0.5">Running AI curriculum text parser</p>
                    </div>
                  </div>
                ) : uploadedFileName ? (
                  <div className="bg-white px-4 py-3 rounded-xl border border-teal-brand/30 flex items-center gap-3 shadow-3xs max-w-sm mx-auto">
                    <div className="w-8 h-8 rounded-lg bg-teal-light flex items-center justify-center text-teal-brand shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-bold text-primary truncate max-w-[180px] font-sans">{uploadedFileName}</p>
                      <p className="text-[9px] text-teal-brand font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready to parse
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFileName(null);
                        setCustomContent("");
                        const input = document.getElementById("file-upload-input") as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                      className="p-1 text-secondary hover:text-red-600 hover:bg-red-50 rounded-md transition-all shrink-0 ml-2"
                      title="Clear file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal-brand shrink-0 shadow-3xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary font-sans">
                        Drag & drop your file here, or <span className="text-teal-brand underline decoration-teal-brand/30">click to browse</span>
                      </p>
                      <p className="text-[10px] text-secondary leading-relaxed mt-0.5 font-sans">
                        PDF, DOCX, TXT, MD or Plain Text up to 10MB
                      </p>
                    </div>
                  </>
                )}
              </div>

              {extractionError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-950 flex gap-2 font-sans leading-normal">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-sans">Extraction Error:</span> {extractionError}
                  </div>
                </div>
              )}
            </div>

            {/* Raw lesson plan box (Optional paste) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-teal-dark font-sans">Curriculum Text Material:</label>
                {customContent && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomContent("");
                      setUploadedFileName(null);
                    }}
                    className="text-[10px] text-red-600 hover:underline font-medium"
                  >
                    Clear Input
                  </button>
                )}
              </div>
              <textarea
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                rows={5}
                placeholder="Paste textbook outlines, Wikipedia references, lecture notes, or standard curriculum text here..."
                className="w-full text-xs p-3.5 border border-black/[0.12] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-brand/10 focus:border-teal-brand font-mono bg-surface-0/40 text-primary leading-relaxed"
              />

              {/* Sample preloaded pills styled cleanly */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-secondary font-sans">Load Quick Samples:</span>
                {PRELOADED_LESSONS.map((preload) => (
                  <button
                    key={preload.id}
                    type="button"
                    onClick={() => {
                      if (!isSubscribed && savedLessons.length >= 1) {
                        setShowUpgradeModal(true);
                        setError("To generate or explore more than 1 lesson plan, please upgrade to STEM Educator Pro.");
                        return;
                      }
                      setCustomContent(preload.rawContent);
                      setUploadedFileName(`preset_${preload.id}.txt`);
                      handleQuickDemoFill(preload.id);
                    }}
                    className="text-[10px] font-bold text-teal-dark bg-teal-light/40 hover:bg-teal-light hover:text-teal-brand border border-teal-brand/10 px-2.5 py-0.5 rounded-full transition-all cursor-pointer"
                  >
                    {preload.id === "rocketry" ? "Rocket Physics" : preload.id === "bridges" ? "Bridge Static" : "Electromagnetism"}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive chip context rows (Appends parameters directly) */}
            <div className="bg-surface-0 border border-black/[0.05] rounded-xl p-4.5 space-y-4">
              <span className="text-[10px] font-bold font-mono tracking-widest text-teal-brand uppercase block border-b pb-1.5">
                Target Classroom Parameters (Auto-Configurator)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Grade */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase font-sans">Grade Level</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Elementary (3-5)", "Middle (6-8)", "High School (9-12)"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleGradeSelect(val)}
                        className={`text-[10px] px-2 py-1 rounded-md font-sans font-bold transition-all cursor-pointer ${
                          selectedGrade === val 
                            ? "bg-teal-dark text-white ring-2 ring-teal-brand/30 shadow-2xs" 
                            : "bg-white text-secondary border border-black/[0.08] hover:bg-slate-50"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tech level */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase font-sans">Technology Available</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Smart Board", "Chromebooks", "Tablets", "Low Tech (Paper Only)"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleTechSelect(val)}
                        className={`text-[10px] px-2 py-1 rounded-md font-sans font-bold transition-all cursor-pointer ${
                          selectedTech === val 
                            ? "bg-teal-dark text-white ring-2 ring-teal-brand/30 shadow-2xs" 
                            : "bg-white text-secondary border border-black/[0.08] hover:bg-slate-50"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Picker */}
                <div className="space-y-1 sm:col-span-2 pt-1 border-t border-black/[0.04]">
                  <span className="text-[10px] font-bold text-secondary uppercase font-sans">
                    Slide Deck Presentation Style (Google Slides Aesthetics)
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {SLIDE_STYLES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStyleSelect(st.id)}
                        className={`text-[10px] px-2.5 py-1 rounded-md font-sans font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          selectedStyle === st.id 
                            ? "bg-teal-dark text-white ring-2 ring-teal-brand/30 shadow-2xs" 
                            : "bg-white text-secondary border border-black/[0.08] hover:bg-slate-50"
                        }`}
                        title={st.desc}
                      >
                        <span className="flex items-center gap-0.5">
                          {st.previewDots.map((dot, dIdx) => (
                            <span key={dIdx} className="w-2 h-2 rounded-full border border-black/10 inline-block" style={{ backgroundColor: dot }} />
                          ))}
                        </span>
                        <span>{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preferences editable showcase with adaptive memory */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-secondary uppercase font-sans block">
                    Generated Instruction Directive
                  </span>
                  
                  {/* Controls */}
                  <div className="flex gap-2">
                    {isManuallyEdited && (
                      <button
                        type="button"
                        onClick={handleAutoGenerateFromChips}
                        className="text-[9px] text-teal-brand hover:text-teal-dark font-sans font-bold flex items-center gap-0.5 cursor-pointer"
                        title="Re-generate instruction text based on the selected chips above"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Reset to Chips</span>
                      </button>
                    )}
                    
                    {user && (
                      <button
                        type="button"
                        onClick={handleSavePreferences}
                        disabled={profileSaving}
                        className="text-[9px] text-teal-brand hover:text-teal-dark font-sans font-bold flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                        title="Save these instruction preferences to your profile permanently"
                      >
                        {profileSaveSuccess ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-teal-dark font-bold" />
                            <span className="text-teal-dark">Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-2.5 h-2.5" />
                            <span>{profileSaving ? "Saving..." : "Save to Profile"}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    value={customPreferences}
                    onChange={(e) => {
                      setCustomPreferences(e.target.value);
                      setIsManuallyEdited(true);
                    }}
                    className="w-full bg-white p-3 border border-black/[0.08] rounded-xl text-[11px] font-mono text-teal-dark font-medium focus:outline-none focus:ring-2 focus:ring-teal-brand/10 focus:border-teal-brand transition-all resize-y min-h-[70px]"
                    placeholder="Describe specific class constraints, student behaviors, curriculum alignment, or custom styles..."
                  />
                  {isManuallyEdited && (
                    <div className="absolute right-2 bottom-2 text-[8px] text-teal-brand font-sans font-medium px-1.5 py-0.5 rounded-md bg-teal-light/50 border border-teal-brand/10 select-none">
                      Edited
                    </div>
                  )}
                </div>

                {/* Lyra's Memory Profile & AI Insights */}
                {user ? (
                  <div className="bg-teal-light/10 border border-teal-brand/15 rounded-xl p-3 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-teal-brand animate-pulse" />
                      <span className="text-[9px] font-bold text-teal-dark uppercase tracking-wider font-sans">
                        Lyra's Memory of You
                      </span>
                    </div>
                    {profile?.instructorNotes ? (
                      <div className="space-y-1">
                        <p className="text-[10px] text-secondary font-sans leading-relaxed">
                          "I've learned that you focus on: <span className="font-semibold text-teal-dark">{profile.instructorNotes}</span>"
                        </p>
                        <span className="text-[8px] text-teal-brand font-medium block">
                          💡 Lyra automatically synthesizes these pedagogical preferences into new plans.
                        </span>
                      </div>
                    ) : (
                      <p className="text-[9px] text-secondary/70 italic font-sans leading-normal">
                        Generate a lesson to activate. Lyra will observe your input patterns and custom instructions to learn your style.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50/40 border border-amber-200/50 rounded-xl p-2.5 text-[9px] text-amber-950 leading-normal font-sans">
                    🔒 <span className="font-bold">Sign In</span> to enable Lyra's adaptive memory. Lyra will save your instructions and learn your pedagogical style across sessions!
                  </div>
                )}
              </div>
            </div>

            {/* Action CTA Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProcessLesson}
                disabled={isLoading || !customContent.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-dark hover:bg-opacity-95 text-white text-xs font-bold font-sans transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                id="generate-lesson-btn"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-teal-brand" />
                    <span>Gemini Assembly Engine Orchestrating STEM Pack...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-brand" />
                    <span>Generate Classroom Materials (AI Transform)</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2 text-red-950 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold">Gemini API Connection Note</span>
                    <p className="text-[10px] text-slate-700 font-sans leading-normal">{error}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Cloud Saved Lessons and Active Workspace Column Stack */}
        <section className="px-6 sm:px-8 py-8 space-y-8 flex-1">
          
          {/* Your Saved STEM Lesson Plans */}
          {user && (
            <div className="bg-surface-0 border border-black/[0.06] rounded-2xl p-5 space-y-3.5" id="saved-lessons-section">
              <div className="flex justify-between items-center border-b border-black/[0.05] pb-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-gold-brand" />
                  <span className="font-serif text-lg font-bold text-teal-dark">Your Saved STEM Lesson Plans</span>
                </div>
                <span className="text-[9px] font-mono text-secondary uppercase tracking-wider">Loaded from Cloud Firestore</span>
              </div>

              {savedLessons.length === 0 ? (
                <div className="text-center py-6 px-4 bg-white border border-dashed border-black/[0.08] rounded-xl text-xs text-secondary font-sans space-y-1">
                  <Bookmark className="w-5 h-5 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700">No saved lesson plans yet</p>
                  <p className="text-[10px] text-slate-500">Your custom STEM materials will appear here once saved to the cloud.</p>
                </div>
              ) : (
                <>
                  {!isSubscribed && savedLessons.length === 1 && (
                    <div className="bg-amber-50/70 border border-amber-200/50 p-3.5 rounded-xl flex items-center justify-between gap-4 text-xs font-sans">
                      <div className="flex gap-2 items-start">
                        <Sparkles className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <p className="font-bold text-amber-900">You are using your 1 free lesson plan</p>
                          <p className="text-[11px] text-amber-800">Upgrade to STEM Educator Pro for unlimited custom lesson generations and classroom slide decks.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowUpgradeModal(true)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-[10px] font-bold transition-all shadow-3xs cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedLessons.map((saved) => (
                      <div 
                        key={saved.id}
                        className="p-3.5 rounded-xl border border-black/[0.06] bg-white hover:border-teal-brand/40 transition-all flex justify-between items-center gap-3 shadow-3xs"
                      >
                        <div className="overflow-hidden flex-1 space-y-0.5">
                          <p className="text-xs font-bold text-primary truncate">{saved.lessonTitle}</p>
                          <span className="text-[10px] text-secondary font-sans block">{saved.duration} Block</span>
                        </div>
                        {deletingLessonId === saved.id ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await deleteLessonFromCloud(saved.id);
                                  setDeletingLessonId(null);
                                } catch (err: any) {
                                  setError("Failed to delete lesson: " + err.message);
                                }
                              }}
                              className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-3xs"
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingLessonId(null)}
                              className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setLesson(saved);
                                setActiveTab("slides");
                              }}
                              className="px-2.5 py-1 bg-teal-light text-teal-brand hover:bg-teal-brand hover:text-white rounded-lg text-[10px] font-bold transition-all shadow-3xs cursor-pointer"
                            >
                              Load
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingLessonId(saved.id)}
                              className="p-1.5 hover:bg-red-50 text-secondary hover:text-red-600 rounded-lg transition-all cursor-pointer"
                              title="Delete Lesson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Active Lesson Meta Display */}
          <div className="bg-white border border-black/[0.12] rounded-2xl p-6 shadow-xs relative overflow-hidden" id="workspace-panel">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-teal-light/20 to-transparent rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-4 mb-4 z-10 relative">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-teal-brand bg-teal-light border border-teal-brand/10 px-2.5 py-0.5 rounded-full uppercase">
                    Active Curriculum Suite
                  </span>
                  <span className="text-xs text-secondary font-sans flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-gold-brand" />
                    {lesson.duration} Block
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-teal-dark">
                  {lesson.lessonTitle}
                </h2>
                <p className="text-xs text-secondary leading-relaxed font-sans max-w-xl">
                  {lesson.summary}
                </p>
              </div>

              {/* Cloud Save Actions */}
              <div className="shrink-0 flex flex-col items-stretch md:items-end gap-1 w-full md:w-auto">
                {user ? (
                  <button
                    type="button"
                    onClick={handleSaveToCloud}
                    disabled={dbLoading}
                    className="px-4.5 py-2.5 bg-teal-dark hover:bg-opacity-95 text-white rounded-xl text-xs font-bold shadow-3xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Cloud className="w-4 h-4 text-teal-brand" />
                    {dbLoading ? 'Saving...' : 'Save to Cloud'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="px-3.5 py-2 bg-white hover:bg-surface-0 text-secondary border border-black/[0.08] rounded-xl text-xs font-bold shadow-3xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-teal-brand" />
                    <span>Sign In to Save</span>
                  </button>
                )}
                {saveStatus && (
                  <span className="text-[10px] font-bold text-teal-brand text-right font-sans flex items-center justify-end gap-1 mt-0.5">
                    <Check className="w-3.5 h-3.5" /> {saveStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Horizontal Resource Pills Tabs and Dyslexia Assistive Toolkit */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/[0.06] pb-5 mb-6" id="assistive-toolkit-bar">
              <div className="flex border border-black/[0.06] overflow-x-auto gap-1 bg-surface-0 p-1.5 rounded-xl font-sans shrink-0 max-w-fit">
                {[
                  { id: "slides", label: "Interactive Slides", icon: Layers },
                  { id: "quiz", label: "Smartboard Quiz", icon: HelpCircle }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? "bg-teal-dark text-white shadow-3xs"
                          : "text-secondary hover:text-primary hover:bg-white/[0.6]"
                      }`}
                      id={`tab-${tab.id}`}
                    >
                      <TabIcon className={`w-4 h-4 ${isSelected ? "text-teal-brand" : "text-secondary"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dyslexia & Assistive Reading Controls Panel */}
              <div className="flex flex-wrap items-center gap-2 bg-teal-brand/10 border border-teal-brand/15 p-2 rounded-2xl">
                <div className="flex items-center gap-1.5 px-2 select-none border-r border-teal-brand/20 mr-1 shrink-0">
                  <Brain className="w-4 h-4 text-teal-brand animate-pulse" />
                  <span className="text-[10px] font-bold text-teal-dark font-sans">Dyslexia Toolkit:</span>
                </div>
                
                {/* Dyslexia Friendly Font Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setDyslexiaMode(!dyslexiaMode)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    dyslexiaMode
                      ? "bg-teal-brand text-white shadow-3xs"
                      : "bg-white hover:bg-surface-0 text-secondary border border-black/[0.06]"
                  }`}
                  title="Switch to heavy-bottom dyslexia-friendly font"
                >
                  Abc (Font)
                </button>

                {/* Bionic Reading Toggle */}
                <button
                  type="button"
                  onClick={() => setBionicReading(!bionicReading)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    bionicReading
                      ? "bg-teal-brand text-white shadow-3xs"
                      : "bg-white hover:bg-surface-0 text-secondary border border-black/[0.06]"
                  }`}
                  title="Bold first parts of words to guide visual flow"
                >
                  Bio (Reading)
                </button>

                {/* Focus Ruler Toggle */}
                <button
                  type="button"
                  onClick={() => setReadingRuler(!readingRuler)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    readingRuler
                      ? "bg-teal-brand text-white shadow-3xs"
                      : "bg-white hover:bg-surface-0 text-secondary border border-black/[0.06]"
                  }`}
                  title="Enable movable horizontal reading guide ruler"
                >
                  Focus Ruler
                </button>

                {/* Anti-Glare Overlay Selector */}
                <div className="flex items-center gap-1 bg-white border border-black/[0.06] p-1 rounded-xl">
                  <span className="text-[9px] font-bold text-secondary px-1.5 select-none font-sans">Anti-Glare:</span>
                  {(["none", "cream", "mint", "peach"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setAntiGlare(mode)}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                        antiGlare === mode 
                          ? "border-teal-brand scale-110 shadow-3xs" 
                          : "border-black/[0.1] hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: 
                          mode === "none" ? "#334155" : 
                          mode === "cream" ? "#FAF3E3" : 
                          mode === "mint" ? "#E6F4F1" : "#FAF0E6"
                      }}
                      title={`Anti-glare: ${mode === "none" ? "Dark Theme" : mode}`}
                    />
                  ))}
                </div>

                {/* TTS Reader Speech Speed controller */}
                <div className="flex items-center gap-1 bg-white border border-black/[0.06] px-2 py-1 rounded-xl shrink-0">
                  <span className="text-[9px] font-bold text-secondary font-sans select-none">TTS Speed:</span>
                  <select
                    value={ttsSpeed}
                    onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                    className="text-[9px] font-bold text-teal-dark bg-transparent border-none outline-none focus:ring-0 cursor-pointer"
                  >
                    <option value="0.7">0.7x (Slow)</option>
                    <option value="0.9">0.9x (Normal)</option>
                    <option value="1.1">1.1x (Fast)</option>
                  </select>
                </div>

                {/* TTS Friendly Voice Persona selector */}
                {voices.length > 0 && (
                  <div className="flex items-center gap-1 bg-white border border-black/[0.06] px-2 py-1 rounded-xl shrink-0">
                    <span className="text-[9px] font-bold text-secondary font-sans select-none">Voice:</span>
                    <select
                      value={selectedVoiceURI}
                      onChange={(e) => setSelectedVoiceURI(e.target.value)}
                      className="text-[9px] font-bold text-teal-dark bg-transparent border-none outline-none focus:ring-0 cursor-pointer max-w-[125px] truncate"
                    >
                      {voices.map((v) => {
                        let displayName = v.name;
                        // Make Microsoft and Google labels look clean & compact
                        if (displayName.includes("Microsoft")) {
                          displayName = displayName.replace("Microsoft", "MS").replace("Desktop", "");
                        }
                        if (displayName.includes("Google")) {
                          displayName = displayName.replace("Google", "Goog");
                        }
                        return (
                          <option key={v.voiceURI} value={v.voiceURI} title={v.name}>
                            {displayName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* Global Speech Stop Button if speaking */}
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all animate-pulse cursor-pointer shrink-0"
                    title="Stop text-to-speech reader"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Resource Stage Canvas */}
            <div className="min-h-[420px] relative z-10">
              <AnimatePresence mode="wait">
                
                {/* TAB: Interactive Slides */}
                {activeTab === "slides" && (
                  <motion.div
                    key="tab-slides-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 animate-fade-in"
                  >
                    <InteractiveSlideshow 
                      slides={lesson.slides} 
                      dyslexiaMode={dyslexiaMode}
                      antiGlare={antiGlare}
                      readingRuler={readingRuler}
                      bionicReading={bionicReading}
                      ttsSpeed={ttsSpeed}
                      speakText={speakText}
                      stopSpeaking={stopSpeaking}
                      isSpeaking={isSpeaking}
                      formatBionicText={formatBionicText}
                      selectedStyle={selectedStyle}
                      onStyleChange={handleStyleSelect}
                    />

                    {/* Scientific learning pillars */}
                    <div className={`border rounded-2xl p-5 space-y-4 transition-all duration-300 ${
                      isLightBackground 
                        ? antiGlare === "cream"
                          ? "bg-[#FAF3E3]/40 border-[#E8DCC4]"
                          : antiGlare === "mint"
                            ? "bg-[#E6F4F1]/40 border-[#C8E4DD]"
                            : "bg-[#FAF0E6]/40 border-[#E6D5C3]"
                        : "bg-surface-0/60 border border-black/[0.06]"
                    }`}>
                      <div className="flex items-center gap-2.5 border-b border-black/[0.05] pb-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-light flex items-center justify-center text-teal-brand border border-teal-brand/10">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-teal-dark uppercase font-sans">Curriculum Core Pillars</h4>
                          <p className="text-[10px] text-secondary font-sans leading-none">Key Student Knowledge Deliverables</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {lesson.keyTakeaways.map((takeaway, idx) => (
                          <div 
                            key={idx} 
                            className={`flex gap-2.5 items-start p-3 rounded-xl border transition-all duration-300 ${
                              isLightBackground
                                ? "bg-white border-black/[0.04]"
                                : "bg-white border border-black/[0.04]"
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-teal-light flex items-center justify-center shrink-0 text-teal-brand font-bold text-[10px] mt-0.5">
                              {idx + 1}
                            </span>
                            <span className={`text-xs leading-relaxed ${dyslexiaMode ? "dyslexia-mode-styles text-slate-800" : "font-sans font-medium text-secondary"}`}>
                              {bionicReading ? formatBionicText(takeaway) : takeaway}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}




                {/* TAB 4: Jeopardy Game Quiz */}
                {activeTab === "quiz" && (
                  <motion.div
                    key="tab-quiz-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 animate-fade-in"
                  >
                    <div 
                      ref={quizRulerRef}
                      onMouseMove={handleQuizMouseMove}
                      className={`relative overflow-hidden border rounded-3xl shadow-lg min-h-[420px] flex flex-col justify-between p-6 sm:p-8 transition-all duration-300 ${
                        isLightBackground 
                          ? antiGlare === "cream"
                            ? "bg-[#FAF3E3] border-[#E8DCC4] text-[#433422]"
                            : antiGlare === "mint"
                              ? "bg-[#E6F4F1] border-[#C8E4DD] text-[#133835]"
                              : "bg-[#FAF0E6] border-[#E6D5C3] text-[#4A2E1B]"
                          : "bg-teal-dark text-white border-teal-brand/10"
                      }`}
                    >
                      {/* Anti-glare and dyslexia focus guide rulers */}
                      {readingRuler && (
                        <div 
                          className={`absolute left-0 right-0 h-11 pointer-events-none transition-all duration-75 z-30 border-y ${
                            isLightBackground 
                              ? "bg-amber-400/25 border-amber-500/40 mix-blend-multiply" 
                              : "bg-white/10 border-white/20 mix-blend-screen"
                          }`}
                          style={{ top: `${quizRulerTop - 22}px` }}
                        />
                      )}

                      {/* Header */}
                      <div className={`flex justify-between items-center border-b pb-4 mb-4 z-10 ${isLightBackground ? "border-black/5" : "border-white/[0.08]"}`}>
                        <div>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${isLightBackground ? "text-teal-800" : "text-teal-brand"}`}>
                            CLASSROOM JEOPARDY STANDARD
                          </span>
                          <h4 className={`text-sm font-bold font-sans ${isLightBackground ? "text-teal-950" : "text-teal-light"}`}>
                            Smart Board Group Quiz
                          </h4>
                        </div>
                        <div className="flex items-center gap-3.5">
                          <span className={`text-xs font-mono ${isLightBackground ? "text-[#5a4c3a]" : "text-teal-light"}`}>
                            Score: <strong className="text-teal-brand">{quizScore}</strong> / {lesson.quiz.length}
                          </span>
                          <button
                            onClick={handleResetQuiz}
                            className={`text-[10px] font-mono border px-2.5 py-1 rounded-lg transition-all ${
                              isLightBackground 
                                ? "border-black/10 text-[#433422] hover:bg-black/5" 
                                : "border-white/[0.12] text-teal-light hover:text-white hover:border-white/[0.22]"
                            }`}
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      {/* Body Stage */}
                      <div className="flex-1 flex flex-col justify-center z-10 my-4">
                        {quizCompleted ? (
                          /* Finish Screen */
                          <div className="text-center space-y-4 max-w-sm mx-auto py-8">
                            <div className="w-16 h-16 rounded-full bg-teal-brand/10 border border-teal-brand/30 flex items-center justify-center text-teal-brand mx-auto shadow-sm animate-bounce">
                              <Award className="w-8 h-8" />
                            </div>
                            <h4 className={`text-xl font-bold ${isLightBackground ? "text-teal-950" : "text-white"}`}>
                              Outstanding, Team!
                            </h4>
                            <p className={`text-xs leading-relaxed font-sans ${isLightBackground ? "text-[#5a4c3a]" : "text-teal-light/80"}`}>
                              Your classroom finished the interactive module. You scored <strong>{quizScore} out of {lesson.quiz.length}</strong> correct answers!
                            </p>
                            <div className="pt-2">
                              <button
                                onClick={handleResetQuiz}
                                className="px-5 py-2.5 bg-teal-brand hover:bg-teal-mid text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                Play Again
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Question Block */
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <span className={`text-[10px] font-mono font-bold uppercase ${isLightBackground ? "text-teal-800" : "text-teal-brand"}`}>
                                Question {currentQuizIndex + 1} of {lesson.quiz.length}
                              </span>
                              
                              <div className="flex justify-between items-start gap-4">
                                <h4 className={`text-base sm:text-lg font-bold tracking-tight leading-relaxed ${isLightBackground ? "text-slate-900" : "text-white"} ${dyslexiaMode ? "dyslexia-mode-styles" : "font-sans"}`}>
                                  {bionicReading ? formatBionicText(lesson.quiz[currentQuizIndex].question) : lesson.quiz[currentQuizIndex].question}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => speakText(lesson.quiz[currentQuizIndex].question, ttsSpeed)}
                                  className={`p-1.5 rounded-lg transition-all ${isLightBackground ? "hover:bg-teal-950/10 text-teal-950 animate-pulse" : "hover:bg-white/10 text-teal-400"}`}
                                  title="Speak question aloud"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Option list */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              {lesson.quiz[currentQuizIndex].options.map((option, idx) => {
                                const isSelected = selectedQuizOption === idx;
                                const isCorrectAnswer = idx === lesson.quiz[currentQuizIndex].correctAnswerIndex;
                                
                                let borderClass = isLightBackground
                                  ? "border-black/5 hover:border-black/20 bg-black/5"
                                  : "border-white/[0.08] hover:border-white/[0.18] bg-black/[0.15]";
                                let textClass = isLightBackground ? "text-slate-800" : "text-teal-light";
                                let statusIcon = null;

                                if (selectedQuizOption !== null) {
                                  if (isCorrectAnswer) {
                                    borderClass = "border-teal-brand bg-teal-brand/20";
                                    textClass = isLightBackground ? "text-teal-950 font-bold" : "text-white font-bold";
                                    statusIcon = <Check className="w-4 h-4 text-teal-brand shrink-0" />;
                                  } else if (isSelected) {
                                    borderClass = "border-red-500 bg-red-950/20";
                                    textClass = "text-red-600 dark:text-red-200";
                                    statusIcon = <X className="w-4 h-4 text-red-500 shrink-0" />;
                                  } else {
                                    borderClass = "border-white/[0.04] bg-transparent opacity-35";
                                  }
                                }

                                return (
                                  <div
                                    key={idx}
                                    className={`p-3 sm:p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer group ${borderClass}`}
                                    onClick={() => {
                                      if (selectedQuizOption === null) {
                                        handleQuizOptionClick(idx);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                                        isLightBackground 
                                          ? "bg-white border-black/10 text-teal-dark" 
                                          : "bg-black/[0.25] border-white/[0.08] text-teal-light"
                                      }`}>
                                        {String.fromCharCode(65 + idx)}
                                      </div>
                                      <span className={`leading-relaxed truncate ${textClass} ${dyslexiaMode ? "dyslexia-mode-styles" : "font-sans"}`}>
                                        {bionicReading ? formatBionicText(option) : option}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      {/* Speak single option button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          speakText(`Option ${String.fromCharCode(65 + idx)}: ${option}`, ttsSpeed);
                                        }}
                                        className={`p-1 rounded opacity-40 group-hover:opacity-100 transition-all ${isLightBackground ? "hover:bg-black/5 text-slate-800" : "hover:bg-white/10 text-teal-400"}`}
                                        title="Speak option text"
                                      >
                                        <Volume2 className="w-3.5 h-3.5" />
                                      </button>
                                      {statusIcon}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Detailed explanation overlay */}
                            {showExplanation && (
                              <div className={`border rounded-xl p-4 text-xs leading-relaxed font-sans ${isLightBackground ? "bg-black/5 border-black/5 text-slate-800" : "bg-black/[0.2] border-white/[0.06] text-teal-light/90"}`}>
                                <span className="font-bold text-teal-brand block mb-1">🎯 Instructor Insight:</span>
                                {lesson.quiz[currentQuizIndex].explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Controls Footer */}
                      {!quizCompleted && (
                        <div className={`border-t pt-4 flex justify-between items-center z-10 ${isLightBackground ? "border-black/5" : "border-white/[0.08]"}`}>
                          <span className="text-[9px] text-teal-brand uppercase tracking-wider font-mono">Team Interactive Mode</span>
                          
                          <button
                            onClick={handleNextQuiz}
                            disabled={selectedQuizOption === null}
                            className={`px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                              isLightBackground 
                                ? "bg-teal-dark hover:bg-opacity-90 text-white" 
                                : "bg-white text-teal-dark hover:bg-teal-light"
                            }`}
                          >
                            <span>{currentQuizIndex === lesson.quiz.length - 1 ? "End Module" : "Next Question"}</span>
                            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}


              </AnimatePresence>
            </div>

          </div>

        </section>

        {/* Minimal professional footer */}
        <footer className="px-6 sm:px-8 pt-8 mt-auto border-t border-black/[0.05] text-center text-[10px] text-secondary font-sans leading-normal space-y-1">
          <p>© 2026 Lyra STEM - Immersive Lesson Plan Transformation Suite. All rights reserved.</p>
          <p className="text-[9px] text-secondary/75">Designed in partnership with XPRIZE Education Initiative for high-yield classroom activities.</p>
        </footer>

      </div>

      {/* Upgrade to Pro Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-black/[0.08] animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 sm:p-6">
              <Elements stripe={stripePromise}>
                <SubscriptionWall 
                  user={user} 
                  onSuccess={() => {
                    loadLessons();
                    setShowUpgradeModal(false);
                  }} 
                />
              </Elements>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
