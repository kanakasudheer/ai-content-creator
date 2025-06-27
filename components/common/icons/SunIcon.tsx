
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const SunIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25c0 1.242.938 2.143 2.063 2.353M12 12a2.25 2.25 0 012.25 2.25c0 1.242-.938 2.143-2.063 2.353M12 12a2.25 2.25 0 00-2.25-2.25c0-1.242.938-2.143 2.063-2.353M12 12a2.25 2.25 0 012.25-2.25c0-1.242-.938-2.143-2.063-2.353M12 12a2.25 2.25 0 000 4.5M12 12a2.25 2.25 0 010 4.5"
    />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v.01M12 21v-.01M4.22 4.22l.01.01M19.78 19.78l.01.01M3 12h.01M21 12h-.01M4.22 19.78l.01-.01M19.78 4.22l.01.01" /> {/* Dots for sun rays */}
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" /> {/* Center circle */}
  </svg>
);
