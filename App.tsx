
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ContentGenerator from './components/ContentGenerator';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage'; // Import SignUpPage

// In a real app, NEVER store passwords in localStorage like this. This is for demo purposes ONLY.
interface User {
  username: string;
  passwordHash: string; // In a real app, this would be a securely hashed password. Here, for simplicity, it might be plain.
}

const APP_USERS_KEY = 'aiContentWriterUsers';
const APP_CURRENT_USER_KEY = 'aiContentWriterCurrentUser';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('darkMode');
      if (storedPreference) {
        return JSON.parse(storedPreference);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(APP_CURRENT_USER_KEY);
    }
    return null;
  });

  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const getUsers = (): User[] => {
    if (typeof window !== 'undefined') {
      const usersJson = localStorage.getItem(APP_USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    }
    return [];
  };

  const saveUsers = (users: User[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(APP_USERS_KEY, JSON.stringify(users));
    }
  };

  const handleLogin = useCallback((username: string, passwordAttempt: string): boolean => {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    // For demo, direct password comparison. In real app, compare hashed passwords.
    if (user && user.passwordHash === passwordAttempt) { 
      setCurrentUser(username);
      if (typeof window !== 'undefined') {
        localStorage.setItem(APP_CURRENT_USER_KEY, username);
      }
      return true;
    }
    return false;
  }, []);

  const handleSignUp = useCallback((username: string, passwordAttempt: string): { success: boolean; message: string } => {
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already exists.' };
    }
    // For demo, store password directly. In real app, hash it first.
    const newUser: User = { username, passwordHash: passwordAttempt };
    saveUsers([...users, newUser]);
    setAuthView('login'); // Switch to login view after successful signup
    return { success: true, message: 'Account created successfully! Please log in.' };
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(APP_CURRENT_USER_KEY);
    }
    setAuthView('login'); // Go to login screen on logout
  }, []);

  if (!currentUser) {
    return (
      <div className={`flex flex-col min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
        {authView === 'login' ? (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToSignUp={() => setAuthView('signup')}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        ) : (
          <SignUpPage
            onSignUp={handleSignUp}
            onSwitchToLogin={() => setAuthView('login')}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isAuthenticated={!!currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ContentGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default App;
