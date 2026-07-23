import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type, GenerateVideosOperation } from "@google/genai";
import { createServer as createViteServer } from "vite";
// @ts-ignore
import mammoth from "mammoth";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Stripe Client lazily
let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe | null {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      stripeClient = new Stripe(key, {
        apiVersion: "2023-10-16" as any,
      });
    }
  }
  return stripeClient;
}

app.use(express.json({ limit: "50mb" }));

// Log incoming requests for debugging API issues
app.use((req, res, next) => {
  console.log(`[Express Server] ${req.method} ${req.url}`);
  next();
});

// Initialize Gemini Client safely
// Set User-Agent as 'aistudio-build' for telemetry
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined. AI features will be unavailable.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
}

// API endpoint to extract text from pdf or docx files
app.post("/api/extract-text", async (req, res) => {
  const { fileBase64, fileName } = req.body;

  if (!fileBase64 || typeof fileBase64 !== "string") {
    return res.status(400).json({ error: "fileBase64 string is required" });
  }

  const extension = fileName?.split(".").pop()?.toLowerCase() || "";

  try {
    const buffer = Buffer.from(fileBase64, "base64");
    let extractedText = "";

    if (extension === "pdf") {
      if (!ai) {
        throw new Error("Gemini API client is not initialized.");
      }
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: fileBase64,
            },
          },
          "Extract all educational, structured, and scientific text from this PDF document. Retain math equations, science concepts, experiments, and lesson structures. Return only the plain extracted text.",
        ],
      });
      extractedText = response.text || "";
    } else if (extension === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else {
      return res.status(400).json({ error: `Unsupported file extension: .${extension}` });
    }

    res.json({ text: extractedText });
  } catch (error: any) {
    console.error("Error extracting document text:", error);
    res.status(500).json({
      error: "Failed to extract text from document.",
      details: error?.message || String(error),
    });
  }
});

