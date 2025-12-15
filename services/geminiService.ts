import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Note: In a production environment, you should handle the case where the key is missing gracefully.
const ai = new GoogleGenAI({ apiKey });

export const describeImage = async (base64Image: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment.";
  }

  try {
    // Robustly strip the data URL prefix (supports jpeg, png, webp, gif, etc.)
    const base64Data = base64Image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg', // API typically handles detection regardless of this hint
            },
          },
          {
            text: 'Analyze this image and provide a detailed, SEO-friendly textual description of its contents. Keep it concise but descriptive.',
          },
        ],
      },
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze image. Please try again later.";
  }
};