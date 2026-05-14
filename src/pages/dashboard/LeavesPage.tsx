import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { ApplyLeaveModal } from '../../components/erp/ApplyLeaveModal';

export const LeavesPage = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await erpService.getDashboardStats(); // Temporary placeholder
      // Assuming a getLeaves endpoint exists or will be added
      setLeaves([
        { id: '1', type: 'Sick Leave', startDate: '2026-05-10', endDate: '2026-05-12', status: 'approved', reason: 'Fever' },
        { id: '2', type: 'Casual Leave', startDate: '2026-05-15', endDate: '2026-05-15', status: 'pending', reason: 'Family function' },
        { id: '3', type: 'Other', startDate: '2026-05-20', endDate: '2026-05-22', status: 'rejected', reason: 'Too many leaves' },
      ]);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="text-brand-success" size={16} />;
      case 'rejected': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-brand-yellow" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-brand-success/10 text-brand-success';
      case 'rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-brand-yellow/10 text-brand-yellow';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500">Track and manage your leave applications and history.</p>
        </div>
        <StarButton variant="primary" className="flex items-center gap-2" onClick={() => setShowApplyModal(true)}>
          <Plus size={18} /> Apply for Leave
        </StarButton>
      </div>

      <ApplyLeaveModal 
        isOpen={showApplyModal} 
        onClose={() => setShowApplyModal(false)} 
        onSuccess={fetchLeaves} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="bg-white border-none shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Recent Applications</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search history..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-400">Loading history...</td></tr>
                  ) : leaves.map((leave, i) => (
                    <motion.tr 
                      key={leave.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{leave.type}</p>
                        <p className="text-[10px] text-slate-400">ID: #{leave.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-600">{leave.startDate}</p>
                        <p className="text-[10px] text-slate-400">to {leave.endDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-500 line-clamp-1 italic">"{leave.reason}"</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(leave.status)}`}>
                          {getStatusIcon(leave.status)}
                          {leave.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="bg-brand-primary text-white border-none p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Available Quota</h3>
              <p className="text-4xl font-bold">12 Days</p>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>Used: 3 Days</span>
                  <span>Total: 15 Days</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[20%] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-white border-none shadow-md p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-brand-primary" /> Leave Guidelines
            </h3>
            <ul className="space-y-3">
              {[
                'Apply at least 2 days in advance for casual leave.',
                'Medical certificate required for sick leave > 3 days.',
                'Check academic calendar for blackout dates.',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
