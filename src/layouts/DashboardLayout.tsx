import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Star,
  Bell,
  GraduationCap,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/image.png';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Admissions', icon: <Users size={20} />, path: '/dashboard/admissions' },
    { name: 'Students', icon: <GraduationCap size={20} />, path: '/dashboard/students' },
    { name: 'Attendance', icon: <Calendar size={20} />, path: '/dashboard/attendance' },
    { name: 'Academic Schedule', icon: <Clock size={20} />, path: '/dashboard/timetable' },
    { name: 'Fees & Invoices', icon: <CreditCard size={20} />, path: '/dashboard/fees' },
    { name: 'Academic Results', icon: <FileText size={20} />, path: '/dashboard/results' },
    { name: 'Community Events', icon: <Star size={20} />, path: '/dashboard/events' },
    { name: 'Classes', icon: <Users size={20} />, path: '/dashboard/classes' },
    { name: 'Subjects', icon: <FileText size={20} />, path: '/dashboard/subjects' },
    { name: 'Leave Management', icon: <Calendar size={20} />, path: '/dashboard/leaves' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'
        }`}>
        <div className={`flex items-center gap-3 border-b border-slate-100 transition-all duration-300 ${isSidebarOpen ? 'h-32 px-6' : 'h-20 px-4'}`}>
          <img src={logo} alt="Little Star Logo" className={`${isSidebarOpen ? 'w-24 h-24' : 'w-12 h-12'} object-contain transition-all`} />
          {isSidebarOpen && (
            <span className="font-heading text-base font-bold bg-gradient-to-r from-slate-900 to-brand-primary bg-clip-text text-transparent leading-tight">
              Little Star<br />Kids Academy
            </span>
          )}
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${location.pathname === item.path
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                : 'text-slate-600 hover:bg-slate-50 hover:text-brand-primary'
                }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 text-slate-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-32 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden lg:block">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Portal Access</h2>
              <p className="text-lg font-bold text-slate-900">Little Star Kids Academy</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-yellow rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-slate-500">School Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                {user?.name?.[0] || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
