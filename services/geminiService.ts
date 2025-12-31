
import { GoogleGenAI, Type } from "@google/genai";
import { Quest, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUEST_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      difficulty: { type: Type.STRING },
      type: { type: Type.STRING },
      points: { type: Type.NUMBER },
      localized: {
        type: Type.OBJECT,
        properties: {
          en: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              instructions: { type: Type.STRING },
            },
            required: ["title", "description", "instructions"]
          },
          sr: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              instructions: { type: Type.STRING },
            },
            required: ["title", "description", "instructions"]
          }
        },
        required: ["en", "sr"]
      },
      quizOptions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
      },
      correctAnswer: { type: Type.STRING },
    },
    required: ["id", "difficulty", "type", "points", "localized"],
  },
};

export async function generateDailyQuests(lang: Language): Promise<Quest[]> {
  const prompt = `Generate 4 creative 'Side Quests' for a mobile app. 
  
  CRITICAL: For EACH quest, you MUST provide the title, description, and instructions in BOTH English (en) AND Serbian (sr).
  
  TYPES TO MIX: QUIZ, IMAGE, TEXT, LOCATION, ONLINE_IMAGE.
  RULES:
  - For ONLINE_IMAGE: Instructions must ask user to find a specific image on the internet.
  - For QUIZ: Provide EXACTLY 3 funny options.
  - STYLE: Edgy, modern, funny. No boring trivia.
  
  Return JSON only matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: QUEST_SCHEMA,
      },
    });

    const rawQuests = JSON.parse(response.text || "[]");
    return rawQuests.map((q: any) => ({ 
      ...q, 
      id: q.id || Math.random().toString(36).substr(2, 9),
      createdAt: Date.now() 
    }));
  } catch (e) {
    console.error("Quest generation failed:", e);
    return [];
  }
}

export async function verifyQuestWithAI(
  quest: Quest, 
  proof: string, 
  type: 'IMAGE' | 'TEXT' | 'LOCATION' | 'ONLINE_IMAGE',
  lang: Language
): Promise<{ success: boolean; feedback: string }> {
  const model = 'gemini-3-flash-preview';
  const langNames: Record<Language, string> = { en: 'English', sr: 'Serbian' };
  
  // Use localized content for verification
  const content = quest.localized[lang] || quest.localized.en;

  const instructions = `You are a strict AI Quest Master. 
  QUEST TITLE: "${content.title}"
  QUEST DESC: "${content.description}"
  EXPECTED TYPE: ${type}
  
  USER LANGUAGE: ${langNames[lang]}
  YOUR FEEDBACK LANGUAGE: You MUST respond in ${langNames[lang]}.
  
  Return JSON: { "success": boolean, "feedback": "string" }`;

  const parts: any[] = [{ text: instructions }];

  if (type === 'IMAGE' || type === 'ONLINE_IMAGE') {
    parts.push({ 
      inlineData: { 
        mimeType: 'image/jpeg', 
        data: proof.includes('base64,') ? proof.split('base64,')[1] : proof 
      } 
    });
  } else {
    parts.push({ text: `User Proof Data: "${proof}"` });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
          },
          required: ["success", "feedback"]
        }
      }
    });

    return JSON.parse(response.text || '{"success":false, "feedback":"System Error"}');
  } catch (e) {
    console.error("Verification failed:", e);
    return { success: false, feedback: "AI judging failed. Try again!" };
  }
}
