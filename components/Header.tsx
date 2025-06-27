
import React from 'react';
import { SunIcon } from './common/icons/SunIcon';
import { MoonIcon } from './common/icons/MoonIcon';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, isAuthenticated, onLogout }) => {
  return (
    <header className="bg-primary dark:bg-neutral-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          AI Content Writer 🤖
        </h1>
        <div className="flex items-center space-x-4">
          {isAuthenticated && onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-sm font-medium bg-secondary hover:bg-secondary-dark dark:bg-secondary-dark dark:hover:bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-primary-light dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-primary-light" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
