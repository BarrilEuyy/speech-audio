import { GoogleGenAI, Modality } from "@google/genai";

const model = "gemini-2.5-flash-preview-tts";

export async function generateSpeech(text: string, voice: string, apiKey: string): Promise<string | null> {
  if (!apiKey) {
    throw new Error("API Key is required to generate speech.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `Say cheerfully: ${text}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      console.error("No audio data in API response:", response);
      throw new Error("API response did not contain audio data.");
    }

    return base64Audio;
  } catch (error) {
    console.error("Error generating speech with Gemini API:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('permission'))) {
        throw new Error("The provided API Key is not valid. Please check it and try again.");
    }
    throw new Error("Failed to communicate with the Gemini API. Please check your API key and network connection.");
  }
}