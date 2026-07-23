export interface SlideStyle {
  id: string;
  label: string;
  desc: string;
  fontClass: string;
  fontFamily: string;
  bgClass: string;
  headerColor: string;
  pointColor: string;
  bulletClass: string;
  borderClass: string;
  badgeClass: string;
  previewDots: string[];
}

export const SLIDE_STYLES: SlideStyle[] = [
  {
    id: "Modern STEM",
    label: "Modern STEM",
    desc: "Clean Slate & Teal Gradient",
    fontClass: "font-sans",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    bgClass: "bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white border-slate-800",
    headerColor: "text-teal-300",
    pointColor: "text-slate-100",
    bulletClass: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    borderClass: "border-slate-800",
    badgeClass: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    previewDots: ["#0f766e", "#14b8a6", "#0284c7"]
  },
  {
    id: "Playful Storybook",
    label: "Playful Storybook",
    desc: "Warm Cream & Pastel Cards",
    fontClass: "font-['Comic_Neue']",
    fontFamily: "'Comic Neue', cursive, sans-serif",
    bgClass: "bg-[#fefaf3] text-[#2c221e] border-[#f3e3d3] shadow-md",
    headerColor: "text-[#d97706]",
    pointColor: "text-[#3b2d28] font-bold",
    bulletClass: "bg-amber-500 text-white border-amber-600/20 shadow-xs",
    borderClass: "border-[#f0e0d0]",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    previewDots: ["#f59e0b", "#f97316", "#10b981"]
  },
  {
    id: "Space Cyber",
    label: "Space Cyber",
    desc: "Midnight Dark & Neon Cyan",
    fontClass: "font-['Space_Grotesk']",
    fontFamily: "'Space Grotesk', sans-serif",
    bgClass: "bg-[#080b18] text-cyan-50 border-purple-900/60 shadow-[0_0_25px_rgba(168,85,247,0.15)]",
    headerColor: "text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]",
    pointColor: "text-slate-100",
    bulletClass: "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]",
    borderClass: "border-purple-900/40",
    badgeClass: "bg-purple-950/80 text-cyan-300 border-cyan-500/40",
    previewDots: ["#080b18", "#22d3ee", "#a855f7"]
  },
  {
    id: "Chalkboard",
    label: "Vibrant Chalkboard",
    desc: "Classic Green Slate & Chalk",
    fontClass: "font-['Comic_Neue']",
    fontFamily: "'Comic Neue', cursive, sans-serif",
    bgClass: "bg-[#162a1e] text-emerald-50 border-emerald-900/80 shadow-2xl",
    headerColor: "text-yellow-300 font-bold",
    pointColor: "text-emerald-100 font-medium",
    bulletClass: "bg-lime-400 text-slate-950 border-lime-300 font-extrabold",
    borderClass: "border-emerald-800/60",
    badgeClass: "bg-emerald-900/90 text-yellow-300 border-emerald-700",
    previewDots: ["#162a1e", "#fde047", "#a3e635"]
  },
  {
    id: "Technical Blueprint",
    label: "Technical Blueprint",
    desc: "Engineering Navy & Grid",
    fontClass: "font-mono",
    fontFamily: "'Fira Code', monospace",
    bgClass: "bg-[#0a192f] text-sky-100 border-sky-800/60 [background-image:linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:20px_20px]",
    headerColor: "text-sky-300 uppercase font-bold tracking-wider",
    pointColor: "text-slate-100",
    bulletClass: "bg-orange-500 text-slate-950 border-orange-400 font-bold",
    borderClass: "border-sky-800/50",
    badgeClass: "bg-sky-950/90 text-orange-400 border-orange-500/40",
    previewDots: ["#0a192f", "#38bdf8", "#f97316"]
  },
  {
    id: "Botanical Nature",
    label: "Botanical Nature",
    desc: "Warm Sage & Earth Science",
    fontClass: "font-['Outfit']",
    fontFamily: "'Outfit', sans-serif",
    bgClass: "bg-[#edf3ee] text-[#1c3325] border-[#cbe0d0] shadow-xs",
    headerColor: "text-[#15803d]",
    pointColor: "text-[#1c3325] font-semibold",
    bulletClass: "bg-emerald-700 text-white border-emerald-800/20",
    borderClass: "border-[#d5e5d8]",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    previewDots: ["#edf3ee", "#15803d", "#d97706"]
  }
];
