import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Phone, MapPin, GraduationCap, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Password123!', // Default password for new students
    class_id: '',
    phone: '',
    address: '',
    gender: 'male',
    date_of_birth: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchClasses = async () => {
        setLoading(true);
        try {
          const response = await erpService.getClasses();
          setClasses(response.data || []);
        } catch (error) {
          console.error('Error fetching classes:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchClasses();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Assuming authService.register handles student enrollment
      // For now, we'll mock the enrollment or use a new endpoint if available
      await erpService.createClass({ ...formData, role: 'student' }); // Using generic create for now
      onSuccess();
      onClose();
      setFormData({
        name: '',
        email: '',
        password: 'Password123!',
        class_id: '',
        phone: '',
        address: '',
        gender: 'male',
        date_of_birth: ''
      });
    } catch (error) {
      console.error('Error enrolling student:', error);
      alert('Failed to enroll student. Please try again.');
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
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
          >
            <div className="p-8 bg-brand-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Enroll New Student</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-white/70 text-sm relative z-10">Register a new student into the school management system.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personal Details</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      placeholder="student@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">DOB</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Academic & Contact</h3>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Assign Class</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                      required
                      value={formData.class_id}
                      onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    >
                      <option value="">Select Class...</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name} {cls.section}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                    <textarea 
                      rows={3}
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"
                      placeholder="Full residential address..."
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4 border-t border-slate-100">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton variant="primary" type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Enrolling...' : 'Complete Enrollment'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
