import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { useAuth } from '../../context/AuthContext';
import { erpService } from '../../services/erpService';

import { useNotification } from '../../components/ui/Notification';

export const SettingsPage = () => {
  const { showNotification } = useNotification();
  const { user, login, token } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contact_number: '' // If we had it in context
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await erpService.updateUser(user.id, profileData);
      showNotification('Profile updated successfully!', 'success');
      if (token) {
        login(token, { ...user, name: profileData.name, email: profileData.email });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showNotification(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">Manage your profile, security, and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-2 flex-shrink-0">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
          >
            <User size={18} /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'security' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
          >
            <Lock size={18} /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'notifications' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
          >
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="bg-white border-none shadow-md p-8">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{user?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield size={14} className="text-brand-success" />
                      <span className="text-sm font-medium text-slate-500">{user?.role || 'User'}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <StarButton type="submit" variant="primary" disabled={isSubmitting} className="px-8">
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Changes</>}
                    </StarButton>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="bg-white border-none shadow-md p-8">
                <h3 className="font-bold text-xl text-slate-900 mb-6">Change Password</h3>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); showNotification('Password reset flow would be triggered here.', 'info'); }}>
                  <div className="space-y-2 max-w-md">
                    <label className="text-sm font-bold text-slate-700">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="text-sm font-bold text-slate-700">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                  </div>
                  <div className="pt-6 border-t border-slate-100">
                    <StarButton type="submit" variant="primary" className="px-8">
                      Update Password
                    </StarButton>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="bg-white border-none shadow-md p-8">
                <h3 className="font-bold text-xl text-slate-900 mb-6">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Security Alerts', desc: 'Get notified when someone logs into your account.' },
                    { title: 'New Messages', desc: 'Receive an email when you get a new direct message.' },
                    { title: 'System Updates', desc: 'Receive announcements about new features.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
