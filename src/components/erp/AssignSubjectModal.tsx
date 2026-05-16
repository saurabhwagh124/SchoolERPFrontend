import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, UserCheck, Loader2, Plus, AlertCircle } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AssignSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId: string;
  className: string;
}

export const AssignSubjectModal: React.FC<AssignSubjectModalProps> = ({ isOpen, onClose, onSuccess, classId, className }) => {
  const { showNotification } = useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    subject_id: '',
    teacher_id: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [subRes, teachRes] = await Promise.all([
            erpService.getSubjects(),
            erpService.getTeachers()
          ]);
          setSubjects(subRes.data || []);
          setTeachers(teachRes.data || []);
        } catch (error) {
          console.error('Error fetching assignment data:', error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject_id) return;
    
    setSubmitting(true);
    try {
      await erpService.mapSubjectToClass({
        class_id: classId,
        subject_id: formData.subject_id,
        teacher_id: formData.teacher_id || undefined
      });
      showNotification('Subject assigned successfully!', 'success');
      onSuccess();
      onClose();
      setFormData({ subject_id: '', teacher_id: '' });
    } catch (error) {
      console.error('Error assigning subject:', error);
      showNotification('Failed to assign subject. It might already be assigned to this class.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
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
                <h2 className="text-2xl font-bold font-heading">Assign Subject</h2>
                <button onClick={onClose} className="p-2 hover:bg-brand-dark/10 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-brand-dark/60 text-sm relative z-10">Assign a subject and teacher to <span className="font-bold text-brand-dark">{className}</span>.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <BookOpen size={16} className="text-brand-secondary" /> Select Subject
                </label>
                <select 
                  required
                  value={formData.subject_id}
                  onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                >
                  <option value="">Select a Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <UserCheck size={16} className="text-brand-secondary" /> Subject Teacher (Optional)
                </label>
                <select 
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                >
                  <option value="">Select a Teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Assigning a subject will automatically add it to the class schedule overview.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton 
                  className="flex-1 bg-brand-secondary text-brand-dark hover:bg-brand-secondary/90 shadow-lg shadow-brand-secondary/20 font-bold" 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Assigning...' : 'Assign Now'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
