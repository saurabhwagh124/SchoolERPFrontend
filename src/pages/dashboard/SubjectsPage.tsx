import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Plus, Tag, MoreVertical, FileText } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { AddSubjectModal } from '../../components/erp/AddSubjectModal';

export const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await erpService.getSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Subject Repository</h1>
          <p className="text-slate-500">Manage curriculum subjects and their specific codes.</p>
        </div>
        <StarButton variant="primary" className="flex items-center gap-2 shadow-lg shadow-brand-primary/20" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> New Subject
        </StarButton>
      </div>

      <AddSubjectModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchSubjects} 
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="md:col-span-1 bg-white border-none shadow-md p-6 h-fit">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search subjects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none transition-all"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Categories</h3>
            <div className="space-y-2">
              {['Science', 'Language', 'Social Studies', 'Arts'].map(cat => (
                <div key={cat} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                  <span className="text-sm font-medium text-slate-600 group-hover:text-brand-primary">{cat}</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">0</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">Loading subjects...</div>
          ) : filteredSubjects.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">No subjects found.</div>
          ) : filteredSubjects.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="bg-white border-none shadow-md hover:shadow-xl transition-all p-8 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
                
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-dark group-hover:bg-brand-secondary transition-all">
                    <BookOpen size={28} />
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{sub.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Tag size={14} className="text-brand-secondary" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{sub.code}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                    <FileText size={12} />
                    {sub.category || 'General'}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
