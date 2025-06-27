import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardIcon } from './common/icons/ClipboardIcon';
import { CheckCircleIcon } from './common/icons/CheckCircleIcon';
import { DownloadIcon } from './common/icons/DownloadIcon';
import { ImageContent } from '../types';

interface ContentSegment {
  id: string;
  type: 'text' | 'code';
  content: string;
  language?: string;
}

// Helper function to parse text content into text and code segments
const parseTextContent = (text: string): ContentSegment[] => {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  // Regex to find code blocks: ```optional_language\ncode_content\n```
  const regex = /```(\w*)\n([\s\S]*?)\n```/g;
  let match;
  let idCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text segment before the code block
    if (match.index > lastIndex) {
      segments.push({
        id: `text-${idCounter++}`,
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }
    // Add the code block segment
    segments.push({
      id: `code-${idCounter++}`,
      type: 'code',
      language: match[1] || undefined, // Captured language (e.g., javascript)
      content: match[2].trim(), // Captured code content
    });
    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last code block
  if (lastIndex < text.length) {
    segments.push({
      id: `text-${idCounter++}`,
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  // If no code blocks were found and there's text, treat the whole thing as a single text segment
  if (segments.length === 0 && text.length > 0) {
    segments.push({ id: `text-${idCounter++}`, type: 'text', content: text });
  }
  
  return segments;
};


interface OutputSectionProps {
  content: string | ImageContent | null;
}

const OutputSection: React.FC<OutputSectionProps> = ({ content }) => {
  const [parsedSegments, setParsedSegments] = useState<ContentSegment[]>([]);
  const [mainCopied, setMainCopied] = useState(false);
  const [copiedCodeBlockIds, setCopiedCodeBlockIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof content === 'string') {
      setParsedSegments(parseTextContent(content));
    } else {
      // Clear segments if content is an image or null
      setParsedSegments([]);
    }
    // Reset copy states when content changes
    setMainCopied(false);
    setCopiedCodeBlockIds(new Set());
  }, [content]);

  const handleCopy = async (textToCopy: string, segmentId?: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      if (segmentId) {
        setCopiedCodeBlockIds(prev => new Set(prev).add(segmentId));
        setTimeout(() => {
          setCopiedCodeBlockIds(prev => {
            const next = new Set(prev);
            next.delete(segmentId);
            return next;
          });
        }, 2000);
      } else {
        setMainCopied(true);
        setTimeout(() => setMainCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      // TODO: Show error feedback to user
    }
  };
  
  const handleDownloadImage = (dataUrl: string, altText: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    const fileName = `${altText.substring(0, 30).replace(/\s+/g, '_') || 'generated_image'}.jpeg`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!content) {
    return null;
  }

  const isImage = typeof content === 'object' && content !== null && content.type === 'image';
  const rawTextContent = typeof content === 'string' ? content : '';

  return (
    <section className="mt-8 p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          {isImage ? 'Generated Image:' : 'Generated Content:'}
        </h2>
        {isImage && (content as ImageContent).dataUrl && (
          <button
            onClick={() => handleDownloadImage((content as ImageContent).dataUrl, (content as ImageContent).alt)}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary dark:text-primary-light bg-primary-light/20 dark:bg-primary-dark/30 hover:bg-primary-light/40 dark:hover:bg-primary-dark/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark transition-colors duration-150"
            title="Download image"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download
          </button>
        )}
        {!isImage && rawTextContent && (
          <button
            onClick={() => handleCopy(rawTextContent)}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary dark:text-primary-light bg-primary-light/20 dark:bg-primary-dark/30 hover:bg-primary-light/40 dark:hover:bg-primary-dark/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark transition-colors duration-150"
            title="Copy all text content"
          >
            {mainCopied ? (
              <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
            ) : (
              <ClipboardIcon className="w-5 h-5 mr-2" />
            )}
            {mainCopied ? 'Copied All!' : 'Copy All'}
          </button>
        )}
      </div>
      <div className="p-1 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-md max-h-[70vh] overflow-y-auto">
        {isImage ? (
          <img 
            src={(content as ImageContent).dataUrl} 
            alt={(content as ImageContent).alt} 
            className="max-w-full h-auto mx-auto rounded-md shadow-md"
            style={{ maxHeight: 'calc(70vh - 2rem)' }} 
          />
        ) : (
          parsedSegments.map((segment) => (
            <div key={segment.id}>
              {segment.type === 'text' ? (
                <div className="whitespace-pre-wrap">
                  {segment.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 text-neutral-700 dark:text-neutral-300">
                      {paragraph || <>&nbsp;</>}
                    </p>
                  ))}
                </div>
              ) : ( // segment.type === 'code'
                <div className="my-4">
                  <div className="flex justify-between items-center mb-1 px-3 py-1 bg-neutral-200 dark:bg-neutral-700 rounded-t-md">
                    <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      {segment.language || 'code'}
                    </span>
                    <button
                      onClick={() => handleCopy(segment.content, segment.id)}
                      className="flex items-center px-2 py-1 text-xs font-medium text-primary dark:text-primary-light hover:bg-primary-light/30 dark:hover:bg-primary-dark/40 rounded focus:outline-none focus:ring-1 focus:ring-primary-dark transition-colors duration-150"
                      title="Copy code snippet"
                    >
                      {copiedCodeBlockIds.has(segment.id) ? (
                        <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                      ) : (
                        <ClipboardIcon className="w-4 h-4 mr-1" />
                      )}
                      {copiedCodeBlockIds.has(segment.id) ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="p-3 bg-neutral-100 dark:bg-neutral-700/70 rounded-b-md overflow-x-auto">
                    <code className={`language-${segment.language || ''} font-mono text-sm text-neutral-800 dark:text-neutral-200`}>
                      {segment.content}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default OutputSection;