// API endpoint to process lesson plan using Gemini
app.post("/api/process-lesson", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API client is not initialized. Please ensure GEMINI_API_KEY is configured in your secrets.",
    });
  }

  const { lessonContent, customPreferences } = req.body;

  if (!lessonContent || typeof lessonContent !== "string") {
    return res.status(400).json({ error: "lessonContent string is required" });
  }

  try {
    const systemInstruction = `You are an expert STEM Curriculum Developer and Instructional Designer. 
Your job is to take raw, verbose, long, or wordy lesson plans (or simple descriptions of topics) and transform them into an IMMERSIVE, highly interactive, and visually engaging gamified lesson experience tailored specifically for differently-abled, neurodiverse, and dyslexic students (ages 6-14).

Core requirements for your response:
1. DYSLEXIA-OPTIMIZED CONDENSING: Break down dry, verbose paragraphs into short, highly scannable, and actionable bullet points. Avoid passive voice, double negatives, or complex visual descriptions.
2. PHONETIC SPELLING DECODING: Whenever a complex scientific or technical vocabulary term is introduced (e.g., solenoid, propulsion, electromagnetism, friction, kinetic), always append its phonetic breakdown in square brackets immediately after it (e.g. "solenoid [SOL-eh-noyd]", "propulsion [pro-PUL-shun]") to aid dyslexic students in phonetic decoding and reading fluency.
3. ENGAGE: Design an elegant slide deck outline where each slide has a clear visual concept, bulleted core insights, and teacher tips (notes on how to explain it).
4. ASSESS & GAMIFY: Generate an interactive, child-friendly gamified worksheet and a fun multi-question quiz (classroom jeopardy style) that uses active, clear phrasing.
5. DEMONSTRATE: Create an exciting, safe, and highly visual hands-on scientific demonstration or experiment that instructors can easily run with common materials.
6. RESOLVE: Provide suggestions to resolve potentially broken links in the original document by suggesting precise YouTube/Google search queries.
7. ADAPT & OBSERVE: Identify the teacher's style, preferences, and classroom parameters from their custom instructions, and output a concise 'extractedStyleNotes' (e.g., "Educator prefers low-tech hands-on building challenges with structured classroom review.").

You must output a highly structured JSON object matching the defined responseSchema strictly. Do not deviate.`;

    const userPrompt = `Here is the raw lesson plan or topic to transform:
----------------------------------
${lessonContent}
----------------------------------

${customPreferences ? `Teacher's Custom Request: ${customPreferences}` : ""}

Please convert this into a comprehensive, highly interactive lesson plan with slides, worksheets, quizzes, a hands-on activity, and media backup queries.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "lessonTitle",
            "duration",
            "summary",
            "keyTakeaways",
            "slides",
            "handsOnActivity",
            "worksheet",
            "quiz",
            "mediaRecommendations",
            "extractedStyleNotes",
          ],
          properties: {
            extractedStyleNotes: {
              type: Type.STRING,
              description: "A short, one-sentence observation about this instructor's style, preferences, or technical level based on their inputs. Write in 3rd person singular/plural (e.g., 'Instructor prefers...').",
            },
            lessonTitle: {
              type: Type.STRING,
              description: "A catchy, kid-friendly STEM title for the lesson.",
            },
            duration: {
              type: Type.STRING,
              description: "Total suggested teaching time, e.g., '45-60 minutes'.",
            },
            summary: {
              type: Type.STRING,
              description: "A concise 2-3 sentence overview of what students will explore and learn.",
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 high-impact bullet points summarizing the core scientific principles.",
            },
            slides: {
              type: Type.ARRAY,
              description: "A series of 4-6 slide definitions for a presentation.",
              items: {
                type: Type.OBJECT,
                required: ["title", "content", "visualConcept", "instructorNotes"],
                properties: {
                  title: { type: Type.STRING, description: "Slide header or key question." },
                  content: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 short, kid-friendly bullets of information.",
                  },
                  visualConcept: {
                    type: Type.STRING,
                    description: "Detailed description of what diagram, simulation, or graphic should be drawn/shown on screen to represent this slide.",
                  },
                  instructorNotes: {
                    type: Type.STRING,
                    description: "Crucial guidance for the teacher on how to present this concept playfully or what questions to ask students.",
                  },
                },
              },
            },
            handsOnActivity: {
              type: Type.OBJECT,
              description: "An engaging, safe, hands-on scientific demonstration or building project.",
              required: ["title", "materials", "steps", "scientificPrinciple"],
              properties: {
                title: { type: Type.STRING, description: "Exciting name of the activity." },
                materials: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of common household/afterschool materials needed.",
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Clear, step-by-step experiment instructions for students.",
                },
                scientificPrinciple: {
                  type: Type.STRING,
                  description: "Kid-friendly scientific explanation of why the activity works (the 'Magic behind the science').",
                },
              },
            },
            worksheet: {
              type: Type.OBJECT,
              description: "A customized student worksheet to print or complete in class.",
              required: ["title", "instructions", "questions"],
              properties: {
                title: { type: Type.STRING },
                instructions: { type: Type.STRING, description: "Simple instructions for the student." },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["id", "questionText", "answerType", "sampleAnswer"],
                    properties: {
                      id: { type: Type.STRING, description: "Q1, Q2, Q3, etc." },
                      questionText: { type: Type.STRING, description: "The question or prompt." },
                      answerType: {
                        type: Type.STRING,
                        description: "E.g., 'Fill in the Blank', 'Short Answer', 'Drawing Task'.",
                      },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Options if it is multiple-choice.",
                      },
                      sampleAnswer: { type: Type.STRING, description: "The correct or expected student response." },
                    },
                  },
                },
              },
            },
            quiz: {
              type: Type.ARRAY,
              description: "A fun 4-5 question multiple-choice checking quiz for smart-board review.",
              items: {
                type: Type.OBJECT,
                required: ["question", "options", "correctAnswerIndex", "explanation"],
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 options.",
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: "0-based index of the correct answer." },
                  explanation: { type: Type.STRING, description: "Short explanation of why it is correct." },
                },
              },
            },
            mediaRecommendations: {
              type: Type.ARRAY,
              description: "Resolved backup search terms to prevent broken media link disruptions.",
              items: {
                type: Type.OBJECT,
                required: ["resourceType", "suggestedSearchQuery", "whyItHelps"],
                properties: {
                  resourceType: { type: Type.STRING, description: "E.g., 'Video Demonstration', 'Interactive Map', 'PhET Simulation'." },
                  suggestedSearchQuery: { type: Type.STRING, description: "Perfect search phrase for YouTube or Google Search." },
                  whyItHelps: { type: Type.STRING, description: "Explain what this visual shows and why it solves broken asset issues." },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini API");
    }

    const processedData = JSON.parse(text.trim());
    res.json(processedData);
  } catch (error: any) {
    console.error("Gemini processing error:", error);
    res.status(500).json({
      error: "Failed to process the lesson plan.",
      details: error?.message || String(error),
    });
  }
});

