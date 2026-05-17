import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, Star, Shield, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { CustomSelect } from '../ui/CustomSelect';
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
  const [assignmentMode, setAssignmentMode] = useState<'primary' | 'faculty'>('primary');
  const [formData, setFormData] = useState({
    teacher_id: ''
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
          showNotification('Failed to load teachers list', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchTeachers();
      setFormData({ teacher_id: currentTeacherId || '' });
    }
  }, [isOpen, currentTeacherId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacher_id) return;

    setSubmitting(true);
    try {
      if (assignmentMode === 'primary') {
        await erpService.updateClass(classId, { class_teacher_id: formData.teacher_id });
        showNotification('Primary Class Teacher updated successfully!', 'success');
      } else {
        await erpService.assignTeachersToClass(classId, [formData.teacher_id]);
        showNotification('Teacher added to Class Faculty successfully!', 'success');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning teacher:', error);
      showNotification('Failed to save teacher assignment.', 'error');
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
            <div className="p-8 bg-brand-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Assign Faculty</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              
              {/* Tab Selector */}
              <div className="flex bg-white/10 p-1 rounded-2xl relative z-10">
                <button
                  type="button"
                  onClick={() => setAssignmentMode('primary')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    assignmentMode === 'primary' ? 'bg-white text-brand-primary shadow-sm' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Shield size={14} /> Primary Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setAssignmentMode('faculty')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    assignmentMode === 'faculty' ? 'bg-white text-brand-primary shadow-sm' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <UserCheck size={14} /> Class Faculty
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <CustomSelect
                  label={assignmentMode === 'primary' ? 'Select Primary Class Teacher' : 'Select Faculty Teacher'}
                  icon={assignmentMode === 'primary' ? <Shield size={16} className="text-brand-primary" /> : <UserCheck size={16} className="text-brand-success" />}
                  value={formData.teacher_id}
                  onChange={(val) => setFormData({ teacher_id: val })}
                  placeholder="Select a teacher..."
                  options={teachers.map(t => ({ value: t.id, label: `${t.name} (${t.email})` }))}
                />
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  {assignmentMode === 'primary' 
                    ? 'Note: This defines the primary mentor who manages the classroom overview, reports, and attendance.'
                    : 'Note: This registers the teacher to the classroom staff list for academic scheduling.'
                  }
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton className="flex-1 bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 font-bold" type="submit" disabled={submitting || loading}>
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Assigning...' : assignmentMode === 'primary' ? 'Set Primary' : 'Add to Faculty'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
