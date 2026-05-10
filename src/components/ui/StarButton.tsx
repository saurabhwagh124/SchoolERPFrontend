import React from 'react';
import { motion } from 'framer-motion';

interface StarButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const StarButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false
}: StarButtonProps) => {
  const baseStyles = "px-8 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 hover:opacity-90",
    secondary: "bg-brand-secondary text-brand-dark shadow-lg shadow-brand-secondary/30 hover:opacity-90",
    outline: "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none grayscale";

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};
