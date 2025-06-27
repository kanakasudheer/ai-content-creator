import { GenerationMode, WritingTone } from './types';

export const DEFAULT_GENERATION_MODE = GenerationMode.BlogPost;
export const DEFAULT_WRITING_TONE = WritingTone.Default;

export const PLACEHOLDER_PROMPTS: { [key in GenerationMode]?: string } = {
  [GenerationMode.BlogPost]: "e.g., The future of renewable energy",
  [GenerationMode.Rewrite]: "e.g., Paste the text you want to rephrase or improve here.",
  [GenerationMode.Summarize]: "e.g., Paste a long article or document to get a concise summary.",
  [GenerationMode.SEOContent]: "e.g., Best practices for sustainable gardening in urban areas",
  [GenerationMode.GenerateImage]: "e.g., A photo of a futuristic cityscape at sunset with flying cars",
};

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002';
