import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, MoreVertical, Filter, GraduationCap, Mail, Phone } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { AddStudentModal } from '../../components/erp/AddStudentModal';

export const StudentsPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await erpService.getStudents();
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-slate-500">Manage student records and academic profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <StarButton variant="outline" className="flex items-center gap-2">
            <Filter size={18} /> Filter
          </StarButton>
          <StarButton variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <UserPlus size={18} /> Enroll Student
          </StarButton>
        </div>
      </div>

      <AddStudentModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchStudents}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-1 md:col-span-2 bg-white border-none shadow-md p-6 h-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            />
          </div>
          <div className="mt-8 space-y-4">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Statistics</h3>
            <div className="p-4 bg-brand-primary/5 rounded-2xl">
              <p className="text-sm text-slate-600">Total Enrolled</p>
              <p className="text-2xl font-bold text-brand-primary">{students.length}</p>
            </div>
            <div className="p-4 bg-brand-success/5 rounded-2xl">
              <p className="text-sm text-slate-600">Active Students</p>
              <p className="text-2xl font-bold text-brand-success">{students.filter(s => s.status !== 'inactive').length}</p>
            </div>
          </div>
        </GlassCard>

        <div className="lg:col-span-2 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">Loading directory...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">No students found.</div>
          ) : filteredStudents.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="bg-white border-none shadow-md hover:shadow-xl transition-all p-6 relative group overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <GraduationCap size={32} />
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{student.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{student.class_name || 'Unassigned Class'}</p>
                </div>

                <div className="space-y-3 mt-auto border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    <span>{student.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    student.status === 'active' ? 'bg-brand-success/10 text-brand-success' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {student.status || 'Active'}
                  </span>
                  <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full text-[10px] font-bold uppercase">
                    ID: {student.id.slice(0, 8)}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
