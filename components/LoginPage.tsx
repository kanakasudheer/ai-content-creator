
import React, { useState } from 'react';
import { Button } from './common/Button';
import { SunIcon } from './common/icons/SunIcon';
import { MoonIcon } from './common/icons/MoonIcon';

interface LoginPageProps {
  onLogin: (username: string, passwordAttempt: string) => boolean;
  onSwitchToSignUp: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignUp, isDarkMode, toggleDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
    // On successful login, App.tsx will update currentUser and re-render
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 p-4">
      <div className="absolute top-4 right-4">
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-primary-light" />
            )}
          </button>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-neutral-800 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-neutral-800 dark:text-neutral-100">
          AI Content Writer Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="login-username" 
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light sm:text-sm bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              autoComplete="username"
            />
          </div>
          <div>
            <label 
              htmlFor="login-password" 
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light sm:text-sm bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div>
            <Button
              type="submit"
              className="w-full flex justify-center bg-primary hover:bg-primary-dark focus:ring-primary-light text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              Login
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
                Don't have an account?{' '}
                <button 
                    type="button" 
                    className="font-medium text-primary dark:text-primary-light hover:underline focus:outline-none"
                    onClick={onSwitchToSignUp}
                >
                    Sign Up
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
