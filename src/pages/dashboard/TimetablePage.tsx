import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, User, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { erpService } from '../../services/erpService';

export const TimetablePage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [classDetails, setClassDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await erpService.getClasses();
        setClasses(response.data || []);
        if (response.data.length > 0) {
          handleSelectClass(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSelectClass = async (classId: string) => {
    setLoading(true);
    try {
      const response = await erpService.getClassDetails(classId);
      setClassDetails(response.data);
      setSelectedClass(classes.find(c => c.id === classId) || response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00 AM', '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Academic Schedule</h1>
          <p className="text-slate-500">Manage timetables and subject allocations for all classes.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Class List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest px-2">Classes</h3>
          <div className="space-y-2">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => handleSelectClass(cls.id)}
                className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
                  selectedClass?.id === cls.id 
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-md' 
                    : 'border-transparent bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Class {cls.name}</span>
                  <span className="text-xs px-2 py-1 bg-white rounded-lg shadow-sm border border-slate-100 uppercase">{cls.section}</span>
                </div>
                <p className="text-xs mt-1 opacity-70">{cls.academic_year}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Schedule Area */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading schedule...</div>
          ) : !classDetails ? (
            <div className="py-20 text-center text-slate-400">Select a class to view its schedule.</div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                <GlassCard className="bg-brand-primary text-white border-none p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Allocated Subjects</p>
                    <p className="text-2xl font-bold">{classDetails.subjects?.length || 0}</p>
                  </div>
                </GlassCard>
                <GlassCard className="bg-white border-none shadow-md p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-success/10 text-brand-success flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Class Teacher</p>
                    <p className="text-xl font-bold text-slate-900">{classDetails.teachers?.[0]?.name || 'N/A'}</p>
                  </div>
                </GlassCard>
                <GlassCard className="bg-white border-none shadow-md p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Academic Year</p>
                    <p className="text-xl font-bold text-slate-900">{classDetails.academic_year}</p>
                  </div>
                </GlassCard>
              </div>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Clock size={20} className="text-brand-primary" />
                    Weekly Schedule
                  </h3>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-primary" />
                    <span className="w-3 h-3 rounded-full bg-brand-success" />
                    <span className="w-3 h-3 rounded-full bg-brand-secondary" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 border-b border-r border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase">Time / Day</th>
                        {days.map(day => (
                          <th key={day} className="p-4 border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-900 uppercase">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((slot, timeIdx) => (
                        <tr key={slot}>
                          <td className="p-4 border-b border-r border-slate-100 bg-slate-50/10 text-xs font-bold text-slate-500 whitespace-nowrap">{slot}</td>
                          {days.map((day, dayIdx) => {
                            const subject = classDetails.subjects?.[(timeIdx + dayIdx) % (classDetails.subjects?.length || 1)];
                            return (
                              <td key={`${day}-${slot}`} className="p-2 border-b border-slate-100 group min-w-[150px]">
                                {subject ? (
                                  <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-3 rounded-xl h-full transition-all cursor-pointer ${
                                      dayIdx % 3 === 0 ? 'bg-brand-primary/5 border border-brand-primary/20 text-brand-primary' :
                                      dayIdx % 3 === 1 ? 'bg-brand-success/5 border border-brand-success/20 text-brand-success' :
                                      'bg-brand-secondary/5 border border-brand-secondary/20 text-brand-secondary'
                                    }`}
                                  >
                                    <p className="text-xs font-bold truncate">{subject.name}</p>
                                    <p className="text-[10px] opacity-60 font-medium">{subject.code}</p>
                                  </motion.div>
                                ) : (
                                  <div className="p-3 rounded-xl border border-dashed border-slate-100 h-full flex items-center justify-center">
                                    <span className="text-[10px] text-slate-300">Free Period</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subject Details */}
              <div className="grid md:grid-cols-2 gap-8">
                <GlassCard className="bg-white border-none shadow-md p-8">
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BookOpen size={24} className="text-brand-primary" />
                    Subject Allocation
                  </h3>
                  <div className="space-y-4">
                    {classDetails.subjects?.map((sub: any) => (
                      <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-brand-primary/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-primary font-bold">
                            {sub.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{sub.name}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">{sub.code}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="bg-white border-none shadow-md p-8">
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User size={24} className="text-brand-success" />
                    Teachers Assigned
                  </h3>
                  <div className="space-y-4">
                    {classDetails.teachers?.map((teacher: any) => (
                      <div key={teacher.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-brand-success/5 transition-all">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-success font-bold overflow-hidden">
                          {teacher.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-brand-success transition-colors">{teacher.name}</p>
                          <p className="text-xs text-slate-500">{teacher.email}</p>
                        </div>
                      </div>
                    ))}
                    {(!classDetails.teachers || classDetails.teachers.length === 0) && (
                      <p className="text-center py-8 text-slate-400">No teachers assigned yet.</p>
                    )}
                  </div>
                </GlassCard>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
