import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, TrendingUp, Award, Search, Filter, BookOpen } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';

export const ResultsPage = () => {
  const [reportCards, setReportCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await erpService.getReportCards();
        setReportCards(response.data || []);
      } catch (error) {
        console.error('Error fetching report cards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const getGrade = (marks: number) => {
    if (marks >= 90) return { label: 'A+', color: 'text-brand-success bg-brand-success/10' };
    if (marks >= 80) return { label: 'A', color: 'text-brand-success bg-brand-success/10' };
    if (marks >= 70) return { label: 'B', color: 'text-brand-secondary bg-brand-secondary/10' };
    if (marks >= 60) return { label: 'C', color: 'text-brand-secondary bg-brand-secondary/10' };
    return { label: 'D', color: 'text-red-500 bg-red-100' };
  };

  const filteredResults = reportCards.filter(rc => 
    rc.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rc.subject_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Academic Results</h1>
          <p className="text-slate-500">View and manage student report cards and term-wise grading.</p>
        </div>
        <div className="flex items-center gap-3">
          <StarButton variant="outline" className="flex items-center gap-2">
            <Filter size={18} /> Filter Term
          </StarButton>
          <StarButton variant="primary" className="flex items-center gap-2">
            <Award size={18} /> Release Results
          </StarButton>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <GlassCard className="bg-white border-none shadow-md p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
            <BookOpen size={24} />
          </div>
          <p className="text-sm font-bold text-slate-900">Average Grade</p>
          <p className="text-3xl font-bold text-brand-primary mt-1">A</p>
        </GlassCard>
        <GlassCard className="bg-white border-none shadow-md p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-success/10 text-brand-success flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm font-bold text-slate-900">Pass Rate</p>
          <p className="text-3xl font-bold text-brand-success mt-1">98.2%</p>
        </GlassCard>
        <GlassCard className="bg-white border-none shadow-md p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center mb-4">
            <Award size={24} />
          </div>
          <p className="text-sm font-bold text-slate-900">Top Performers</p>
          <p className="text-3xl font-bold text-brand-secondary mt-1">12</p>
        </GlassCard>
        <GlassCard className="bg-white border-none shadow-md p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <p className="text-sm font-bold text-slate-900">Total Graded</p>
          <p className="text-3xl font-bold text-brand-accent mt-1">{reportCards.length}</p>
        </GlassCard>
      </div>

      <GlassCard className="bg-white border-none shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student or subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            />
          </div>
          <StarButton variant="outline" className="flex items-center gap-2">
            <Download size={18} /> Bulk Download
          </StarButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4 text-center">Term</th>
                <th className="px-6 py-4 text-center">Marks</th>
                <th className="px-6 py-4 text-center">Grade</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-400">Loading results...</td></tr>
              ) : filteredResults.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-400">No report cards found.</td></tr>
              ) : filteredResults.map((rc, i) => {
                const grade = getGrade(rc.marks);
                return (
                  <motion.tr 
                    key={rc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{rc.student_name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Class {rc.class_name} - {rc.section}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{rc.subject_name}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                        {rc.term}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                      {rc.marks}/100
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${grade.color}`}>
                        {grade.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 hover:bg-brand-primary/10 text-brand-primary rounded-lg transition-all" title="View/Download">
                        <Download size={18} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
