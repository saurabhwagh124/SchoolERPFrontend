import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Tag, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await erpService.createSubject(formData);
      onSuccess();
      onClose();
      setFormData({ name: '', code: '' });
    } catch (error) {
      console.error('Error creating subject:', error);
      alert('Failed to create subject. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
          >
            <div className="p-8 bg-brand-secondary text-brand-dark relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark/5 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Add New Subject</h2>
                <button onClick={onClose} className="p-2 hover:bg-brand-dark/10 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-brand-dark/60 text-sm relative z-10">Define a new subject for the school curriculum.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <BookOpen size={16} className="text-brand-secondary" /> Subject Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                  placeholder="e.g. Advanced Mathematics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Tag size={16} className="text-brand-secondary" /> Subject Code
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                  placeholder="e.g. MATH101"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton 
                  className="flex-1 bg-brand-secondary text-brand-dark hover:bg-brand-secondary/90 shadow-lg shadow-brand-secondary/20" 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Creating...' : 'Create Subject'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
