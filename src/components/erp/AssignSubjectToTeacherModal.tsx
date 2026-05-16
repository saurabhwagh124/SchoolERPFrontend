import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Layers, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AssignSubjectToTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacherId: string;
  teacherName: string;
}

export const AssignSubjectToTeacherModal: React.FC<AssignSubjectToTeacherModalProps> = ({ 
  isOpen, onClose, onSuccess, teacherId, teacherName 
}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    class_id: '',
    subject_id: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [classesRes, subjectsRes] = await Promise.all([
            erpService.getClasses(),
            erpService.getSubjects()
          ]);
          setClasses(classesRes.data || []);
          setSubjects(subjectsRes.data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      setFormData({ class_id: '', subject_id: '' });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.class_id || !formData.subject_id) return;

    setSubmitting(true);
    try {
      await erpService.mapSubjectToClass({
        class_id: formData.class_id,
        subject_id: formData.subject_id,
        teacher_id: teacherId
      });
      showNotification('Subject assigned to teacher successfully!', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning subject to teacher:', error);
      showNotification('Failed to assign subject. The subject might already be assigned in this class.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden" >
            <div className="p-8 bg-brand-secondary text-brand-dark relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark/5 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Assign Subject</h2>
                <button onClick={onClose} className="p-2 hover:bg-brand-dark/10 rounded-full transition-all"><X size={20} /></button>
              </div>
              <p className="text-brand-dark/60 text-sm relative z-10">Assign <span className="font-bold">{teacherName}</span> to teach a subject in a specific class.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Layers size={16} className="text-brand-secondary" /> Select Class</label>
                <select 
                  required 
                  value={formData.class_id} 
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                >
                  <option value="">Select a class...</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><BookOpen size={16} className="text-brand-secondary" /> Select Subject</label>
                <select 
                  required 
                  value={formData.subject_id} 
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                >
                  <option value="">Select a subject...</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton className="flex-1 bg-brand-secondary text-brand-dark hover:bg-brand-secondary/90 shadow-lg shadow-brand-secondary/20 font-bold" type="submit" disabled={submitting || loading}>
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Assigning...' : 'Assign Subject'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
