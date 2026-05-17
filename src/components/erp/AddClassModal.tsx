import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Users, Hash, Loader2, Calendar, UserCheck } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { CustomSelect } from '../ui/CustomSelect';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classToEdit?: any;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onSuccess, classToEdit }) => {
  const { showNotification } = useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    capacity: '40',
    academic_year: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
    class_teacher_id: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchTeachers = async () => {
        try {
          const response = await erpService.getTeachers();
          setTeachers(response.data || []);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        }
      };
      fetchTeachers();

      if (classToEdit) {
        setFormData({
          name: classToEdit.name || '',
          section: classToEdit.section || '',
          capacity: (classToEdit.capacity || '40').toString(),
          academic_year: classToEdit.academic_year || '',
          class_teacher_id: classToEdit.class_teacher_id || ''
        });
      } else {
        setFormData({
          name: '',
          section: '',
          capacity: '40',
          academic_year: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
          class_teacher_id: ''
        });
      }
    }
  }, [isOpen, classToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (classToEdit) {
        await erpService.updateClass(classToEdit.id, {
          ...formData,
          capacity: parseInt(formData.capacity)
        });
        showNotification('Class updated successfully!', 'success');
      } else {
        await erpService.createClass({
          ...formData,
          capacity: parseInt(formData.capacity)
        });
        showNotification('Class created successfully!', 'success');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(classToEdit ? 'Error updating class:' : 'Error creating class:', error);
      showNotification(classToEdit ? 'Failed to update class.' : 'Failed to create class.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
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
            <div className="p-8 bg-brand-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">{classToEdit ? 'Edit Class' : 'Add New Class'}</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-white/70 text-sm relative z-10">{classToEdit ? 'Update details for the academic class section.' : 'Create a new academic class and assign a class teacher.'}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <CustomSelect
                    label="Section"
                    icon={<Hash size={16} className="text-brand-primary" />}
                    value={formData.section}
                    onChange={(val) => setFormData({...formData, section: val})}
                    placeholder="Select Section"
                    options={[
                      { value: 'A', label: 'Section A' },
                      { value: 'B', label: 'Section B' },
                      { value: 'C', label: 'Section C' },
                      { value: 'D', label: 'Section D' },
                      { value: 'E', label: 'Section E' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar size={16} className="text-brand-primary" /> Academic Year
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.academic_year}
                    onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="2026-27"
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

              <div className="space-y-2">
                <CustomSelect
                  label="Class Teacher"
                  icon={<UserCheck size={16} className="text-brand-primary" />}
                  value={formData.class_teacher_id}
                  onChange={(val) => setFormData({...formData, class_teacher_id: val})}
                  placeholder="Select a Teacher"
                  options={teachers.map(t => ({ value: t.id, label: `${t.name} (${t.email})` }))}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton variant="primary" type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? (classToEdit ? 'Saving...' : 'Creating...') : (classToEdit ? 'Save Changes' : 'Create Class')}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
