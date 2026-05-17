import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Shield, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { CustomSelect } from '../ui/CustomSelect';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AddFeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddFeeStructureModal: React.FC<AddFeeStructureModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showNotification } = useNotification();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    class_id: '',
    title: '',
    academic_year: '2026-27',
  });

  const [breakdown, setBreakdown] = useState<{ name: string; amount: number }[]>([
    { name: 'Tuition Fee', amount: 0 },
  ]);

  useEffect(() => {
    if (isOpen) {
      const fetchClasses = async () => {
        setLoading(true);
        try {
          const response = await erpService.getClasses();
          setClasses(response.data || []);
        } catch (error) {
          console.error('Error fetching classes:', error);
          showNotification('Failed to load classes list.', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchClasses();
      
      // Reset form states
      setFormData({
        class_id: '',
        title: '',
        academic_year: '2026-27',
      });
      setBreakdown([{ name: 'Tuition Fee', amount: 0 }]);
    }
  }, [isOpen]);

  const addBreakdownRow = () => {
    setBreakdown([...breakdown, { name: '', amount: 0 }]);
  };

  const removeBreakdownRow = (index: number) => {
    if (breakdown.length <= 1) return;
    setBreakdown(breakdown.filter((_, i) => i !== index));
  };

  const handleBreakdownChange = (index: number, field: 'name' | 'amount', value: any) => {
    const updated = [...breakdown];
    if (field === 'amount') {
      updated[index].amount = parseFloat(value) || 0;
    } else {
      updated[index].name = value;
    }
    setBreakdown(updated);
  };

  const totalAmount = breakdown.reduce((acc, row) => acc + row.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.class_id || !formData.title.trim()) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (totalAmount <= 0) {
      showNotification('Fee structure total must be greater than zero.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await erpService.createFeeStructure({
        class_id: formData.class_id,
        title: formData.title,
        academic_year: formData.academic_year,
        amount: totalAmount,
        breakdown: JSON.stringify(breakdown), // Store as stringified JSON in the breakdown column
      });

      showNotification('Fee Structure created successfully!', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating fee structure:', error);
      showNotification('Failed to create fee structure.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
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
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            <div className="p-8 bg-brand-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Add Fee Structure</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <p className="text-white/70 text-sm relative z-10">Define class-wise fees and their specific ledger breakdowns.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  label="Select Classroom"
                  icon={<Shield size={16} className="text-brand-primary" />}
                  value={formData.class_id}
                  onChange={(val) => setFormData({ ...formData, class_id: val })}
                  placeholder="Select a class..."
                  options={classes.map(cls => ({ value: cls.id, label: `Class ${cls.name} - ${cls.section}` }))}
                />

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                    <Calendar size={14} className="text-brand-primary" /> Academic Year
                  </label>
                  <input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    placeholder="e.g. 2026-27"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                  <CreditCard size={14} className="text-brand-primary" /> Fee Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Term 1 Tuition & Library Fees"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                />
              </div>

              {/* Breakdown Repeater Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-heading font-black text-slate-400 text-[10px] uppercase tracking-widest">Fee Item Breakdowns</h3>
                  <button
                    type="button"
                    onClick={addBreakdownRow}
                    className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Row
                  </button>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {breakdown.map((row, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        required
                        value={row.name}
                        onChange={(e) => handleBreakdownChange(index, 'name', e.target.value)}
                        placeholder="Item (e.g. Library Fee)"
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          required
                          value={row.amount || ''}
                          onChange={(e) => handleBreakdownChange(index, 'amount', e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-primary outline-none text-right font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBreakdownRow(index)}
                        disabled={breakdown.length <= 1}
                        className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary display card */}
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount Computed</p>
                  <p className="text-xs text-slate-400 italic mt-0.5">Sum of all active ledger items above</p>
                </div>
                <p className="text-2xl font-black text-brand-primary font-mono">₹{totalAmount.toLocaleString()}</p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <StarButton variant="outline" className="flex-1" onClick={onClose} type="button">Cancel</StarButton>
                <StarButton className="flex-1 bg-brand-primary text-white hover:bg-brand-primary/90 font-bold" type="submit" disabled={submitting || loading}>
                  {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {submitting ? 'Creating...' : 'Create Structure'}
                </StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
