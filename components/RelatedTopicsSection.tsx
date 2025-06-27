
import React from 'react';
import { LoadingSpinner } from './common/LoadingSpinner';

interface RelatedTopicsSectionProps {
  topics: string[];
  isLoading: boolean;
  error: string | null;
}

const RelatedTopicsSection: React.FC<RelatedTopicsSectionProps> = ({ topics, isLoading, error }) => {
  if (!isLoading && !error && topics.length === 0) {
    return null; // Don't render anything if there's nothing to show and not loading/erroring
  }

  return (
    <section className="mt-8 p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
        Related Topics:
      </h2>
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <LoadingSpinner className="w-8 h-8 text-primary" />
          <p className="ml-3 text-neutral-600 dark:text-neutral-400">Loading related topics...</p>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-md">
          <p>Could not load related topics: {error}</p>
        </div>
      )}
      {!isLoading && !error && topics.length > 0 && (
        <ul className="space-y-2 list-disc list-inside pl-2">
          {topics.map((topic, index) => (
            <li key={index} className="text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors">
              {topic}
            </li>
          ))}
        </ul>
      )}
       {!isLoading && !error && topics.length === 0 && (
        <p className="text-neutral-500 dark:text-neutral-400">No related topics found.</p>
      )}
    </section>
  );
};

export default RelatedTopicsSection;
