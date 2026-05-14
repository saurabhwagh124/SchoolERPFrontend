import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Users, Hash, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    capacity: '40'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await erpService.createClass({
        ...formData,
        capacity: parseInt(formData.capacity)
      });
      onSuccess();
      onClose();
      setFormData({ name: '', section: '', capacity: '40' });
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class. Please try again.');
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
            <div className="p-8 bg-brand-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Add New Class</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-white/70 text-sm relative z-10">Create a new academic class and section.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Layers size={16} className="text-brand-primary" /> Class Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                  placeholder="e.g. 10th Standard"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Hash size={16} className="text-brand-primary" /> Section
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="e.g. A"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Users size={16} className="text-brand-primary" /> Capacity
                  </label>
                  <input 
                    type="number" 
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="40"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton variant="primary" type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Creating...' : 'Create Class'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
