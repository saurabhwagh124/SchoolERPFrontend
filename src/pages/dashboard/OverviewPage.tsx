import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, Trophy, ArrowUpRight, TrendingUp, FileText } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { erpService } from '../../services/erpService';
import { AddStudentModal } from '../../components/erp/AddStudentModal';
import { AddEventModal } from '../../components/erp/AddEventModal';
import { CollectFeeModal } from '../../components/erp/CollectFeeModal';

export const OverviewPage = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await erpService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: <Users />, color: 'bg-brand-primary' },
    { label: 'Active Classes', value: stats.totalClasses, icon: <BookOpen />, color: 'bg-brand-success' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: <Calendar />, color: 'bg-brand-secondary' },
    { label: 'Academic Rank', value: '#1', icon: <Trophy />, color: 'bg-brand-accent' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back to Little Star Kids Academy Management System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="border-none shadow-md hover:shadow-lg transition-all p-6 bg-white flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${card.color} text-white`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : card.value}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 bg-white border-none shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-xl font-bold text-slate-900">Recent Attendance Trends</h2>
            <button className="text-brand-primary text-sm font-bold flex items-center gap-1">
              View Report <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
            <div className="text-center text-slate-400">
              <TrendingUp size={48} className="mx-auto mb-2 opacity-20" />
              <p>Attendance visualization coming soon</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-white border-none shadow-md p-8">
          <h2 className="font-heading text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={() => setShowStudentModal(true)}
              className="w-full p-4 bg-slate-50 rounded-xl flex items-center gap-4 hover:bg-brand-primary/5 hover:text-brand-primary transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                <Users size={18} />
              </div>
              <span className="font-bold text-sm">Enroll New Student</span>
            </button>
            <button 
              onClick={() => setShowEventModal(true)}
              className="w-full p-4 bg-slate-50 rounded-xl flex items-center gap-4 hover:bg-brand-success/5 hover:text-brand-success transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success group-hover:bg-brand-success group-hover:text-white transition-all">
                <Calendar size={18} />
              </div>
              <span className="font-bold text-sm">Schedule Event</span>
            </button>
            <button 
              onClick={() => setShowFeeModal(true)}
              className="w-full p-4 bg-slate-50 rounded-xl flex items-center gap-4 hover:bg-brand-secondary/5 hover:text-brand-secondary transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all">
                <FileText size={18} />
              </div>
              <span className="font-bold text-sm">Collect Fee</span>
            </button>
          </div>
        </GlassCard>
      </div>

      <AddStudentModal 
        isOpen={showStudentModal} 
        onClose={() => setShowStudentModal(false)} 
        onSuccess={fetchStats}
      />

      <AddEventModal 
        isOpen={showEventModal} 
        onClose={() => setShowEventModal(false)} 
        onSuccess={fetchStats}
      />

      <CollectFeeModal 
        isOpen={showFeeModal} 
        onClose={() => setShowFeeModal(false)} 
        onSuccess={fetchStats}
      />
    </div>
  );
};
