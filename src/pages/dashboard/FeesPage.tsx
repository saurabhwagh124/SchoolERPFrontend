import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, ExternalLink, Filter, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { CollectFeeModal } from '../../components/erp/CollectFeeModal';

export const FeesPage = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, paid: 0, pending: 0 });
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await erpService.getInvoices();
      const data = response.data || [];
      setInvoices(data);
      
      const total = data.reduce((acc: number, inv: any) => acc + parseFloat(inv.total_amount), 0);
      const paid = data.filter((inv: any) => inv.status === 'paid').reduce((acc: number, inv: any) => acc + parseFloat(inv.total_amount), 0);
      const pending = total - paid;
      
      setSummary({ total, paid, pending });
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = (invoice: any) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Financial Management</h1>
          <p className="text-slate-500">Track student fee payments, invoices, and overall revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <StarButton variant="outline" className="flex items-center gap-2">
            <Filter size={18} /> Filter
          </StarButton>
          <StarButton variant="primary" className="flex items-center gap-2" onClick={() => setShowCollectModal(true)}>
            <CreditCard size={18} /> Collect Fee
          </StarButton>
        </div>
      </div>

      <CollectFeeModal 
        isOpen={showCollectModal} 
        onClose={() => setShowCollectModal(false)} 
        onSuccess={fetchInvoices}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="bg-brand-primary text-white border-none p-8 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-4xl font-bold">₹{summary.total.toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1 rounded-full">
              <TrendingUp size={14} /> +12.5% vs last month
            </div>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl relative z-10">
            <CreditCard size={32} />
          </div>
        </GlassCard>

        <GlassCard className="bg-brand-success text-white border-none p-8 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-1">Total Collected</p>
            <p className="text-4xl font-bold">₹{summary.paid.toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1 rounded-full">
              <CheckCircle2 size={14} /> 85% collection rate
            </div>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl relative z-10">
            <CheckCircle2 size={32} />
          </div>
        </GlassCard>

        <GlassCard className="bg-brand-secondary text-brand-dark border-none p-8 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
          <div className="relative z-10">
            <p className="text-brand-dark/60 text-sm font-medium uppercase tracking-widest mb-1">Outstanding</p>
            <p className="text-4xl font-bold">₹{summary.pending.toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-xs bg-brand-dark/10 w-fit px-3 py-1 rounded-full">
              <AlertCircle size={14} /> 12 Pending Invoices
            </div>
          </div>
          <div className="p-4 bg-brand-dark/10 rounded-2xl relative z-10">
            <AlertCircle size={32} />
          </div>
        </GlassCard>
      </div>

      <GlassCard className="bg-white border-none shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-slate-900">Recent Transactions</h2>
          <StarButton variant="outline" className="flex items-center gap-2 text-sm" onClick={() => window.print()}>
            <Download size={16} /> Export View
          </StarButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-400">Loading financial data...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-400">No invoices found.</td></tr>
              ) : invoices.map((inv, i) => (
                <motion.tr 
                  key={inv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      #{inv.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{inv.description || 'Tuition Fee'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Academic Year 2025-26</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(inv.issue_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">₹{parseFloat(inv.total_amount).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      inv.status === 'paid' ? 'bg-brand-success/10 text-brand-success' :
                      inv.status === 'pending' ? 'bg-brand-secondary/20 text-brand-secondary' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleDownload(inv)}
                        className="p-2 hover:bg-brand-primary/10 text-brand-primary rounded-lg transition-all"
                        title="Download Invoice"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-all"
                        title="View Details"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {selectedInvoice && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm print:static print:bg-white print:p-0 print:block">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden print:shadow-none print:max-w-none">
            <div className="p-8 print:hidden flex items-center justify-between border-b border-slate-100">
              <h2 className="font-bold text-xl">Invoice Details</h2>
              <div className="flex gap-2">
                <StarButton variant="outline" onClick={() => window.print()}><Download size={16} className="mr-2" /> Print / Save PDF</StarButton>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-100 rounded-full"><AlertCircle size={20} className="opacity-0" /><span className="absolute inset-0 flex items-center justify-center">X</span></button>
              </div>
            </div>
            
            <div className="p-10 print:p-0">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-3xl font-black text-brand-primary tracking-tight">INVOICE</h1>
                  <p className="text-sm font-bold text-slate-400 mt-1">#{selectedInvoice.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-slate-900">Little Star Kids Academy</h3>
                  <p className="text-xs text-slate-500">123 Education Lane<br/>Cityville, State 12345</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Billed To</p>
                  <p className="font-bold text-slate-900">Student ID: {selectedInvoice.student_id}</p>
                  <p className="text-sm text-slate-600">Grade 10 - Section A</p>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</p>
                    <p className="font-bold text-slate-900">{new Date(selectedInvoice.issue_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date</p>
                    <p className="font-bold text-slate-900">{new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 border border-slate-200 rounded-xl overflow-hidden print:border-none print:border-y">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-4"><p className="font-bold text-slate-900">{selectedInvoice.description || 'Academic Tuition Fee'}</p></td>
                      <td className="px-4 py-4 text-right font-medium text-slate-900">₹{parseFloat(selectedInvoice.total_amount).toLocaleString()}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold">
                    <tr>
                      <td className="px-4 py-4 text-right text-slate-500">Total Amount</td>
                      <td className="px-4 py-4 text-right text-xl text-brand-primary">₹{parseFloat(selectedInvoice.total_amount).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-center">
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest ${
                  selectedInvoice.status === 'paid' ? 'bg-brand-success/10 text-brand-success' : 'bg-red-100 text-red-600'
                }`}>
                  Status: {selectedInvoice.status}
                </span>
                <p className="mt-6 text-xs text-slate-400">Thank you for your timely payment.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
