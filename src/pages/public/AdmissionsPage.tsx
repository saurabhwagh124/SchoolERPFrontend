import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { CheckCircle2, User, Book, FileUp } from 'lucide-react';

export const AdmissionsPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    grade: '',
    previousSchool: '',
    parentName: '',
    email: '',
    phone: '',
    aadhaarCard: null as File | null,
    birthCertificate: null as File | null,
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase B, we will use FormData to send to backend API
    alert("Application submitted successfully! (Mock)");
    nextStep();
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step >= i + 1 ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {s.icon}
              </div>
              <span className={`text-sm font-medium ${step >= i + 1 ? 'text-brand-blue' : 'text-slate-400'}`}>
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
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Student Full Name</label>
                    <input 
                      type="text" 
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" 
                      placeholder="John Doe"
                      value={formData.studentName}
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Date of Birth</label>
                    <input 
                      type="date" 
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Parent/Guardian Name</label>
                    <input 
                      type="text" 
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                      placeholder="Jane Doe"
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input 
                      type="tel" 
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                      placeholder="+1 (555) 000-0000"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Grade Applying For</label>
                    <select 
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    >
                      <option value="">Select Grade</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      {/* ... other grades */}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Previous School Attended</label>
                    <input 
                      type="text" 
                      className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                      placeholder="Greenwood International"
                      onChange={(e) => setFormData({...formData, previousSchool: e.target.value})}
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
                <div className="space-y-4">
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center transition-colors hover:border-brand-blue cursor-pointer">
                    <FileUp className="w-12 h-12 text-slate-400 mb-4" />
                    <p className="font-bold text-slate-700">Upload Birth Certificate</p>
                    <p className="text-sm text-slate-500">PDF, JPG or PNG (Max 5MB)</p>
                  </div>
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center transition-colors hover:border-brand-blue cursor-pointer">
                    <FileUp className="w-12 h-12 text-slate-400 mb-4" />
                    <p className="font-bold text-slate-700">Upload Aadhaar Card / ID Proof</p>
                    <p className="text-sm text-slate-500">PDF, JPG or PNG (Max 5MB)</p>
                  </div>
                </div>
                <div className="flex justify-between pt-6">
                  <StarButton variant="outline" onClick={prevStep}>Previous</StarButton>
                  <StarButton variant="primary" onClick={handleSubmit}>Submit Application</StarButton>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-brand-green" />
                </div>
                <h2 className="text-3xl font-bold font-heading text-slate-900 mb-2">Application Submitted!</h2>
                <p className="font-body text-slate-600 mb-8">
                  Thank you for applying to Star School. Our admissions team will review your application and contact you within 3-5 business days.
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
