import { GoogleGenAI } from "@google/genai";

export const configureGemini = () => {
  const ai = new GoogleGenAI({
    apiKey: process.env.AI_API, 
  });
  return ai;
};
