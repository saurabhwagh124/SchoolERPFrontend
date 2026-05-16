import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { CheckCircle2, User, Book, FileUp, Loader2, X } from 'lucide-react';
import { admissionService } from '../../services/admissionService';

import { useNotification } from '../../components/ui/Notification';

export const AdmissionsPage = () => {
  const { showNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    gender: '',
    grade: '',
    previousSchool: '',
    parentName: '',
    email: '',
    phone: '',
    address: '',
    aadhaarCard: null as File | null,
    birthCertificate: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const birthCertRef = useRef<HTMLInputElement>(null);
  const aadhaarRef = useRef<HTMLInputElement>(null);

  const Label = ({ children, required, field }: { children: string, required?: boolean, field: string }) => (
    <div className="flex justify-between items-center mb-1">
      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
        {children}
        {required && <span className="text-[10px] text-brand-primary font-bold opacity-60 uppercase tracking-tighter">Required</span>}
      </label>
      {fieldErrors[field] && (
        <motion.span 
          initial={{ opacity: 0, x: 5 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="text-[10px] font-bold text-rose-500 uppercase"
        >
          {fieldErrors[field]}
        </motion.span>
      )}
    </div>
  );
  const validateStep = () => {
    const errors: { [key: string]: string } = {};
    
    if (step === 1) {
      if (!formData.studentName.trim()) errors.studentName = 'Full name is required';
      if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) errors.gender = 'Gender is required';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) errors.email = 'Email address is required';
      else if (!emailRegex.test(formData.email)) errors.email = 'Invalid email format';
      
      if (!formData.parentName.trim()) errors.parentName = 'Parent name is required';
      
      if (!formData.phone) errors.phone = 'Phone number is required';
      else if (formData.phone.length !== 10) errors.phone = 'Must be 10 digits';
      
      if (!formData.address.trim()) errors.address = 'Address is required';
    } else if (step === 2) {
      if (!formData.grade) errors.grade = 'Please select a grade';
      if (!formData.previousSchool.trim()) errors.previousSchool = 'Previous school is required';
    } else if (step === 3) {
      if (!formData.birthCertificate) errors.birthCertificate = 'Document required';
      if (!formData.aadhaarCard) errors.aadhaarCard = 'Aadhaar required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setFieldErrors({});
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setFieldErrors({});
    setStep(s => s - 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'birthCertificate' | 'aadhaarCard') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size exceeds 5MB limit.', 'error');
        return;
      }
      setFormData(prev => ({ ...prev, [field]: file }));
      if (fieldErrors[field]) {
        setFieldErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const removeFile = (e: React.MouseEvent, field: 'birthCertificate' | 'aadhaarCard') => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, [field]: null }));
    if (field === 'birthCertificate' && birthCertRef.current) birthCertRef.current.value = '';
    if (field === 'aadhaarCard' && aadhaarRef.current) aadhaarRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    setSubmitError(null);

    try {
      const data = new FormData();
      data.append('name', formData.studentName);
      data.append('email', formData.email);
      data.append('date_of_birth', formData.dateOfBirth);
      data.append('gender', formData.gender);
      data.append('contact_number', formData.phone);
      data.append('address', formData.address || 'N/A');
      data.append('parent_name', formData.parentName);
      data.append('grade_applied', formData.grade);
      data.append('previous_school', formData.previousSchool);
      
      if (formData.birthCertificate) {
        data.append('birthCertificate', formData.birthCertificate);
      }
      if (formData.aadhaarCard) {
        data.append('aadhaarCard', formData.aadhaarCard);
      }

      await admissionService.submitAdmission(data);
      nextStep();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { name: 'Personal', icon: <User className="w-5 h-5" /> },
    { name: 'Academic', icon: <Book className="w-5 h-5" /> },
    { name: 'Documents', icon: <FileUp className="w-5 h-5" /> },
    { name: 'Success', icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  return (
    <div className="pt-40 pb-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">Admissions 2026</h1>
          <p className="font-body text-slate-600">Join our community of young stars. Complete the form below to apply.</p>
        </div>

        {/* Progress Stepper */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 -z-10" />
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= i + 1 ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                {s.icon}
              </div>
              <span className={`text-sm font-medium ${step >= i + 1 ? 'text-brand-primary' : 'text-slate-400'}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        <GlassCard className="bg-white border-none shadow-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">Personal Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <Label required field="studentName">Student Full Name</Label>
                    <input
                      type="text"
                      className={`p-3 h-[50px] border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all ${fieldErrors.studentName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      placeholder="John Doe"
                      value={formData.studentName}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        setFormData({ ...formData, studentName: val });
                        if (fieldErrors.studentName) setFieldErrors({ ...fieldErrors, studentName: '' });
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label required field="dateOfBirth">Date of Birth</Label>
                    <input
                      type="date"
                      className={`p-3 h-[50px] border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all ${fieldErrors.dateOfBirth ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      value={formData.dateOfBirth}
                      onChange={(e) => {
                        setFormData({ ...formData, dateOfBirth: e.target.value });
                        if (fieldErrors.dateOfBirth) setFieldErrors({ ...fieldErrors, dateOfBirth: '' });
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label required field="gender">Gender</Label>
                    <select
                      className={`p-3 h-[50px] border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none bg-white transition-all ${fieldErrors.gender ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      value={formData.gender}
                      onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value });
                        if (fieldErrors.gender) setFieldErrors({ ...fieldErrors, gender: '' });
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <Label required field="email">Email Address</Label>
                    <input
                      type="email"
                      className={`p-3 h-[50px] border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all ${fieldErrors.email ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label required field="parentName">Parent/Guardian Name</Label>
                    <input
                      type="text"
                      className={`p-3 h-[50px] border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all ${fieldErrors.parentName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      placeholder="Jane Doe"
                      value={formData.parentName}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        setFormData({ ...formData, parentName: val });
                        if (fieldErrors.parentName) setFieldErrors({ ...fieldErrors, parentName: '' });
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label required field="phone">Phone Number</Label>
                    <input
                      type="tel"
                      className={`p-3 h-[50px] border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all ${fieldErrors.phone ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      placeholder="10 digit number"
                      value={formData.phone}
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: val });
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                      }}
                    />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <Label required field="address">Residential Address</Label>
                    <textarea
                      rows={3}
                      className={`p-3 border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none resize-none transition-all ${fieldErrors.address ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      placeholder="Street, City, State, ZIP"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (fieldErrors.address) setFieldErrors({ ...fieldErrors, address: '' });
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-6">
                  <StarButton variant="primary" onClick={nextStep}>Next: Academic Details</StarButton>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">Academic Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <Label required field="grade">Grade Applying For</Label>
                    <select
                      className={`p-3 h-[50px] border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none bg-white transition-all ${fieldErrors.grade ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      value={formData.grade}
                      onChange={(e) => {
                        setFormData({ ...formData, grade: e.target.value });
                        if (fieldErrors.grade) setFieldErrors({ ...fieldErrors, grade: '' });
                      }}
                    >
                      <option value="">Select Grade</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <Label required field="previousSchool">Previous School Attended</Label>
                    <input
                      type="text"
                      className={`p-3 h-[50px] border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all ${fieldErrors.previousSchool ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                      placeholder="Greenwood International"
                      value={formData.previousSchool}
                      onChange={(e) => {
                        setFormData({ ...formData, previousSchool: e.target.value });
                        if (fieldErrors.previousSchool) setFieldErrors({ ...fieldErrors, previousSchool: '' });
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-6">
                  <StarButton variant="outline" onClick={prevStep}>Previous</StarButton>
                  <StarButton variant="primary" onClick={nextStep}>Next: Documents</StarButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6">Document Upload</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label required field="birthCertificate">Birth Certificate / LC</Label>
                    <div 
                      onClick={() => birthCertRef.current?.click()}
                      className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group relative h-[200px] ${
                        formData.birthCertificate 
                          ? 'border-brand-success bg-brand-success/5' 
                          : fieldErrors.birthCertificate 
                            ? 'border-rose-300 bg-rose-50/30' 
                            : 'border-slate-200 hover:border-brand-primary'
                      }`}
                    >
                      {formData.birthCertificate ? (
                        <div className="text-center">
                          <div className="w-12 h-12 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-6 h-6 text-brand-success" />
                          </div>
                          <p className="font-bold text-slate-900 line-clamp-1 px-4">{formData.birthCertificate.name}</p>
                          <p className="text-xs text-slate-500 mt-1">Document Uploaded</p>
                          <button 
                            onClick={(e) => removeFile(e, 'birthCertificate')}
                            className="absolute top-4 right-4 p-1 bg-white shadow-sm border border-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FileUp className={`w-12 h-12 mb-4 transition-colors ${fieldErrors.birthCertificate ? 'text-rose-400' : 'text-slate-400 group-hover:text-brand-primary'}`} />
                          <p className={`font-bold ${fieldErrors.birthCertificate ? 'text-rose-600' : 'text-slate-700'}`}>Birth Cert / LC</p>
                          <p className="text-xs text-slate-500 text-center px-4">PDF, JPG or PNG (Max 5MB)</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={birthCertRef} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'birthCertificate')}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label required field="aadhaarCard">Aadhaar Card / ID</Label>
                    <div 
                      onClick={() => aadhaarRef.current?.click()}
                      className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group relative h-[200px] ${
                        formData.aadhaarCard 
                          ? 'border-brand-success bg-brand-success/5' 
                          : fieldErrors.aadhaarCard 
                            ? 'border-rose-300 bg-rose-50/30' 
                            : 'border-slate-200 hover:border-brand-primary'
                      }`}
                    >
                      {formData.aadhaarCard ? (
                        <div className="text-center">
                          <div className="w-12 h-12 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-6 h-6 text-brand-success" />
                          </div>
                          <p className="font-bold text-slate-900 line-clamp-1 px-4">{formData.aadhaarCard.name}</p>
                          <p className="text-xs text-slate-500 mt-1">Aadhaar Card Uploaded</p>
                          <button 
                            onClick={(e) => removeFile(e, 'aadhaarCard')}
                            className="absolute top-4 right-4 p-1 bg-white shadow-sm border border-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FileUp className={`w-12 h-12 mb-4 transition-colors ${fieldErrors.aadhaarCard ? 'text-rose-400' : 'text-slate-400 group-hover:text-brand-primary'}`} />
                          <p className={`font-bold ${fieldErrors.aadhaarCard ? 'text-rose-600' : 'text-slate-700'}`}>Aadhaar Card</p>
                          <p className="text-xs text-slate-500 text-center px-4">PDF, JPG or PNG (Max 5MB)</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={aadhaarRef} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'aadhaarCard')}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-6">
                  <StarButton variant="outline" onClick={prevStep} disabled={loading}>Previous</StarButton>
                  <StarButton variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                  </StarButton>
                </div>
                {submitError && <p className="text-red-500 text-sm mt-4 text-center font-bold">{submitError}</p>}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-brand-success" />
                </div>
                <h2 className="text-3xl font-bold font-heading text-slate-900 mb-2">Application Submitted!</h2>
                <p className="font-body text-slate-600 mb-8">
                  Thank you for applying to Little Star Kids Academy. Our admissions team will review your application and contact you within 3-5 business days.
                </p>
                <StarButton variant="primary" onClick={() => window.location.href = '/'}>
                  Back to Home
                </StarButton>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
};
