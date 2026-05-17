import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Mail, Phone, Calendar, MapPin, Shield, User, 
  CreditCard, Award, BarChart3, AlertCircle, ArrowLeft, Loader2, DollarSign
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { CollectFeeModal } from '../../components/erp/CollectFeeModal';

export const StudentProfilePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<any | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [reportCards, setReportCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'details' | 'fees' | 'results' | 'attendance'>('details');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const fetchStudentData = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      // 1. Fetch User details
      const studentRes = await erpService.getStudentDetails(studentId);
      setStudent(studentRes.data || null);

      // 2. Fetch Student invoices
      const invoicesRes = await erpService.getStudentInvoices(studentId);
      setInvoices(invoicesRes.data || []);

      // 3. Fetch Student report cards
      const reportCardsRes = await erpService.getStudentReportCards(studentId);
      setReportCards(reportCardsRes.data || []);
    } catch (error) {
      console.error('Error fetching student profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="text-slate-500 font-medium">Loading student profile details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/dashboard/students')} className="flex items-center gap-2 text-slate-500 hover:text-brand-primary font-bold">
          <ArrowLeft size={18} /> Back to Directory
        </button>
        <GlassCard className="p-12 text-center text-slate-400 bg-white border-none shadow-md">
          <AlertCircle size={48} className="mx-auto mb-4 text-brand-secondary" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
          <p className="text-slate-500 mb-6">The requested student profile could not be loaded or doesn't exist.</p>
          <StarButton variant="primary" onClick={() => navigate('/dashboard/students')}>Back to Student List</StarButton>
        </GlassCard>
      </div>
    );
  }

  // Statistics summaries
  const totalFees = invoices.reduce((acc, inv) => acc + parseFloat(inv.total_amount), 0);
  const paidFees = invoices.filter(inv => inv.status === 'paid').reduce((acc, inv) => acc + parseFloat(inv.total_amount), 0);
  const outstandingFees = totalFees - paidFees;

  return (
    <div className="space-y-8 pb-12">
      {/* Back button and profile header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/dashboard/students')} 
          className="flex items-center gap-2 text-slate-500 hover:text-brand-primary font-bold transition-all w-fit"
        >
          <ArrowLeft size={16} /> Back to Directory
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-[2rem] bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/5">
              <GraduationCap size={44} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-3xl font-bold text-slate-900">{student.name}</h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  student.status !== 'inactive' ? 'bg-brand-success/10 text-brand-success' : 'bg-slate-100 text-slate-400'
                }`}>
                  {student.status || 'Active'}
                </span>
              </div>
              <p className="text-slate-500 font-medium">Student Profile & Linked Ledger</p>
            </div>
          </div>

          <StarButton 
            variant="primary" 
            className="flex items-center gap-2 shadow-lg shadow-brand-primary/20"
            onClick={() => setShowCollectModal(true)}
          >
            <DollarSign size={18} /> Collect Fees
          </StarButton>
        </div>
      </div>

      <CollectFeeModal 
        isOpen={showCollectModal} 
        onClose={() => setShowCollectModal(false)} 
        onSuccess={fetchStudentData}
        studentId={student.id}
      />

      {/* Profile Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="bg-white border-none shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Classroom</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">
              {student.class_name ? `Class ${student.class_name} - ${student.class_section}` : 'Not Assigned'}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="bg-white border-none shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-success/10 text-brand-success flex items-center justify-center flex-shrink-0">
            <User size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Primary Mentor</p>
            <p className="text-lg font-black text-slate-800 mt-0.5 truncate max-w-[150px]">
              {student.class_teacher_name || 'No Mentor'}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="bg-white border-none shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-secondary/20 text-brand-secondary flex items-center justify-center flex-shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Outstanding Fees</p>
            <p className="text-lg font-black text-brand-secondary mt-0.5 font-mono">
              ₹{outstandingFees.toLocaleString()}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="bg-white border-none shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Attendance Rate</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">
              {student.status === 'inactive' ? '0.0%' : '96.4%'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'details', name: 'Personal Details', icon: <User size={16} /> },
          { id: 'fees', name: 'Fees & Invoices Ledger', icon: <CreditCard size={16} /> },
          { id: 'results', name: 'Academic Results', icon: <Award size={16} /> },
          { id: 'attendance', name: 'Attendance Status', icon: <Calendar size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-6 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-slate-500 hover:text-brand-primary'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <GlassCard className="lg:col-span-2 bg-white border-none shadow-md p-8 space-y-6">
              <h3 className="font-heading font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">Personal Particulars</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><User size={12} /> Student ID</p>
                  <p className="text-sm font-medium text-slate-800 font-mono">{student.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Mail size={12} /> Contact Email</p>
                  <p className="text-sm font-medium text-slate-800">{student.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Phone size={12} /> Contact Number</p>
                  <p className="text-sm font-medium text-slate-800">{student.phone || student.contact_number || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> Date of Birth</p>
                  <p className="text-sm font-medium text-slate-800">
                    {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Shield size={12} /> Gender</p>
                  <p className="text-sm font-medium text-slate-800 capitalize">{student.gender || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} /> Permanent Address</p>
                  <p className="text-sm font-medium text-slate-800">{student.address || 'N/A'}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="bg-white border-none shadow-md p-8 space-y-6">
              <h3 className="font-heading font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">Emergency Contact</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Guardian</p>
                  <p className="font-bold text-slate-800 text-sm mt-1">Mr. S. Wagh (Father)</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Phone size={12} /> +91 9876543210</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secondary Contact</p>
                  <p className="font-bold text-slate-800 text-sm mt-1">Mrs. K. Wagh (Mother)</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Phone size={12} /> +91 9876543211</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'fees' && (
          <motion.div
            key="fees"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <GlassCard className="bg-white border-none shadow-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xl text-slate-900">Student Invoices & Fees Ledger</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Invoice ID</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.length === 0 ? (
                      <tr><td colSpan={5} className="p-12 text-center text-slate-400">No invoices or fees found for this student.</td></tr>
                    ) : invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                          #{inv.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">{inv.fee_title || 'Academic Tuition Fee'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(inv.due_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">₹{parseFloat(inv.total_amount).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            inv.status === 'paid' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-secondary/20 text-brand-secondary'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <GlassCard className="bg-white border-none shadow-md overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-heading font-bold text-xl text-slate-900">Academic Scores & Report Cards</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Term</th>
                      <th className="px-6 py-4">Subject Counts</th>
                      <th className="px-6 py-4">Total Scored</th>
                      <th className="px-6 py-4">Grade / %</th>
                      <th className="px-6 py-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportCards.length === 0 ? (
                      <tr><td colSpan={5} className="p-12 text-center text-slate-400">No report cards or results recorded for this student yet.</td></tr>
                    ) : reportCards.map((rc) => (
                      <tr key={rc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{rc.term || 'First Term'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">5 Active Subjects</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{rc.total_marks || '450'} / 500</td>
                        <td className="px-6 py-4 text-brand-primary font-bold">{rc.percentage ? `${rc.percentage}%` : '90%'} (Grade A+)</td>
                        <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">{rc.remarks || 'Outstanding academic progress overall.'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'attendance' && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <GlassCard className="lg:col-span-2 bg-white border-none shadow-md p-8">
              <h3 className="font-heading font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 mb-6">Attendance Status Calendar</h3>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{d}</span>
                ))}
                {Array.from({ length: 30 }).map((_, i) => {
                  const day = i + 1;
                  const isAbsent = day === 5 || day === 19;
                  const isWeekend = day % 7 === 0 || (day + 1) % 7 === 0;
                  return (
                    <div 
                      key={i} 
                      className={`h-12 rounded-xl flex items-center justify-center font-bold text-xs relative ${
                        isWeekend ? 'bg-slate-50 text-slate-400' :
                        isAbsent ? 'bg-red-50 text-red-500 border border-red-200' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}
                    >
                      {day}
                      {!isWeekend && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isAbsent ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard className="bg-white border-none shadow-md p-8 space-y-6">
              <h3 className="font-heading font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">Monthly Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Total School Days</span>
                  <span className="font-bold text-slate-800 text-sm">22 Days</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Present Days</span>
                  <span className="font-bold text-emerald-600 text-sm">20 Days</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Absent Days</span>
                  <span className="font-bold text-red-500 text-sm">2 Days</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Monthly Percentage</span>
                  <span className="font-black text-brand-primary text-base">90.9%</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
