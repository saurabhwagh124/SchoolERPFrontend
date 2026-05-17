import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Loader2, Search, Check, AlertCircle } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { CustomSelect } from '../ui/CustomSelect';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AssignStudentToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId?: string;
  studentId?: string;
  currentStudentIds?: string[];
}

export const AssignStudentToClassModal: React.FC<AssignStudentToClassModalProps> = ({ 
  isOpen, onClose, onSuccess, classId: initialClassId, studentId: initialStudentId, currentStudentIds = []
}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  
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
          showNotification('Failed to load students and classes.', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      setFormData({
        student_id: initialStudentId || '',
        class_id: initialClassId || ''
      });
      setSelectedStudentIds([]);
      setSearchTerm('');
    }
  }, [isOpen, initialClassId, initialStudentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate we have a class selected
    if (!formData.class_id) {
      showNotification('Please select a class.', 'error');
      return;
    }

    // Determine target students
    const targetStudentIds = initialStudentId ? [initialStudentId] : selectedStudentIds;
    if (targetStudentIds.length === 0) {
      showNotification('Please select at least one student to assign.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await erpService.assignStudentToClass(formData.class_id, targetStudentIds);
      showNotification(
        targetStudentIds.length === 1 
          ? 'Student assigned to class successfully!' 
          : `${targetStudentIds.length} students assigned successfully!`, 
        'success'
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning students:', error);
      showNotification('Failed to assign student(s) to class.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter out students who are already enrolled in this class
  const unassignedStudents = students.filter(s => !currentStudentIds.includes(s.id));

  // Apply search query
  const filteredStudents = unassignedStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[85vh]" >
            
            {/* Header */}
            <div className="p-8 bg-brand-primary text-white relative shrink-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Assign Students</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
              </div>
              <p className="text-white/70 text-sm relative z-10">Select one or more students to assign to this class.</p>
            </div>

            {/* Loading Overlay */}
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fetching Students...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 flex-1 flex flex-col min-h-0 space-y-6">
                
                {/* Students Checklist (when starting from a Class) */}
                {!initialStudentId && (
                  <div className="space-y-3 flex-1 flex flex-col min-h-0">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Users size={16} className="text-brand-primary" /> Select Students
                    </label>

                    {/* Search Field */}
                    <div className="relative shrink-0">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search students by name or email..." 
                        className="w-full pl-9 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Bulk Selection Header */}
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0 mt-1">
                      <span>Available ({filteredStudents.length})</span>
                      {filteredStudents.length > 0 && (
                        <button 
                          type="button" 
                          onClick={handleToggleSelectAll}
                          className="text-brand-primary hover:underline"
                        >
                          {selectedStudentIds.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                        </button>
                      )}
                    </div>

                    {/* List Box Container */}
                    <div className="flex-1 overflow-y-auto min-h-[150px] bg-slate-50 border border-slate-100 rounded-2xl p-2 space-y-1.5 scrollbar-thin">
                      {filteredStudents.map(student => {
                        const isSelected = selectedStudentIds.includes(student.id);
                        return (
                          <div 
                            key={student.id}
                            onClick={() => handleToggleStudent(student.id)}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                              isSelected 
                                ? 'bg-brand-primary/10 border-brand-primary/20 text-slate-900 shadow-sm' 
                                : 'bg-white border-transparent hover:bg-slate-100/70 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                isSelected ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {student.name[0]}
                              </div>
                              <div className="truncate max-w-[220px]">
                                <p className="text-xs font-bold leading-tight truncate">{student.name}</p>
                                <p className="text-[10px] font-semibold text-slate-400 truncate">{student.email}</p>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                              isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <div className="text-center py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
                          <AlertCircle size={24} />
                          <p className="text-xs font-medium">No available students found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Class Selection Dropdown (when starting from a Student) */}
                {!initialClassId && (
                  <div className="shrink-0">
                    <CustomSelect 
                      label="Select Class"
                      icon={<Users size={16} className="text-brand-primary" />}
                      placeholder="Choose a Class Section"
                      value={formData.class_id}
                      onChange={(val) => setFormData({ ...formData, class_id: val })}
                      options={classes.map(c => ({ value: c.id, label: `${c.name} - Section ${c.section}` }))}
                    />
                  </div>
                )}

                {/* Selection Counters Banner */}
                {!initialStudentId && selectedStudentIds.length > 0 && (
                  <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10 flex justify-between items-center shrink-0">
                    <span className="text-xs font-bold text-brand-primary">{selectedStudentIds.length} Student(s) Selected</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ready to Assign</span>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-2 shrink-0">
                  <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                  <StarButton 
                    variant="primary" 
                    type="submit" 
                    className="flex-1 font-bold" 
                    disabled={submitting || (!initialStudentId && selectedStudentIds.length === 0)}
                  >
                    {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                    {submitting ? 'Assigning...' : 'Complete Assignment'}
                  </StarButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
