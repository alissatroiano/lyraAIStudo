export interface Slide {
  title: string;
  content: string[];
  visualConcept: string;
  instructorNotes: string;
}

export interface HandsOnActivity {
  title: string;
  materials: string[];
  steps: string[];
  scientificPrinciple: string;
}

export interface WorksheetQuestion {
  id: string;
  questionText: string;
  answerType: string;
  options?: string[];
  sampleAnswer: string;
}

export interface Worksheet {
  title: string;
  instructions: string;
  questions: WorksheetQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MediaRecommendation {
  resourceType: string;
  suggestedSearchQuery: string;
  whyItHelps: string;
}

export interface ScriptLine {
  visual?: string;
  character?: string;
  dialogue?: string;
}

export interface VideoConcept {
  title: string;
  duration: string;
  settingAndLore?: string;
  scenario?: string;
  characters: string[];
  script: ScriptLine[];
  takeaway: string;
  visualPromptForVeo?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GamificationBreakdown {
  targetConcept: string;
  gamingPopCultureHook: string;
  theAnalogy: string;
  groundingSources?: GroundingSource[];
}

export interface GamifiedVideoPackage {
  gamificationBreakdown: GamificationBreakdown;
  cutsceneConcept: VideoConcept;
  cartoonConcept: VideoConcept;
}

export interface ProcessedLesson {
  lessonTitle: string;
  duration: string;
  summary: string;
  keyTakeaways: string[];
  slides: Slide[];
  handsOnActivity: HandsOnActivity;
  worksheet: Worksheet;
  quiz: QuizQuestion[];
  mediaRecommendations: MediaRecommendation[];
  extractedStyleNotes?: string;
  gamifiedVideoPackage?: GamifiedVideoPackage;
}

export interface PreloadedLesson {
  id: string;
  title: string;
  topic: string;
  description: string;
  rawContent: string;
}
