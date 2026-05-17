import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, MoreVertical, Filter, GraduationCap, Mail, Phone, Link as LinkIcon, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { AddStudentModal } from '../../components/erp/AddStudentModal';
import { AssignStudentToClassModal } from '../../components/erp/AssignStudentToClassModal';

export const StudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Filter Popover States
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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

  const fetchClasses = async () => {
    try {
      const response = await erpService.getClasses();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    
    const handleClickOutside = () => {
      setActiveMenu(null);
      setShowFilterPopover(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email?.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesClass = selectedClassId === 'all' || student.class_id === selectedClassId;
    const matchesStatus = selectedStatus === 'all' || 
                          (selectedStatus === 'active' && student.status !== 'inactive') ||
                          (selectedStatus === 'inactive' && student.status === 'inactive');
                          
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-slate-500">Manage student records and academic profiles.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="relative" onClick={e => e.stopPropagation()}>
            <StarButton 
              variant="outline" 
              className={`flex items-center gap-2 ${showFilterPopover ? 'bg-slate-100 border-brand-primary text-brand-primary' : ''}`}
              onClick={() => setShowFilterPopover(!showFilterPopover)}
            >
              <Filter size={18} /> Filter
            </StarButton>
            
            {/* Premium Filter Popover */}
            <AnimatePresence>
              {showFilterPopover && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-[100] space-y-4"
                >
                  <h4 className="font-heading font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Filter Directory</h4>
                  
                  {/* Class Filter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Classroom</label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-primary outline-none"
                    >
                      <option value="all">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>Class {cls.name} - {cls.section}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['all', 'active', 'inactive'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setSelectedStatus(st)}
                          className={`py-1.5 rounded-lg border font-bold text-[10px] uppercase transition-all ${
                            selectedStatus === st
                              ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                              : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClassId('all');
                      setSelectedStatus('all');
                      setShowFilterPopover(false);
                    }}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-bold transition-all"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

      <AssignStudentToClassModal 
        isOpen={showAssignModal} 
        onClose={() => setShowAssignModal(false)} 
        onSuccess={fetchStudents}
        studentId={selectedStudentId || undefined}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-1 md:col-span-2 bg-white border-none shadow-md p-6 h-fit">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-sm"
            />
          </div>
          <div className="mt-8 space-y-4">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Statistics</h3>
            <div className="p-4 bg-brand-primary/5 rounded-2xl">
              <p className="text-xs text-slate-500 font-medium">Total Enrolled</p>
              <p className="text-2xl font-bold text-brand-primary">{students.length}</p>
            </div>
            <div className="p-4 bg-brand-success/5 rounded-2xl">
              <p className="text-xs text-slate-500 font-medium">Active Students</p>
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
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary cursor-pointer hover:bg-brand-primary/20 transition-all" onClick={() => navigate(`/dashboard/students/${student.id}`)}>
                    <GraduationCap size={32} />
                  </div>
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === student.id ? null : student.id)}
                      className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-brand-primary transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {activeMenu === student.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-25"
                      >
                        <button 
                          onClick={() => navigate(`/dashboard/students/${student.id}`)}
                          className="w-full text-left px-4 py-2 text-xs text-brand-primary hover:bg-brand-primary/5 flex items-center gap-2 font-bold"
                        >
                          <Eye size={14} /> View Profile
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedStudentId(student.id);
                            setShowAssignModal(true);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <LinkIcon size={14} /> Assign to Class
                        </button>
                        <div className="h-px bg-slate-100 my-2" />
                        <button className="w-full text-left px-4 py-2 text-xs text-amber-600 hover:bg-amber-50">
                          Mark Inactive
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-primary transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/students/${student.id}`)}>{student.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {student.class_name ? `Class: ${student.class_name} ${student.class_section}` : 'Unassigned Class'}
                  </p>
                </div>

                <div className="space-y-2 mt-auto border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail size={12} className="text-slate-400" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone size={12} className="text-slate-400" />
                    <span>{student.phone || student.contact_number || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      student.status !== 'inactive' ? 'bg-brand-success/10 text-brand-success' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {student.status || 'Active'}
                    </span>
                    <span className="px-2 py-0.5 bg-brand-secondary/10 text-brand-secondary rounded-full text-[9px] font-bold uppercase">
                      ID: {student.id.slice(0, 8)}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate(`/dashboard/students/${student.id}`)}
                    className="text-[9px] font-bold text-brand-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    Profile &rarr;
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
