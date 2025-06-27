export enum GenerationMode {
  BlogPost = "Blog Post",
  Rewrite = "Rewrite Text",
  Summarize = "Summarize Content",
  SEOContent = "SEO Optimized Content",
  GenerateImage = "Generate Image",
}

export enum WritingTone {
  Default = "Default",
  Friendly = "Friendly",
  Formal = "Formal",
  Professional = "Professional",
  Casual = "Casual",
  Academic = "Academic",
}

export interface OptionType {
  value: string;
  label: string;
}

// Specific type for image content
export interface ImageContent {
  type: 'image';
  dataUrl: string;
  alt: string;
}
