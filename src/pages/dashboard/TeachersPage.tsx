import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, MoreVertical, Filter, UserCheck, Mail, Phone, BookOpen, PlusCircle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { AddTeacherModal } from '../../components/erp/AddTeacherModal';
import { AssignSubjectToTeacherModal } from '../../components/erp/AssignSubjectToTeacherModal';

export const TeachersPage = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await erpService.getTeachers();
      setTeachers(response.data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Teacher Directory</h1>
          <p className="text-slate-500">Manage faculty members and their profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <StarButton variant="outline" className="flex items-center gap-2">
            <Filter size={18} /> Filter
          </StarButton>
          <StarButton variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <UserPlus size={18} /> Add Teacher
          </StarButton>
        </div>
      </div>

      <AddTeacherModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchTeachers}
      />

      {selectedTeacher && (
        <AssignSubjectToTeacherModal 
          isOpen={showAssignModal} 
          onClose={() => setShowAssignModal(false)} 
          onSuccess={fetchTeachers}
          teacherId={selectedTeacher.id}
          teacherName={selectedTeacher.name}
        />
      )}

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
              <p className="text-sm text-slate-600">Total Faculty</p>
              <p className="text-2xl font-bold text-brand-primary">{teachers.length}</p>
            </div>
            <div className="p-4 bg-brand-success/5 rounded-2xl">
              <p className="text-sm text-slate-600">Active Teachers</p>
              <p className="text-2xl font-bold text-brand-success">{teachers.filter(t => t.status === 'active').length}</p>
            </div>
          </div>
        </GlassCard>

        <div className="lg:col-span-2 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">Loading directory...</div>
          ) : filteredTeachers.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">No teachers found.</div>
          ) : filteredTeachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="bg-white border-none shadow-md hover:shadow-xl transition-all p-6 relative group overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform" />

                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl">
                    {teacher.name?.[0].toUpperCase()}
                  </div>
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveMenu(activeMenu === teacher.id ? null : teacher.id)}
                      className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-brand-primary transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {activeMenu === teacher.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20"
                      >
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary">
                          View Profile
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowAssignModal(true);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-brand-primary hover:bg-brand-primary/5 flex items-center gap-2"
                        >
                          <PlusCircle size={14} /> Assign Subjects
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary">
                          Edit Details
                        </button>
                        <div className="h-px bg-slate-100 my-2" />
                        <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
                          Deactivate
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{teacher.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                    <BookOpen size={14} className="text-brand-secondary" />
                    <span>{teacher.subjects?.length || 0} Subjects Assigned</span>
                  </div>
                </div>

                <div className="space-y-3 mt-auto border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    <span>{teacher.contact_number || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${teacher.status === 'active' ? 'bg-brand-success/10 text-brand-success' : 'bg-slate-100 text-slate-400'
                    }`}>
                    {teacher.status || 'Active'}
                  </span>
                  <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full text-[10px] font-bold uppercase">
                    Teacher ID: {teacher.id.slice(0, 8)}
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
