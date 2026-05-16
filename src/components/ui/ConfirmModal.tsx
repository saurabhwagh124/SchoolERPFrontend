import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { StarButton } from './StarButton';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }} 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className={`
                  shrink-0 p-3 rounded-2xl
                  ${variant === 'danger' ? 'bg-rose-50 text-rose-500' : 
                    variant === 'warning' ? 'bg-amber-50 text-amber-500' : 
                    'bg-blue-50 text-blue-500'}
                `}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">{title}</h3>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">{message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <StarButton 
                  variant="outline" 
                  className="flex-1" 
                  onClick={onCancel}
                >
                  {cancelLabel}
                </StarButton>
                <StarButton 
                  variant="primary" 
                  className={`flex-1 ${
                    variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' : 
                    variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : ''
                  }`}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </StarButton>
              </div>
            </div>
            
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
