import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, CheckCircle, XCircle, MoreVertical, Calendar, Phone, Mail, User, GraduationCap, MapPin, FileText, X } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { admissionService } from '../../services/admissionService';
import { useNotification } from '../../components/ui/Notification';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export const AdmissionsListPage = () => {
  const { showNotification } = useNotification();
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedAdmission, setSelectedAdmission] = useState<any | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [admissionToReject, setAdmissionToReject] = useState<any | null>(null);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await admissionService.getAdmissions();
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    if (status === 'rejected') {
      setAdmissionToReject({ id, status });
      return;
    }

    await executeUpdateStatus(id, status);
  };

  const executeUpdateStatus = async (id: string, status: string) => {
    setIsProcessing(true);
    try {
      const res = await admissionService.updateAdmissionStatus(id, status);
      if (status === 'approved') {
        showNotification(res?.data?.message || 'Admission approved and student user created successfully. Credentials emailed.', 'success');
      } else {
        showNotification(`Admission ${status} successfully.`, 'success');
      }
      fetchAdmissions();
      if (selectedAdmission?.id === id) {
        setSelectedAdmission(prev => ({ ...prev, status }));
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      showNotification(error.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setIsProcessing(false);
      setAdmissionToReject(null);
    }
  };

  const filteredAdmissions = useMemo(() => {
    let result = [...admissions];

    // Search
    if (searchQuery) {
      result = result.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.contact_number?.includes(searchQuery)
      );
    }

    // Filter
    if (filterStatus !== 'all') {
      result = result.filter(app => app.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [admissions, searchQuery, filterStatus, sortBy]);

  const stats = useMemo(() => {
    return {
      total: admissions.length,
      pending: admissions.filter(a => a.status === 'pending').length,
      approved: admissions.filter(a => a.status === 'approved').length,
      rejected: admissions.filter(a => a.status === 'rejected').length,
    };
  }, [admissions]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Admissions Overview</h1>
          <p className="text-slate-500">Review and manage student applications.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filterStatus === 'all' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filterStatus === 'pending' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pending
            </button>
          </div>
          <StarButton
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <Filter size={18} /> Sort
          </StarButton>

          {showFilterMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Sort By</div>
              <button
                onClick={() => { setSortBy('newest'); setShowFilterMenu(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${sortBy === 'newest' ? 'bg-brand-blue/10 text-brand-blue' : 'hover:bg-slate-50'}`}
              >
                Newest First
              </button>
              <button
                onClick={() => { setSortBy('oldest'); setShowFilterMenu(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${sortBy === 'oldest' ? 'bg-brand-blue/10 text-brand-blue' : 'hover:bg-slate-50'}`}
              >
                Oldest First
              </button>
              <button
                onClick={() => { setSortBy('name'); setShowFilterMenu(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${sortBy === 'name' ? 'bg-brand-blue/10 text-brand-blue' : 'hover:bg-slate-50'}`}
              >
                Alphabetical
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: stats.total, color: 'blue', icon: <FileText className="text-blue-500" /> },
          { label: 'Pending Review', value: stats.pending, color: 'amber', icon: <Calendar className="text-amber-500" /> },
          { label: 'Approved', value: stats.approved, color: 'emerald', icon: <CheckCircle className="text-emerald-500" /> },
          { label: 'Rejected', value: stats.rejected, color: 'rose', icon: <XCircle className="text-rose-500" /> },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="bg-white border-none shadow-md p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500">
            Showing <b>{filteredAdmissions.length}</b> applications
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Applicant Details</th>
                <th className="px-6 py-4 font-bold">Grade</th>
                <th className="px-6 py-4 font-bold">Applied Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                    Loading applications...
                  </div>
                </td></tr>
              ) : filteredAdmissions.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={40} className="text-slate-200" />
                    No applications match your criteria.
                  </div>
                </td></tr>
              ) : filteredAdmissions.map((app, i) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{app.name}</span>
                      <span className="text-xs text-slate-500">{app.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                      Grade {app.grade_applied || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {new Date(app.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                      app.status === 'rejected' ? 'bg-rose-100 text-rose-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                      {app.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedAdmission(app)}
                        className="p-2 hover:bg-brand-blue/10 text-brand-blue rounded-lg transition-colors"
                        title="View Full Application"
                      >
                        <Eye size={18} />
                      </button>
                      {app.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'approved')}
                          disabled={isProcessing}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          disabled={isProcessing}
                          className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Admission Detail Modal */}
      <AnimatePresence>
        {selectedAdmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedAdmission(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedAdmission.name}</h2>
                    <p className="text-sm text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedAdmission.status === 'approved' ? 'bg-emerald-500' :
                        selectedAdmission.status === 'rejected' ? 'bg-rose-500' :
                          'bg-blue-500'
                        }`} />
                      {selectedAdmission.status || 'Pending Review'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAdmission(null)}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-8 flex-1">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column: Personal Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <Calendar size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Date of Birth</p>
                            <p className="text-sm font-bold text-slate-700">{new Date(selectedAdmission.date_of_birth).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Gender</p>
                            <p className="text-sm font-bold text-slate-700">{selectedAdmission.gender || 'Not Specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <MapPin size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Address</p>
                            <p className="text-sm font-bold text-slate-700 leading-tight">{selectedAdmission.address || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <Phone size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                            <p className="text-sm font-bold text-slate-700">{selectedAdmission.contact_number}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <Mail size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                            <p className="text-sm font-bold text-slate-700">{selectedAdmission.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Academic Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Academic Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <GraduationCap size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Grade Applied For</p>
                            <p className="text-sm font-bold text-slate-700">Grade {selectedAdmission.grade_applied || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Parent/Guardian Name</p>
                            <p className="text-sm font-bold text-slate-700">{selectedAdmission.parent_name || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <FileText size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Previous School</p>
                            <p className="text-sm font-bold text-slate-700 leading-tight">{selectedAdmission.previous_school || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Documents */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Documents</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                        <p className="text-xs font-bold text-slate-500 mb-2">Birth Certificate</p>
                        {selectedAdmission.birth_certificate_url ? (
                          <a
                            href={`http://localhost:1881/${selectedAdmission.birth_certificate_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-brand-blue font-bold hover:underline"
                          >
                            <FileText size={16} /> View Document
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Not Uploaded</p>
                        )}
                      </div>
                      <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                        <p className="text-xs font-bold text-slate-500 mb-2">Aadhaar Card / ID</p>
                        {selectedAdmission.aadhaar_card_url ? (
                          <a
                            href={`http://localhost:1881/${selectedAdmission.aadhaar_card_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-brand-blue font-bold hover:underline"
                          >
                            <FileText size={16} /> View Document
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Not Uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <StarButton variant="outline" onClick={() => setSelectedAdmission(null)} disabled={isProcessing}>Close</StarButton>
                {selectedAdmission.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAdmission.id, 'rejected')}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={18} /> Reject Application
                  </button>
                )}
                {selectedAdmission.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAdmission.id, 'approved')}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={18} />}
                    {isProcessing ? 'Processing...' : 'Approve & Convert to Student'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ConfirmModal
          isOpen={!!admissionToReject}
          title="Reject Application"
          message="Are you sure you want to reject this admission application? This action will notify the parent."
          confirmLabel="Reject Application"
          onConfirm={() => executeUpdateStatus(admissionToReject.id, admissionToReject.status)}
          onCancel={() => setAdmissionToReject(null)}
          variant="danger"
        />
    </div>
  );
};
