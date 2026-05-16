import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AssignTeacherToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId: string;
  className: string;
  currentTeacherId?: string;
}

export const AssignTeacherToClassModal: React.FC<AssignTeacherToClassModalProps> = ({ 
  isOpen, onClose, onSuccess, classId, className, currentTeacherId 
}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    class_teacher_id: currentTeacherId || ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchTeachers = async () => {
        setLoading(true);
        try {
          const response = await erpService.getTeachers();
          setTeachers(response.data || []);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTeachers();
      setFormData({ class_teacher_id: currentTeacherId || '' });
    }
  }, [isOpen, currentTeacherId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.class_teacher_id) return;

    setSubmitting(true);
    try {
      await erpService.updateClass(classId, { class_teacher_id: formData.class_teacher_id });
      showNotification('Class teacher assigned successfully!', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning class teacher:', error);
      showNotification('Failed to assign class teacher.', 'error');
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
            <div className="p-8 bg-brand-success text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Assign Class Teacher</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
              </div>
              <p className="text-white/70 text-sm relative z-10">Select the primary faculty member for <span className="font-bold">{className}</span>.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><UserCheck size={16} className="text-brand-success" /> Select Teacher</label>
                <select 
                  required 
                  value={formData.class_teacher_id} 
                  onChange={(e) => setFormData({ ...formData, class_teacher_id: e.target.value })} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-success outline-none transition-all"
                >
                  <option value="">Select a teacher...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton className="flex-1 bg-brand-success text-white hover:bg-brand-success/90 shadow-lg shadow-brand-success/20 font-bold" type="submit" disabled={submitting || loading}>
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Assigning...' : 'Set Class Teacher'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
