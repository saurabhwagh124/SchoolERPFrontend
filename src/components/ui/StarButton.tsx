import React from 'react';
import { motion } from 'framer-motion';

interface StarButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
}

export const StarButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button' 
}: StarButtonProps) => {
  const baseStyles = "px-8 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:bg-sky-500",
    secondary: "bg-brand-yellow text-slate-900 shadow-lg shadow-brand-yellow/30 hover:bg-yellow-400",
    outline: "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};
