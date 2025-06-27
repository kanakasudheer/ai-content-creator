import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => {
  return (
    <textarea
      {...props}
      className={`block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light sm:text-sm bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 disabled:opacity-50 ${className || ''}`}
    />
  );
};