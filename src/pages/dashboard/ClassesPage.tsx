import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Layers, Plus, Users, Hash, MoreVertical } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { AddClassModal } from '../../components/erp/AddClassModal';

export const ClassesPage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await erpService.getClasses();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Class Management</h1>
          <p className="text-slate-500">Manage school classes, sections, and student allocations.</p>
        </div>
        <StarButton variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> New Class
        </StarButton>
      </div>

      <AddClassModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchClasses} 
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="md:col-span-1 bg-white border-none shadow-md p-6 h-fit">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search classes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Overview</h3>
            <div className="p-4 bg-brand-primary/5 rounded-2xl">
              <p className="text-xs text-slate-500 font-medium mb-1">Total Classes</p>
              <p className="text-2xl font-bold text-brand-primary">{classes.length}</p>
            </div>
            <div className="p-4 bg-brand-secondary/10 rounded-2xl">
              <p className="text-xs text-slate-500 font-medium mb-1">Total Sections</p>
              <p className="text-2xl font-bold text-brand-dark">
                {new Set(classes.map(c => `${c.name}-${c.section}`)).size}
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">Loading classes...</div>
          ) : filteredClasses.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">No classes found.</div>
          ) : filteredClasses.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="bg-white border-none shadow-md hover:shadow-xl transition-all p-8 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
                
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Layers size={28} />
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{cls.name}</h3>
                  <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                    <Hash size={14} className="text-brand-primary" /> Section {cls.section}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">{cls.student_count || 0}</span>
                    <span className="text-xs text-slate-400 font-medium">Students</span>
                  </div>
                  <div className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded uppercase tracking-wider">
                    {cls.capacity || 40} Capacity
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
