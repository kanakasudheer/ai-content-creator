import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GenerationMode, WritingTone, ImageContent } from '../types';
import { GEMINI_MODEL_TEXT, GEMINI_MODEL_IMAGE } from '../constants';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable is not set.");
      throw new Error("API Key is not configured. Please set the API_KEY environment variable.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export async function generateContentWithGemini(
  userInput: string,
  mode: GenerationMode,
  tone: WritingTone
): Promise<string> {
  
  if (!userInput.trim()) {
    return "Input is empty. Please provide some text or a topic to generate content.";
  }

  const currentAi = getAiClient();
  let finalPrompt = "";

  switch (mode) {
    case GenerationMode.BlogPost:
      finalPrompt = `Generate a comprehensive and engaging blog post about the following topic: "${userInput}".`;
      break;
    case GenerationMode.Rewrite:
      finalPrompt = `Rewrite the following text to improve clarity, engagement, or style: "${userInput}".`;
      break;
    case GenerationMode.Summarize:
      finalPrompt = `Provide a concise summary of the following content: "${userInput}". Focus on the key points and main ideas.`;
      break;
    case GenerationMode.SEOContent:
      finalPrompt = `Create SEO-optimized content for the topic: "${userInput}". Include a compelling title, a meta description (around 155-160 characters), and naturally integrate relevant keywords throughout the content. The content should be informative and engaging for the target audience.`;
      break;
    default:
      // This case should ideally not be hit if GenerationMode.GenerateImage is handled separately
      console.warn("Unknown text generation mode:", mode);
      return `Error: Unsupported text generation mode selected. Mode: ${mode}`;
  }

  if (tone !== WritingTone.Default) {
    const toneStr = tone.toLowerCase();
    if (mode === GenerationMode.Rewrite) {
        finalPrompt = `Rewrite the following text in a ${toneStr} tone: "${userInput}".`;
    } else if (mode === GenerationMode.BlogPost || mode === GenerationMode.SEOContent) {
        finalPrompt += ` The writing tone should be consistently ${toneStr}.`;
    }
    else if (mode === GenerationMode.Summarize) {
        finalPrompt += ` Ensure the summary is written in a ${toneStr} tone where appropriate for the content's nature.`
    }
  }
  
  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: finalPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text content with Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            return "Error: The API key is not valid. Please check your environment configuration.";
        }
         if (error.message.includes("quota")) {
            return "Error: API quota exceeded for text generation. Please try again later or check your Gemini plan.";
        }
        return `Error generating text: ${error.message}`;
    }
    return "An unknown error occurred while generating text content. Please check the console for details.";
  }
}

export async function generateImageWithImagen(
  prompt: string
): Promise<ImageContent | string> {
  if (!prompt.trim()) {
    return "Image prompt is empty. Please describe the image you want to generate.";
  }

  const currentAi = getAiClient();
  try {
    const response = await currentAi.models.generateImages({
      model: GEMINI_MODEL_IMAGE,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }, // Defaulting to JPEG
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`; // Assuming JPEG output
      return { type: 'image', dataUrl: imageUrl, alt: prompt };
    } else {
      return "Error: Image generation did not return an image. The response might be empty or malformed.";
    }
  } catch (error) {
    console.error("Error generating image with Imagen:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        return "Error: The API key is not valid. Please check your environment configuration.";
      }
      if (error.message.includes("quota")) {
        return "Error: API quota exceeded for image generation. Please try again later or check your Gemini plan.";
      }
      if (error.message.includes("filtered")) {
        return "Error: The image prompt was filtered due to safety policies. Please try a different prompt.";
      }
      return `Error generating image: ${error.message}`;
    }
    return "An unknown error occurred while generating the image. Please check the console for details.";
  }
}


export async function generateRelatedTopics(
  originalUserPrompt: string
): Promise<string[]> {
  if (!originalUserPrompt.trim()) {
    return [];
  }

  const currentAi = getAiClient();
  const promptForRelatedTopics = `Based on the topic or query: "${originalUserPrompt}", suggest 3-5 related topics or search queries that a user might be interested in exploring next. Provide each topic on a new line, without any numbering or bullet points.`;

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: promptForRelatedTopics,
      config: { 
        temperature: 0.5, 
      }
    });
    
    const textResponse = response.text;
    if (!textResponse) return [];
    
    return textResponse.split('\n').map(topic => topic.trim()).filter(topic => topic.length > 0);

  } catch (error) {
    console.error("Error generating related topics with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate related topics: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating related topics.");
  }
}
