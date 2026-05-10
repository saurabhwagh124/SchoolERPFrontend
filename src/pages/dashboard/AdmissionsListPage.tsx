import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { admissionService } from '../../services/admissionService';

export const AdmissionsListPage = () => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const response = await admissionService.getAdmissions();
        setAdmissions(response.data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissions();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Admissions Overview</h1>
          <p className="text-slate-500">Review and manage student applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <StarButton variant="outline" className="flex items-center gap-2">
            <Filter size={18} /> Filter
          </StarButton>
        </div>
      </div>

      <GlassCard className="bg-white border-none shadow-md p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Applicant Name</th>
                <th className="px-6 py-4 font-bold">Date of Birth</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading applications...</td></tr>
              ) : admissions.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No applications found.</td></tr>
              ) : admissions.map((app, i) => (
                <motion.tr 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-900">{app.name}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(app.date_of_birth).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-500">{app.contact_number}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      app.status === 'approved' ? 'bg-green-100 text-green-600' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {app.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-brand-blue/10 text-brand-blue rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors" title="Approve">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Reject">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
