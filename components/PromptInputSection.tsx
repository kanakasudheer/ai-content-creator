import React, { useMemo } from 'react';
import { GenerationMode, WritingTone, OptionType } from '../types';
import { PLACEHOLDER_PROMPTS } from '../constants';
import { TextArea } from './common/TextArea';
import { Select } from './common/Select';
import { Button } from './common/Button';
import { SparklesIcon } from './common/icons/SparklesIcon';

interface PromptInputSectionProps {
  prompt: string;
  setPrompt: (value: string) => void;
  generationMode: GenerationMode;
  setGenerationMode: (value: GenerationMode) => void;
  writingTone: WritingTone;
  setWritingTone: (value: WritingTone) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PromptInputSection: React.FC<PromptInputSectionProps> = ({
  prompt,
  setPrompt,
  generationMode,
  setGenerationMode,
  writingTone,
  setWritingTone,
  onGenerate,
  isLoading,
}) => {
  const generationModeOptions = useMemo<OptionType[]>(() =>
    Object.values(GenerationMode).map(mode => ({ value: mode, label: mode })),
    []
  );

  const writingToneOptions = useMemo<OptionType[]>(() =>
    Object.values(WritingTone).map(tone => ({ value: tone, label: tone })),
    []
  );

  const currentPlaceholder = useMemo(() => 
    PLACEHOLDER_PROMPTS[generationMode] || "Enter your topic, text, or image description here...",
    [generationMode]
  );

  const isImageMode = generationMode === GenerationMode.GenerateImage;

  return (
    <section className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-xl space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          {isImageMode ? 'Image Description:' : 'Your Topic or Text:'}
        </label>
        <TextArea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={currentPlaceholder}
          rows={isImageMode ? 4 : 8} // Fewer rows for image prompt
          disabled={isLoading}
          className="w-full text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-dark focus:border-primary-dark"
        />
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {isImageMode 
            ? "Describe the image you want to create in detail."
            : "Enter your main idea, text to transform, or topic for generation."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="generationMode" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Content Type:
          </label>
          <Select
            id="generationMode"
            value={generationMode}
            onChange={(e) => setGenerationMode(e.target.value as GenerationMode)}
            options={generationModeOptions}
            disabled={isLoading}
            className="w-full text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-dark focus:border-primary-dark"
          />
        </div>
        {!isImageMode && ( // Conditionally render Writing Tone
          <div>
            <label htmlFor="writingTone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Writing Tone:
            </label>
            <Select
              id="writingTone"
              value={writingTone}
              onChange={(e) => setWritingTone(e.target.value as WritingTone)}
              options={writingToneOptions}
              disabled={isLoading}
              className="w-full text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-dark focus:border-primary-dark"
            />
          </div>
        )}
         {isImageMode && <div aria-hidden="true"></div>} {/* Placeholder div to maintain grid structure if tone is hidden */}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onGenerate}
          disabled={isLoading || !prompt.trim()}
          className="bg-primary hover:bg-primary-dark focus:ring-primary-light text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>{isLoading ? 'Generating...' : (isImageMode ? 'Generate Image' : 'Generate Content')}</span>
        </Button>
      </div>
    </section>
  );
};

export default PromptInputSection;
