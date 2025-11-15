
import { GoogleGenAI, Modality } from "@google/genai";

const model = "gemini-2.5-flash-preview-tts";

/**
 * Converts the input text into a valid SSML string.
 * It replaces custom pause syntax like [pause:1.5s] with SSML <break> tags
 * and wraps the entire text in <speak> tags.
 * @param text The input text from the user.
 * @returns A string formatted as SSML.
 */
function convertToSSML(text: string): string {
  // Regex to find [pause:NUMBERs] or [break:NUMBERs]
  const pauseRegex = /\[(pause|break):(\d*\.?\d+)s\]/gi;
  
  const textWithBreaks = text.replace(pauseRegex, (_match, _type, seconds) => {
    return `<break time="${seconds}s"/>`;
  });

  // Wrap the entire content in <speak> tags for SSML processing
  return `<speak>${textWithBreaks}</speak>`;
}


export async function generateSpeech(apiKey: string, text: string, voice: string): Promise<string | null> {
  if (!apiKey) {
    throw new Error("Gemini API Key is required.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    const ssmlText = convertToSSML(text);

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: ssmlText }] }],
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
    if (error instanceof Error && /API key not valid/i.test(error.message)) {
        throw new Error("Invalid Gemini API Key. Please check your key and try again.");
    }
    throw new Error("Failed to generate speech. Please check your API key and input, then try again.");
  }
}
