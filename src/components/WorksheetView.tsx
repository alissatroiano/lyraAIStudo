import React, { useState } from "react";
import { 
  Printer, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  HelpCircle
} from "lucide-react";
import { Worksheet } from "../types";

interface WorksheetViewProps {
  worksheet: Worksheet;
  lessonTitle: string;
  dyslexiaMode?: boolean;
  bionicReading?: boolean;
  formatBionicText?: (text: string) => React.ReactNode;
}

export default function WorksheetView({
  worksheet,
  lessonTitle,
  dyslexiaMode = false,
  bionicReading = false,
  formatBionicText
}: WorksheetViewProps) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const title = worksheet?.title || `${lessonTitle} - Student Activity Worksheet`;
  const instructions = worksheet?.instructions || "Read each question carefully and fill in your observations or answers below.";
  const questions = worksheet?.questions && worksheet.questions.length > 0 
    ? worksheet.questions 
    : [
        {
          id: "q1",
          questionText: "What forces acted upon the balloon rocket during launch?",
          answerType: "short_answer",
          sampleAnswer: "Thrust from escaping air pushed it forward, while friction from the string and air resistance pulled against it."
        },
        {
          id: "q2",
          questionText: "How did changing the volume of air inside the balloon affect the distance traveled?",
          answerType: "short_answer",
          sampleAnswer: "More air increased internal pressure and thrust duration, causing the rocket to travel further."
        },
        {
          id: "q3",
          questionText: "Which of Newton's Laws of Motion does this experiment demonstrate?",
          answerType: "multiple_choice",
          options: ["First Law (Inertia)", "Second Law (F=ma)", "Third Law (Action-Reaction)", "Law of Gravitation"],
          sampleAnswer: "Third Law (Action-Reaction)"
        }
      ];

  const handlePrint = () => {
    window.print();
  };

  const handleAnswerChange = (qId: string, val: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Action Header */}
      <div className="bg-surface-0 border border-black/[0.06] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-dark text-teal-brand flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="w-5 h-5 text-teal-brand" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-dark flex items-center gap-2">
              <span>Printable Student Worksheet</span>
              <span className="text-[10px] bg-teal-brand/10 border border-teal-brand/20 text-teal-dark font-bold px-2 py-0.5 rounded-full uppercase">
                Classroom Ready
              </span>
            </h3>
            <p className="text-xs text-secondary font-medium">
              Distribute digitally or print copies directly for students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showAnswerKey
                ? "bg-amber-100 border-amber-300 text-amber-900 shadow-2xs"
                : "bg-white hover:bg-slate-50 border-black/[0.08] text-secondary"
            }`}
          >
            {showAnswerKey ? <EyeOff className="w-4 h-4 text-amber-700" /> : <Eye className="w-4 h-4 text-teal-brand" />}
            <span>{showAnswerKey ? "Hide Answer Key" : "Teacher Answer Key"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-dark hover:bg-teal-950 text-white transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-teal-brand" />
            <span>Print Worksheet</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Area */}
      <div id="worksheet-printable-area" className="bg-surface-0 border border-black/[0.06] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Document Header */}
        <div className="border-b border-black/[0.08] pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
                STEM STUDENT WORKSHEET
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-teal-dark">
                {title}
              </h2>
            </div>
            
            {/* Student Name & Date Lines */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-mono">
              <div className="border-b border-slate-400 min-w-[140px] pb-1">
                Name: <span className="font-bold text-slate-800"></span>
              </div>
              <div className="border-b border-slate-400 min-w-[100px] pb-1">
                Date: <span className="font-bold text-slate-800"></span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-black/[0.04] p-3.5 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
            <strong>Instructions:</strong> {bionicReading && formatBionicText ? formatBionicText(instructions) : instructions}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id || idx} className="space-y-3 p-4 sm:p-5 rounded-2xl border border-black/[0.05] bg-white">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-teal-dark text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className={`text-sm font-bold text-slate-900 leading-relaxed ${dyslexiaMode ? "dyslexia-mode-styles" : ""}`}>
                  {bionicReading && formatBionicText ? formatBionicText(q.questionText) : q.questionText}
                </p>
              </div>

              {/* Options if multiple choice */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-black/[0.04]">
                      <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Student Answer Input Box */}
              <div className="pl-9 pt-1">
                <textarea
                  rows={2}
                  value={userAnswers[q.id || idx] || ""}
                  onChange={(e) => handleAnswerChange(q.id || `${idx}`, e.target.value)}
                  placeholder="Type or write student answer here..."
                  className="w-full text-xs p-3 rounded-xl border border-black/[0.08] bg-slate-50/50 focus:bg-white focus:border-teal-brand focus:outline-none transition-all resize-y"
                />
              </div>

              {/* Answer Key Reveal */}
              {showAnswerKey && q.sampleAnswer && (
                <div className="ml-9 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-0.5 animate-fade-in">
                  <span className="font-bold text-amber-800 uppercase text-[10px] block font-mono">
                    ✓ Sample Teacher Answer:
                  </span>
                  <p>{q.sampleAnswer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
