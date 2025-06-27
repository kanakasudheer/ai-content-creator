import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-neutral-200 dark:bg-neutral-800 text-center py-6 text-sm text-neutral-600 dark:text-neutral-400 border-t border-neutral-300 dark:border-neutral-700">
      <p>&copy; {currentYear} AI Content Writer. All rights reserved.</p>
      <p className="mt-1">Powered by Gemini API & React</p>
    </footer>
  );
};

export default Footer;