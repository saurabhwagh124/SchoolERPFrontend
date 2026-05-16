import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Loader2, Search } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AssignStudentToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId?: string;
  studentId?: string;
}

export const AssignStudentToClassModal: React.FC<AssignStudentToClassModalProps> = ({ 
  isOpen, onClose, onSuccess, classId: initialClassId, studentId: initialStudentId 
}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    student_id: initialStudentId || '',
    class_id: initialClassId || ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [studentsRes, classesRes] = await Promise.all([
            erpService.getStudents(),
            erpService.getClasses()
          ]);
          setStudents(studentsRes.data || []);
          setClasses(classesRes.data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      setFormData({
        student_id: initialStudentId || '',
        class_id: initialClassId || ''
      });
    }
  }, [isOpen, initialClassId, initialStudentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id || !formData.class_id) return;

    setSubmitting(true);
    try {
      await erpService.updateUser(formData.student_id, { class_id: formData.class_id });
      showNotification('Student assigned to class successfully!', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning student:', error);
      showNotification('Failed to assign student to class.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden" >
            <div className="p-8 bg-brand-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Assign Student</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
              </div>
              <p className="text-white/70 text-sm relative z-10">Link a student to a specific class section.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {!initialStudentId && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={16} className="text-brand-primary" /> Select Student</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search students..." 
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl mb-2 outline-none focus:ring-2 focus:ring-brand-primary/20"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select 
                    required 
                    value={formData.student_id} 
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                  >
                    <option value="">Select a student...</option>
                    {filteredStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>
              )}

              {!initialClassId && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={16} className="text-brand-primary" /> Select Class</label>
                  <select 
                    required 
                    value={formData.class_id} 
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                  >
                    <option value="">Select a class...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                    ))}
                  </select>
                </div>
              )}

              {initialStudentId && initialClassId && (
                <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
                  <p className="text-sm text-slate-600">Assigning the selected student to this class.</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton variant="primary" type="submit" className="flex-1" disabled={submitting || loading}>
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Assigning...' : 'Complete Assignment'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
