import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, User, BookOpen, Layers, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AddReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddReportCardModal: React.FC<AddReportCardModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showNotification } = useNotification();
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    marks: '',
    term: 'First Term',
    remarks: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [studentsRes, subjectsRes] = await Promise.all([
            erpService.getStudents(),
            api_get_subjects_mock() // Assuming a method exists or mocking it
          ]);
          setStudents(studentsRes.data || []);
          // Note: erpService.getSubjects might be missing, adding it to mock for now
          // or just use erpService.getClasses and extract subjects if needed
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Mocking getSubjects if not in service
  const api_get_subjects_mock = async () => {
    try {
      const res = await erpService.getClasses(); // Usually subjects are linked to classes
      // This is a placeholder, in a real app we'd have a subjects endpoint
      return { data: [{ id: '1', name: 'Mathematics' }, { id: '2', name: 'Science' }, { id: '3', name: 'English' }] };
    } catch (e) {
      return { data: [] };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await erpService.createReportCard({
        ...formData,
        marks: parseFloat(formData.marks)
      });
      onSuccess();
      onClose();
      setFormData({
        student_id: '',
        subject_id: '',
        marks: '',
        term: 'First Term',
        remarks: ''
      });
    } catch (error) {
      console.error('Error creating report card:', error);
      showNotification('Failed to record marks. Please try again.', 'error');
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
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            <div className="p-8 bg-brand-secondary text-brand-dark relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark/5 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Release Result</h2>
                <button onClick={onClose} className="p-2 hover:bg-brand-dark/10 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-brand-dark/60 text-sm relative z-10">Enter academic marks for student performance tracking.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-brand-secondary" /> Student
                </label>
                <select 
                  required
                  value={formData.student_id}
                  onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                >
                  <option value="">Select Student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <BookOpen size={16} className="text-brand-secondary" /> Subject
                  </label>
                  <select 
                    required
                    value={formData.subject_id}
                    onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                  >
                    <option value="">Select Subject...</option>
                    <option value="1">Mathematics</option>
                    <option value="2">Science</option>
                    <option value="3">English</option>
                    <option value="4">History</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Award size={16} className="text-brand-secondary" /> Marks (Out of 100)
                  </label>
                  <input 
                    type="number" 
                    max="100"
                    min="0"
                    required
                    value={formData.marks}
                    onChange={(e) => setFormData({...formData, marks: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
                    placeholder="e.g. 85"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Layers size={16} className="text-brand-secondary" /> Academic Term
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['First Term', 'Final Term'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setFormData({...formData, term})}
                      className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                        formData.term === term 
                          ? 'border-brand-secondary bg-brand-secondary/5 text-brand-dark' 
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Teacher's Remarks</label>
                <textarea 
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all resize-none"
                  placeholder="e.g. Excellent performance in algebra."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton 
                  className="flex-1 bg-brand-secondary text-brand-dark hover:bg-brand-secondary/90" 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Releasing...' : 'Release Result'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
