import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Check, X, AlertCircle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';

export const AttendancePage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showClasses, setShowClasses] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await erpService.getClasses();
        setClasses(response.data);
        // Don't auto-select to show cards
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchStudents = async () => {
      setLoading(true);
      setShowClasses(false);
      try {
        const response = await erpService.getClassDetails(selectedClass);
        setStudents(response.data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleMarkAttendance = async (studentId: string, status: string) => {
    try {
      await erpService.markAttendance({
        student_id: studentId,
        class_id: selectedClass,
        date: new Date().toISOString().split('T')[0],
        status: status
      });
      // Refresh students to show updated status
      const response = await erpService.getClassDetails(selectedClass);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            {showClasses ? 'Select Class' : `Attendance: ${classes.find(c => c.id === selectedClass)?.name || ''}`}
          </h1>
          <p className="text-slate-500">
            {showClasses ? 'Choose a class to mark attendance.' : 'Mark and manage daily attendance for the selected class.'}
          </p>
        </div>
        {!showClasses && (
          <StarButton variant="outline" onClick={() => setShowClasses(true)}>
            Back to Classes
          </StarButton>
        )}
      </div>

      {showClasses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedClass(cls.id)}
              className="cursor-pointer group"
            >
              <GlassCard className="h-full bg-white border-none shadow-md hover:shadow-xl hover:bg-brand-primary/5 transition-all p-8 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
                <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <Search size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Class {cls.name}</h3>
                  <p className="text-slate-500 font-medium">Section {cls.section}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 w-full flex justify-between text-sm">
                  <span className="text-slate-400">Total Students</span>
                  <span className="font-bold text-slate-900">{cls.student_count || 0}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <GlassCard className="bg-white border-none shadow-md p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
            <input 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Roll No</th>
                  <th className="px-6 py-4 font-bold">Student Name</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading students...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">No students found in this class.</td></tr>
                ) : students.map((student, i) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-600">#{i + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        student.status === 'present' ? 'bg-green-100 text-green-600' :
                        student.status === 'absent' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {student.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleMarkAttendance(student.id, 'present')}
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors" title="Mark Present"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleMarkAttendance(student.id, 'absent')}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Mark Absent"
                        >
                          <X size={18} />
                        </button>
                        <button 
                          onClick={() => handleMarkAttendance(student.id, 'late')}
                          className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors" title="Mark Late"
                        >
                          <AlertCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
