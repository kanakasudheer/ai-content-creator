import React from 'react';
import { OptionType } from '../../types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: OptionType[];
}

export const Select: React.FC<SelectProps> = ({ options, className, ...props }) => {
  return (
    <select
      {...props}
      className={`block w-full pl-3 pr-10 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light sm:text-sm bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 disabled:opacity-50 ${className || ''}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};