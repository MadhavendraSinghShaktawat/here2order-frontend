import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <a href="/" className="inline-block">
      <div className={`flex items-center ${className}`}>
        <span className="text-2xl font-bold text-orange-600">Here2Order</span>
      </div>
    </a>
  );
}; 