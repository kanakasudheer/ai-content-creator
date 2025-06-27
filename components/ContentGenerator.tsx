import React, { useState, useCallback } from 'react';
import { GenerationMode, WritingTone, ImageContent } from '../types';
import { generateContentWithGemini, generateImageWithImagen, generateRelatedTopics } from '../services/geminiService';
import PromptInputSection from './PromptInputSection';
import OutputSection from './OutputSection';
import RelatedTopicsSection from './RelatedTopicsSection';
import { DEFAULT_GENERATION_MODE, DEFAULT_WRITING_TONE } from '../constants';
import { LoadingSpinner } from './common/LoadingSpinner';

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>(DEFAULT_GENERATION_MODE);
  const [writingTone, setWritingTone] = useState<WritingTone>(DEFAULT_WRITING_TONE);
  
  const [generatedContent, setGeneratedContent] = useState<string | ImageContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [isLoadingRelatedTopics, setIsLoadingRelatedTopics] = useState<boolean>(false);
  const [relatedTopicsError, setRelatedTopicsError] = useState<string | null>(null);

  const fetchRelatedTopics = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt.trim() || generationMode === GenerationMode.GenerateImage) return; // Don't fetch for images
    setIsLoadingRelatedTopics(true);
    setRelatedTopicsError(null);
    setRelatedTopics([]);
    try {
      const topics = await generateRelatedTopics(currentPrompt);
      setRelatedTopics(topics);
    } catch (e: any) {
      console.error("Failed to fetch related topics:", e);
      setRelatedTopicsError(e.message || "Could not load related topics.");
    } finally {
      setIsLoadingRelatedTopics(false);
    }
  }, [generationMode]); // Added generationMode to dependencies

  const handleGenerateContent = useCallback(async () => {
    if (!prompt.trim()) {
      setError(`Please enter a topic or ${generationMode === GenerationMode.GenerateImage ? 'description' : 'text'} to generate content.`);
      setGeneratedContent(null);
      setRelatedTopics([]);
      setRelatedTopicsError(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setRelatedTopics([]);
    setRelatedTopicsError(null);
    setIsLoadingRelatedTopics(false); 

    try {
      if (generationMode === GenerationMode.GenerateImage) {
        const imageResult = await generateImageWithImagen(prompt);
        if (typeof imageResult === 'string') { // Error string returned
          setError(imageResult);
          setGeneratedContent(null);
        } else { // ImageContent object returned
          setGeneratedContent(imageResult);
        }
      } else {
        const textContent = await generateContentWithGemini(prompt, generationMode, writingTone);
        setGeneratedContent(textContent);
        if (textContent.startsWith("Error:")) {
          setError(textContent);
          setGeneratedContent(null);
        } else if (textContent) {
          fetchRelatedTopics(prompt);
        }
      }
    } catch (e: any) {
      console.error("Content generation failed:", e);
      setError(e.message || "An unexpected error occurred during generation.");
      setGeneratedContent(null);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, generationMode, writingTone, fetchRelatedTopics]);

  const showRelatedTopicsSection = 
    generationMode !== GenerationMode.GenerateImage &&
    ((generatedContent && typeof generatedContent === 'string' && !generatedContent.startsWith("Error:") && !isLoading && !error) || 
     isLoadingRelatedTopics || 
     relatedTopicsError || 
     relatedTopics.length > 0);

  return (
    <div className="space-y-8">
      <PromptInputSection
        prompt={prompt}
        setPrompt={setPrompt}
        generationMode={generationMode}
        setGenerationMode={setGenerationMode}
        writingTone={writingTone}
        setWritingTone={setWritingTone}
        onGenerate={handleGenerateContent}
        isLoading={isLoading}
      />
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner className="w-12 h-12 text-primary" />
          <p className="ml-4 text-lg text-neutral-700 dark:text-neutral-300">Generating, please wait...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
          <p className="font-semibold">Generation Failed</p>
          <p>{error}</p>
        </div>
      )}

      {generatedContent && !isLoading && !error && (
        <OutputSection content={generatedContent} />
      )}

      {showRelatedTopicsSection ? (
         <RelatedTopicsSection
            topics={relatedTopics}
            isLoading={isLoadingRelatedTopics}
            error={relatedTopicsError}
        />
      ) : null }

    </div>
  );
};

export default ContentGenerator;
