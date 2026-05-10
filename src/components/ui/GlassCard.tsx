import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = '' }: GlassCardProps) => {
  return (
    <div className={`glass rounded-3xl p-6 hover:ring-2 hover:ring-brand-primary/30 hover:shadow-[0_20px_50px_rgba(12,62,38,0.15)] transition-all duration-500 ${className}`}>
      {children}
    </div>
  );
};
