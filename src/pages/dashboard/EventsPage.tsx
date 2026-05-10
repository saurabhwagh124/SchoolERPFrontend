import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, MapPin, Users, Info, Bell, FileText, ChevronRight, X } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';

export const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', visibility: 'all' });

  const fetchEvents = async () => {
    try {
      const response = await erpService.getEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await erpService.createEvent(newEvent);
      setShowAddModal(false);
      setNewEvent({ title: '', description: '', date: '', visibility: 'all' });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await erpService.deleteEvent(id);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const notices = [
    { id: 1, title: 'Annual Sports Meet 2026', date: '2026-06-15', category: 'Sports', urgency: 'high' },
    { id: 2, title: 'Summer Vacation Circular', date: '2026-05-20', category: 'Academic', urgency: 'medium' },
    { id: 3, title: 'New ERP System Training', date: '2026-05-12', category: 'Staff', urgency: 'low' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Community & Events</h1>
          <p className="text-slate-500">Manage school events, notices, and community circulars.</p>
        </div>
        <StarButton variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Schedule Event
        </StarButton>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="text-brand-primary" /> Upcoming Events
          </h2>
          
          <div className="grid gap-4">
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No upcoming events scheduled.</div>
            ) : events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="bg-white border-none shadow-md p-6 group hover:shadow-xl transition-all">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center justify-center w-20 h-20 bg-brand-primary/5 rounded-2xl text-brand-primary border border-brand-primary/10">
                      <span className="text-xs font-bold uppercase tracking-widest">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-3xl font-bold leading-none">{new Date(event.event_date).getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{event.title}</h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description || 'No description provided.'}</p>
                        </div>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                          <MapPin size={14} /> Main Auditorium
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                          <Users size={14} /> {event.visibility === 'all' ? 'Open to All' : 'Staff Only'}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-brand-success">
                          <Info size={14} /> 24 Registered
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notice Board Sidebar */}
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="text-brand-secondary" /> Notice Board
          </h2>
          
          <div className="space-y-4">
            {notices.map((notice) => (
              <GlassCard key={notice.id} className="bg-white border-none shadow-md p-5 group hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    notice.urgency === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse' :
                    notice.urgency === 'medium' ? 'bg-brand-secondary' : 'bg-slate-300'
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{notice.category}</p>
                    <h4 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{notice.title}</h4>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] font-medium text-slate-400">{new Date(notice.date).toLocaleDateString()}</span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
            
            <GlassCard className="bg-brand-primary/5 border-dashed border-2 border-brand-primary/20 p-6 text-center group hover:bg-brand-primary/10 transition-all cursor-pointer">
              <FileText className="mx-auto text-brand-primary mb-2" size={24} />
              <p className="font-bold text-brand-primary text-sm">View All Circulars</p>
              <p className="text-[10px] text-slate-500 mt-1">Access historical notices and documents</p>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-8 bg-brand-primary text-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">Schedule New Event</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-white/70 text-sm">Fill in the details to broadcast a new school event.</p>
              </div>
              
              <form onSubmit={handleAddEvent} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Event Title</label>
                  <input 
                    type="text" 
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="e.g. Science Fair 2026"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Visibility</label>
                    <select 
                      value={newEvent.visibility}
                      onChange={(e) => setNewEvent({...newEvent, visibility: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    >
                      <option value="all">Public (All)</option>
                      <option value="students">Students Only</option>
                      <option value="staff">Staff Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea 
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="Tell us more about the event..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <StarButton variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</StarButton>
                  <StarButton variant="primary" type="submit" className="flex-1">Create Event</StarButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