// API endpoint to generate Gamified Video Concepts with Google Search Grounding
app.post("/api/gamify-video", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API client is not initialized. Please ensure GEMINI_API_KEY is configured."
    });
  }

  const { lessonTitle, lessonContent, summary } = req.body;
  if (!lessonTitle && !lessonContent) {
    return res.status(400).json({ error: "lessonTitle or lessonContent is required" });
  }

  try {
    const systemInstruction = `You are Lyra, an AI Instructor STEM Copilot. Your mission is to transform rigid, traditional STEM lesson plans into highly engaging, gamified educational video concepts. You specialize in two specific visual styles: Video Game Cutscenes and Cartoon Animations.

For every lesson plan provided by the user, you must follow this exact three-step pipeline: Gamify, Script, and Storyboard.

1. Persona & Tone: High-energy, enthusiastic, and creative, yet educationally rigorous. Speak like a passionate game designer who happens to love science and math.
2. Real-Time Gamification Strategy: Use Google Search to find current gaming trends, popular mechanics, memes, or pop-culture cartoon tropes relevant to the lesson's target age group (e.g., Minecraft crafting, Fortnite mechanics, Roblox obbies, Zelda stamina, Pokemon, Animal Crossing).
3. Video Categories Required:
   - Category A: The Video Game Cutscene (~60-90s). AAA or indie game cinematic style. Tropes: boss battles, quest briefings, HUD overlays, Quick-Time Events (QTEs).
   - Category B: The Cartoon Animation (~60-90s). Fast-paced, humorous, slapstick physics, visual metaphors, fourth-wall breaks.

You MUST respond with a raw valid JSON object matching this schema:
{
  "gamificationBreakdown": {
    "targetConcept": "Core STEM topic name",
    "gamingPopCultureHook": "Name of game/trend researched (e.g. Minecraft, Roblox, Fortnite)",
    "theAnalogy": "Explain how the STEM mechanic works like a game mechanic in 2-3 sentences."
  },
  "cutsceneConcept": {
    "title": "Action-packed title of video game cutscene",
    "duration": "60-90s",
    "settingAndLore": "Brief game world description",
    "characters": ["CHAR1: description", "CHAR2: description"],
    "script": [
      { "visual": "[VISUAL] camera angle, action, or HUD overlay", "character": "CHARACTER NAME", "dialogue": "Spoken dialogue" }
    ],
    "takeaway": "How cutscene reinforces specific lesson objective",
    "visualPromptForVeo": "A vivid 16:9 prompt describing a key cinematic shot of this cutscene for 3D video generation"
  },
  "cartoonConcept": {
    "title": "Humorous title of cartoon episode",
    "duration": "60-90s",
    "scenario": "Funny/absurd setup",
    "characters": ["CHAR1: description", "CHAR2: description"],
    "script": [
      { "visual": "[VISUAL] cartoon comedy action or visual metaphor", "character": "CHARACTER NAME", "dialogue": "Spoken dialogue" }
    ],
    "takeaway": "How cartoon makes abstract concept concrete",
    "visualPromptForVeo": "A vivid 16:9 prompt describing a funny key scene of this cartoon for 2D animation video generation"
  }
}`;

    const promptText = `Lesson Title: ${lessonTitle || "STEM Lesson"}
Lesson Content / Context: ${lessonContent || summary || "Core STEM concept"}

Perform Google Search research for current gaming trends & cartoon tropes for kids, then output the complete Gamified Video Package JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    let data: any = {};
    try {
      data = JSON.parse(text.trim());
    } catch (e) {
      // Fallback cleanup if response wraps json in markdown code blocks
      const cleanJson = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      data = JSON.parse(cleanJson);
    }

    // Extract search grounding sources if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      const groundingSources = chunks
        .filter((c: any) => c.web?.uri && c.web?.title)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
      
      if (data.gamificationBreakdown) {
        data.gamificationBreakdown.groundingSources = groundingSources;
      }
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error generating gamified video package:", error);
    res.status(500).json({
      error: "Failed to generate gamified video package.",
      details: error?.message || String(error)
    });
  }
});

// API endpoint to initiate Veo video generation
app.post("/api/generate-video", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini client not initialized. Please ensure GEMINI_API_KEY is configured."
    });
  }
  const { prompt, aspectRatio, resolution, mode, customStyle } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  try {
    let enhancedPrompt = prompt;
    if (mode === "3d_animation") {
      enhancedPrompt = `Conceptual 3D scientific visualization, 3D animation style. ${prompt}. High clarity, detailed octane render, clean classroom presentation.`;
    } else if (mode === "cut_scene") {
      enhancedPrompt = `Cinematic video game cut scene style. ${prompt}. Dramatic camera angles, dynamic lighting, game engine cinematic, Unreal Engine 5 render style.`;
    } else if (mode === "cartoon") {
      enhancedPrompt = `Fun whimsical cartoon 2D animation style. ${prompt}. Bright friendly colors, clean lines, playful educational illustration.`;
    } else if (mode === "instructors_choice") {
      const styleName = customStyle || "Custom presentation style";
      enhancedPrompt = `${styleName}. ${prompt}. Playful and clean educational presentation.`;
    } else if (mode === "story_game") { // Fallbacks for old/loaded items if any
      enhancedPrompt = `A choice-driven educational adventure, animated story game style. ${prompt}. Professional 3D digital animation, friendly and bright classroom aesthetic.`;
    } else if (mode === "music_video") {
      enhancedPrompt = `Vibrant, highly synchronized educational music video, cartoon style. ${prompt}. Catchy motion graphics, rhythmic, clear visual beats for kids.`;
    } else if (mode === "presentation") {
      enhancedPrompt = `Conceptual 3D scientific visualization, educational classroom presentation slide background. ${prompt}. High clarity, explanatory diagram/animation style.`;
    }

    console.log(`Starting video generation for: "${enhancedPrompt}" with aspect ratio: ${aspectRatio || '16:9'}`);

    const operation = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-preview",
      prompt: enhancedPrompt,
      config: {
        numberOfVideos: 1,
        resolution: resolution || "720p",
        aspectRatio: aspectRatio || "16:9"
      }
    });

    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error("Video generation failed:", error);
    res.status(500).json({
      error: "Failed to initiate video generation.",
      details: error?.message || String(error)
    });
  }
});

// API endpoint to poll Veo video status
app.post("/api/video-status", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "Gemini client not initialized." });
  }
  const { operationName } = req.body;
  if (!operationName) {
    return res.status(400).json({ error: "operationName is required" });
  }

  try {
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({
      operation: op
    });
    res.json({
      done: updated.done,
      response: updated.response,
      error: updated.error
    });
  } catch (error: any) {
    console.error("Checking video status failed:", error);
    res.status(500).json({
      error: "Failed to fetch video status.",
      details: error?.message || String(error)
    });
  }
});

// API endpoint to download the generated video binary
app.post("/api/video-download", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "Gemini client not initialized." });
  }
  const { operationName } = req.body;
  if (!operationName) {
    return res.status(400).json({ error: "operationName is required" });
  }

  try {
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({
      operation: op
    });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(400).json({ error: "Video URI not found in operation response." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(uri, {
      headers: { "x-goog-api-key": apiKey || "" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video stream from Google servers: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "video/mp4");
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error("Video download failed:", error);
    res.status(500).json({
      error: "Failed to download generated video.",
      details: error?.message || String(error)
    });
  }
});


// API endpoint to retrieve the public Stripe publishable key
app.get("/api/stripe-config", (req, res) => {
  res.json({
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || "pk_live_51NcyntHSk9zSqYTt2S2OH75n7DKrXoTpkPTeGqZ9ndOrSAOOqGZEiLbNNKk449JQ0c2vFmWiZNeIm0o1HcdIs2qf00WRqNovyW"
  });
});

// API endpoint to create a Stripe payment intent
app.post("/api/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  const stripe = getStripeClient();
  if (!stripe) {
    console.warn("STRIPE_SECRET_KEY environment variable is not defined. Simulating checkout with a mock client secret.");
    return res.json({
      clientSecret: "mock_secret_" + Math.random().toString(36).substring(2, 15),
      isMock: true
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 2900, // Default to $29.00
      currency: currency || "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      isMock: false
    });
  } catch (error: any) {
    console.error("Failed to create Stripe payment intent:", error);
    res.status(500).json({
      error: "Failed to create payment intent.",
      details: error?.message || String(error)
    });
  }
});

// API endpoint to generate music using Lyria models
app.post("/api/generate-music", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "Gemini client not initialized. Ensure GEMINI_API_KEY is configured."
    });
  }
  const { prompt, length } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  try {
    const selectedModel = length === "pro" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";
    console.log(`Starting music generation with model: ${selectedModel}, prompt: "${prompt}"`);

    const responseStream = await ai.models.generateContentStream({
      model: selectedModel,
      contents: prompt,
      config: {
        responseModalities: ["AUDIO"]
      }
    });

    let audioBase64 = "";
    let lyrics = "";
    let mimeType = "audio/wav";

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text) {
          lyrics += part.text;
        }
      }
    }

    if (!audioBase64) {
      throw new Error("No audio content returned from Lyria model.");
    }

    res.json({
      audio: audioBase64,
      lyrics: lyrics,
      mimeType: mimeType
    });
  } catch (error: any) {
    console.error("Music generation failed:", error);
    res.status(500).json({
      error: "Failed to generate music.",
      details: error?.message || String(error)
    });
  }
});

// Configure Vite or Static Assets based on environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server is successfully listening on port ${PORT}`);
  });
}

setupServer();
