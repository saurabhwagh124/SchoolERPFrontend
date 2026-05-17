import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Download, ExternalLink, Filter, TrendingUp, AlertCircle, CheckCircle2, BookOpen, Layers, Plus } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { CollectFeeModal } from '../../components/erp/CollectFeeModal';
import { AddFeeStructureModal } from '../../components/erp/AddFeeStructureModal';

export const FeesPage = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [structuresLoading, setStructuresLoading] = useState(false);
  const [summary, setSummary] = useState({ total: 0, paid: 0, pending: 0 });
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showAddStructureModal, setShowAddStructureModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'invoices' | 'structures'>('invoices');

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

  const fetchFeeStructures = async () => {
    setStructuresLoading(true);
    try {
      const response = await erpService.getFees();
      setFeeStructures(response.data || []);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    } finally {
      setStructuresLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchFeeStructures();
  }, []);

  const handleDownload = (invoice: any) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Helper to parse itemized fee breakdowns
  const parseBreakdown = (breakdownStr: string) => {
    try {
      if (breakdownStr) {
        return JSON.parse(breakdownStr);
      }
    } catch (e) {
      console.error('Error parsing fee breakdown JSON:', e);
    }
    return [];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Financial Management</h1>
          <p className="text-slate-500">Track student fee structures, recurring invoice logs, and overall revenue status.</p>
        </div>
        <div className="flex items-center gap-3">
          <StarButton 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => setShowAddStructureModal(true)}
          >
            <Plus size={18} /> Add Fee Structure
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

      <AddFeeStructureModal
        isOpen={showAddStructureModal}
        onClose={() => setShowAddStructureModal(false)}
        onSuccess={() => {
          fetchInvoices();
          fetchFeeStructures();
        }}
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
              <CheckCircle2 size={14} /> {summary.total > 0 ? Math.round((summary.paid / summary.total) * 100) : 0}% collection rate
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
              <AlertCircle size={14} /> {invoices.filter(i => i.status === 'pending').length} Pending Invoices
            </div>
          </div>
          <div className="p-4 bg-brand-dark/10 rounded-2xl relative z-10">
            <AlertCircle size={32} />
          </div>
        </GlassCard>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`py-3 px-6 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'invoices' 
              ? 'border-brand-primary text-brand-primary' 
              : 'border-transparent text-slate-500 hover:text-brand-primary'
          }`}
        >
          <BookOpen size={16} /> Invoices & Ledger
        </button>
        <button
          onClick={() => setActiveTab('structures')}
          className={`py-3 px-6 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'structures' 
              ? 'border-brand-primary text-brand-primary' 
              : 'border-transparent text-slate-500 hover:text-brand-primary'
          }`}
        >
          <Layers size={16} /> Class-wise Structures
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'invoices' ? (
          <motion.div
            key="invoices"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <GlassCard className="bg-white border-none shadow-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-slate-900">Recent Student Invoices</h2>
                <StarButton variant="outline" className="flex items-center gap-2 text-sm" onClick={() => window.print()}>
                  <Download size={16} /> Export Ledger
                </StarButton>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Student Details</th>
                      <th className="px-6 py-4">Linked Class</th>
                      <th className="px-6 py-4">Fee Category</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={7} className="p-12 text-center text-slate-400">Loading ledger data...</td></tr>
                    ) : invoices.length === 0 ? (
                      <tr><td colSpan={7} className="p-12 text-center text-slate-400">No invoices recorded.</td></tr>
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
                          <p className="font-bold text-slate-900">{inv.student_name || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{inv.student_email || 'No email'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-700">
                            {inv.class_name ? `Class ${inv.class_name} - ${inv.class_section}` : 'Unassigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{inv.fee_title || 'Academic Fee'}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Academic Year 2026-27</p>
                        </td>
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
          </motion.div>
        ) : (
          <motion.div
            key="structures"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <GlassCard className="bg-white border-none shadow-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-slate-900">Defined Class-wise Fees</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Classroom</th>
                      <th className="px-6 py-4">Fee Structure Name</th>
                      <th className="px-6 py-4">Academic Year</th>
                      <th className="px-6 py-4">Itemized Breakdown</th>
                      <th className="px-6 py-4">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {structuresLoading ? (
                      <tr><td colSpan={5} className="p-12 text-center text-slate-400">Loading structures data...</td></tr>
                    ) : feeStructures.length === 0 ? (
                      <tr><td colSpan={5} className="p-12 text-center text-slate-400">No class fee structures defined yet.</td></tr>
                    ) : feeStructures.map((struct, i) => {
                      const breakdownRows = parseBreakdown(struct.breakdown);
                      return (
                        <motion.tr 
                          key={struct.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-slate-800">
                            Class {struct.class_name} - {struct.section}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{struct.title}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{struct.academic_year}</td>
                          <td className="px-6 py-4">
                            {breakdownRows.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 max-w-sm">
                                {breakdownRows.map((row: any, idx: number) => (
                                  <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium font-mono">
                                    {row.name}: ₹{row.amount}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Flat Structure</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-black text-brand-primary text-base font-mono">
                            ₹{parseFloat(struct.amount).toLocaleString()}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedInvoice && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm print:static print:bg-white print:p-0 print:block">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden print:shadow-none print:max-w-none">
            <div className="p-8 print:hidden flex items-center justify-between border-b border-slate-100">
              <h2 className="font-bold text-xl">Invoice Details & Receipt</h2>
              <div className="flex gap-2">
                <StarButton variant="outline" onClick={() => window.print()}><Download size={16} className="mr-2" /> Print / Save PDF</StarButton>
                <button onClick={() => setSelectedInvoice(null)} className="w-10 h-10 border border-slate-200 rounded-full hover:bg-slate-50 flex items-center justify-center font-bold text-slate-500">X</button>
              </div>
            </div>
            
            <div className="p-10 print:p-0">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-black text-brand-primary tracking-tight">INVOICE</h1>
                  <p className="text-sm font-bold text-slate-400 mt-1">#{selectedInvoice.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-slate-900">Little Star Kids Academy</h3>
                  <p className="text-xs text-slate-500">123 Education Lane<br/>Cityville, State 12345</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8 border-t border-b border-slate-100 py-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Billed To</p>
                  <p className="font-bold text-slate-900 text-base">{selectedInvoice.student_name || 'N/A'}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedInvoice.student_email || 'No email'}</p>
                  <p className="text-xs text-brand-primary font-bold mt-1.5">
                    {selectedInvoice.class_name ? `Class ${selectedInvoice.class_name} - ${selectedInvoice.class_section}` : 'Unassigned Classroom'}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</p>
                    <p className="font-bold text-slate-900">{new Date(selectedInvoice.created_at || new Date()).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date</p>
                    <p className="font-bold text-slate-900">{new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 border border-slate-200 rounded-2xl overflow-hidden print:border-none print:border-y">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <th className="px-4 py-3">Itemized Description</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parseBreakdown(selectedInvoice.fee_breakdown).length > 0 ? (
                      parseBreakdown(selectedInvoice.fee_breakdown).map((row: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-4"><p className="font-bold text-slate-900">{row.name}</p></td>
                          <td className="px-4 py-4 text-right font-mono text-slate-900">₹{parseFloat(row.amount).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-4"><p className="font-bold text-slate-900">{selectedInvoice.fee_title || 'Academic Tuition Fee'}</p></td>
                        <td className="px-4 py-4 text-right font-mono text-slate-900">₹{parseFloat(selectedInvoice.total_amount).toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold">
                    <tr>
                      <td className="px-4 py-4 text-right text-slate-500">Total Billed Amount</td>
                      <td className="px-4 py-4 text-right text-xl text-brand-primary font-mono">₹{parseFloat(selectedInvoice.total_amount).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-center">
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest ${
                  selectedInvoice.status === 'paid' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-secondary/20 text-brand-secondary'
                }`}>
                  Payment Status: {selectedInvoice.status}
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
