import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, Plus, Users, Hash, MoreVertical, X, User, BookOpen, Clock, Calendar, CheckCircle, ChevronRight, GraduationCap, Bell, UserPlus, ShieldCheck, Settings, Trash2, Printer, UserCheck } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { AddClassModal } from '../../components/erp/AddClassModal';
import { AssignSubjectModal } from '../../components/erp/AssignSubjectModal';
import { AssignStudentToClassModal } from '../../components/erp/AssignStudentToClassModal';
import { AssignTeacherToClassModal } from '../../components/erp/AssignTeacherToClassModal';

export const ClassesPage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignSubject, setShowAssignSubject] = useState(false);
  const [showAssignStudent, setShowAssignStudent] = useState(false);
  const [showAssignTeacher, setShowAssignTeacher] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'students' | 'schedule' | 'teachers'>('students');
  const [showExtraActions, setShowExtraActions] = useState(false);

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

  const handleViewDetails = async (classId: string) => {
    setDetailLoading(true);
    try {
      const response = await erpService.getClassDetails(classId);
      setSelectedClass(response.data);
      setActiveTab('students');
      setShowExtraActions(false);
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00 AM', '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM'];

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

      {selectedClass && (
        <>
          <AssignSubjectModal
            isOpen={showAssignSubject}
            onClose={() => setShowAssignSubject(false)}
            onSuccess={() => handleViewDetails(selectedClass.id)}
            classId={selectedClass.id}
            className={selectedClass.name}
          />
          <AssignStudentToClassModal
            isOpen={showAssignStudent}
            onClose={() => setShowAssignStudent(false)}
            onSuccess={() => handleViewDetails(selectedClass.id)}
            classId={selectedClass.id}
          />
          <AssignTeacherToClassModal
            isOpen={showAssignTeacher}
            onClose={() => setShowAssignTeacher(false)}
            onSuccess={() => handleViewDetails(selectedClass.id)}
            classId={selectedClass.id}
            className={selectedClass.name}
            currentTeacherId={selectedClass.class_teacher_id}
          />
        </>
      )}

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
              <GlassCard
                onClick={() => handleViewDetails(cls.id)}
                className="bg-white border-none shadow-md hover:shadow-xl transition-all p-8 group relative overflow-hidden h-full flex flex-col cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />

                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Layers size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cls.academic_year}</span>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={20} />
                    </button>
                  </div>
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

      {/* Class Details Modal */}
      <AnimatePresence>
        {selectedClass && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedClass(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col" >

              {/* Header */}
              <div className="p-8 bg-brand-primary text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Layers size={40} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-bold font-heading">{selectedClass.name}</h2>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">Section {selectedClass.section}</span>
                      </div>
                      <p className="text-white/70 font-medium flex items-center gap-2">
                        <Calendar size={14} /> Academic Year: {selectedClass.academic_year}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedClass(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Quick Info Bar */}
              <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center gap-8 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-primary"><Users size={20} /></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Students</p><p className="text-sm font-bold text-slate-900">{selectedClass.students?.length || 0} enrolled</p></div>
                </div>
                <div className="flex items-center gap-3 shrink-0 cursor-pointer hover:bg-white hover:shadow-sm p-1 rounded-xl transition-all" onClick={() => setShowAssignTeacher(true)}>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-success"><ShieldCheck size={20} /></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Class Teacher</p><p className="text-sm font-bold text-slate-900">{selectedClass.teachers?.find((t: any) => t.id === selectedClass.class_teacher_id)?.name || 'Assign Now'}</p></div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-secondary"><BookOpen size={20} /></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Subjects</p><p className="text-sm font-bold text-slate-900">{selectedClass.subjects?.length || 0} allocated</p></div>
                </div>

                <div className="ml-auto flex gap-2">
                  <StarButton
                    onClick={() => setShowAssignStudent(true)}
                    variant="outline"
                    className="px-4 py-2 text-[10px] h-10"
                  >
                    <UserPlus size={14} className="mr-2" /> Add Student
                  </StarButton>
                  <StarButton
                    onClick={() => setShowAssignSubject(true)}
                    className="px-4 py-2 bg-brand-secondary/20 hover:bg-brand-secondary text-brand-dark rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 h-10"
                  >
                    <Plus size={14} /> Assign Subject
                  </StarButton>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
                  {(['students', 'schedule', 'teachers'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'students' && (
                    <motion.div key="students" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedClass.students?.map((student: any) => (
                          <div key={student.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold overflow-hidden border-2 border-white">
                              {student.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 truncate group-hover:text-brand-primary transition-colors">{student.name}</p>
                              <p className="text-[10px] text-slate-500 truncate uppercase font-medium">{student.email}</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                      {(!selectedClass.students || selectedClass.students.length === 0) && (
                        <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                          <Users size={48} className="mx-auto text-slate-300 mb-4" />
                          <h4 className="text-lg font-bold text-slate-900 mb-1">No Students Enrolled</h4>
                          <p className="text-sm text-slate-500">Assign students to this class using the "Add Student" button above.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'schedule' && (
                    <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50">
                              <th className="p-4 border-b border-r border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                              {days.map(day => (<th key={day} className="p-4 border-b border-slate-100 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{day}</th>))}
                            </tr>
                          </thead>
                          <tbody>
                            {timeSlots.map((slot, timeIdx) => (
                              <tr key={slot}>
                                <td className="p-4 border-b border-r border-slate-100 text-[10px] font-bold text-slate-500 whitespace-nowrap bg-slate-50/20">{slot}</td>
                                {days.map((day, dayIdx) => {
                                  const subject = selectedClass.subjects?.[(timeIdx + dayIdx) % (selectedClass.subjects?.length || 1)];
                                  return (
                                    <td key={`${day}-${slot}`} className="p-2 border-b border-slate-100 min-w-[140px]">
                                      {subject ? (
                                        <div className={`p-3 rounded-2xl h-full transition-all border ${dayIdx % 3 === 0 ? 'bg-brand-primary/5 border-brand-primary/20 text-brand-primary' : dayIdx % 3 === 1 ? 'bg-brand-success/5 border-brand-success/20 text-brand-success' : 'bg-brand-secondary/5 border-brand-secondary/20 text-brand-secondary'}`}>
                                          <p className="text-[11px] font-black truncate">{subject.name}</p>
                                          <p className="text-[9px] opacity-60 font-bold uppercase tracking-wider">{subject.code}</p>
                                        </div>
                                      ) : (<div className="p-3 rounded-2xl border border-dashed border-slate-100 h-full flex items-center justify-center"><span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Free</span></div>)}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'teachers' && (
                    <motion.div key="teachers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid md:grid-cols-2 gap-6">
                      {selectedClass.teachers?.map((teacher: any) => (
                        <div key={teacher.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all">
                          <div className="w-16 h-16 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center text-brand-primary font-bold overflow-hidden text-xl">
                            {teacher.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors text-lg">{teacher.name}</p>
                              {teacher.id === selectedClass.class_teacher_id && <span className="px-2 py-0.5 bg-brand-primary text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Class Teacher</span>}
                            </div>
                            <p className="text-sm text-slate-500 font-medium">{teacher.email}</p>
                            <div className="mt-3 flex gap-2">
                              <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all uppercase tracking-widest">Contact</button>
                              <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all uppercase tracking-widest">Details</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowAssignTeacher(true)}
                        className="col-span-full text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-brand-success hover:bg-brand-success/5 transition-all group"
                      >
                        <UserCheck size={48} className="mx-auto text-slate-300 mb-4 group-hover:text-brand-success transition-colors" />
                        <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-success transition-colors">Assign Class Teacher</h4>
                        <p className="text-sm text-slate-500">Click to assign or change the primary teacher for this class.</p>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Actions - reveal on tap pattern */}
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center relative">
                <div className="flex gap-2">
                  <StarButton variant="outline" className="px-6 py-2.5 text-xs">Edit Class</StarButton>
                  <button
                    onClick={() => setShowExtraActions(!showExtraActions)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${showExtraActions ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
                  >
                    {showExtraActions ? 'Close Actions' : 'More Actions'}
                  </button>
                </div>

                <AnimatePresence>
                  {showExtraActions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-8 mb-4 p-4 bg-white rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 z-20"
                    >
                      <button className="p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-brand-primary/10 hover:text-brand-primary transition-all flex flex-col items-center gap-1 group">
                        <Printer size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Print Roll</span>
                      </button>
                      <button className="p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-brand-primary/10 hover:text-brand-primary transition-all flex flex-col items-center gap-1">
                        <BookOpen size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Reports</span>
                      </button>
                      <button className="p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-brand-primary/10 hover:text-brand-primary transition-all flex flex-col items-center gap-1">
                        <Bell size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Alert All</span>
                      </button>
                      <div className="w-px h-12 bg-slate-100 mx-2" />
                      <button className="p-4 bg-rose-50 rounded-2xl text-rose-500 hover:bg-rose-100 transition-all flex flex-col items-center gap-1">
                        <Trash2 size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Delete</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status:</p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand-success/10 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                    <span className="text-[10px] font-bold text-brand-success uppercase tracking-widest">Class Active</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay for details */}
      <AnimatePresence>
        {detailLoading && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
            <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-brand-primary" size={40} />
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Fetching Class Details...</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Loader2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
