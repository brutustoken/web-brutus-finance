import React from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  intensity = 'medium'
}) => {
  return (
    <div className={`glitch-text glitch-${intensity} ${className}`} data-text={text}>
      {text}
    </div>
  );
};