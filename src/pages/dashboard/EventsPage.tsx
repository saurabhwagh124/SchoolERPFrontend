import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, MapPin, Users, Info, Bell, FileText, ChevronRight, X, Image as ImageIcon, Upload, Loader2, MoreVertical, PlusSquare, Maximize2 } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { erpService } from '../../services/erpService';
import { useNotification } from '../../components/ui/Notification';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export const EventsPage = () => {
  const { showNotification } = useNotification();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState<any>(null);
  const [showLightbox, setShowLightbox] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState<{
    title: string;
    description: string;
    date: string;
    visibility: string;
    posterImage: File | null;
  }>({
    title: '',
    description: '',
    date: '',
    visibility: 'all',
    posterImage: null
  });

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', newEvent.title);
      formData.append('description', newEvent.description);
      formData.append('date', newEvent.date);
      formData.append('visibility', newEvent.visibility);
      if (newEvent.posterImage) {
        formData.append('posterImage', newEvent.posterImage);
      }

      await erpService.createEvent(formData);
      setShowAddModal(false);
      setNewEvent({ title: '', description: '', date: '', visibility: 'all', posterImage: null });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddGalleryImages = async (eventId: string) => {
    if (galleryFiles.length === 0) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      galleryFiles.forEach(file => {
        formData.append('galleryImages', file);
      });

      await erpService.updateEvent(eventId, formData);
      setGalleryFiles([]);
      setShowGalleryModal(null);
      fetchEvents();
    } catch (error) {
      console.error('Error updating gallery:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setEventToDelete(id);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await erpService.deleteEvent(eventToDelete);
      showNotification('Event deleted successfully', 'success');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      showNotification('Failed to delete event', 'error');
    } finally {
      setEventToDelete(null);
    }
  };

  const notices = [
    { id: 1, title: 'Annual Sports Meet 2026', date: '2026-06-15', category: 'Sports', urgency: 'high' },
    { id: 2, title: 'Summer Vacation Circular', date: '2026-05-20', category: 'Academic', urgency: 'medium' },
    { id: 3, title: 'New ERP System Training', date: '2026-05-12', category: 'Staff', urgency: 'low' },
  ];

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1881';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Community & Events</h1>
          <p className="text-slate-500">Manage school events, posters, and post-event memories.</p>
        </div>
        <StarButton variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Schedule Event
        </StarButton>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
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
                <GlassCard
                  onClick={() => setShowDetailModal(event)}
                  className="bg-white border-none shadow-md p-6 group hover:shadow-xl transition-all overflow-visible cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {event.poster_image ? (
                      <div className="w-full md:w-40 h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0 bg-slate-50 relative">
                        <img
                          src={`${API_URL}/${event.poster_image}`}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLightbox(`${API_URL}/${event.poster_image}`);
                          }}
                          className="absolute bottom-2 right-2 p-2 bg-white/20 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
                        >
                          <Maximize2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-40 h-40 bg-brand-primary/5 rounded-2xl text-brand-primary border border-brand-primary/10 flex-shrink-0">
                        <span className="text-xs font-bold uppercase tracking-widest">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-4xl font-bold leading-none">{new Date(event.event_date).getDate()}</span>
                      </div>
                    )}

                    <div className="flex-1 w-full relative">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{event.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-xs font-medium text-slate-500">{new Date(event.event_date).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                          </div>
                        </div>

                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === event.id ? null : event.id);
                            }}
                            className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-all"
                          >
                            <MoreVertical size={20} />
                          </button>

                          <AnimatePresence>
                            {activeMenu === event.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 py-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    setShowGalleryModal(event);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary transition-all text-left"
                                >
                                  <PlusSquare size={18} /> Add Images
                                </button>
                                <div className="h-px bg-slate-50 my-1 mx-2" />
                                <button
                                  onClick={() => {
                                    handleDelete(event.id);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-all text-left"
                                >
                                  <Trash2 size={18} /> Delete Event
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{event.description || 'No description provided for this event.'}</p>

                      {event.gallery_images && event.gallery_images.length > 0 && (
                        <div className="mt-6">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Event Gallery</p>
                          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {event.gallery_images.map((img: string, idx: number) => (
                              <motion.div
                                key={idx}
                                whileHover={{ scale: 1.1, zIndex: 1 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowLightbox(`${API_URL}/${img}`);
                                }}
                                className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-md ring-1 ring-slate-100 cursor-zoom-in"
                              >
                                <img src={`${API_URL}/${img}`} className="w-full h-full object-cover" />
                              </motion.div>
                            ))}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowGalleryModal(event);
                              }}
                              className="w-16 h-16 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all flex-shrink-0"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                          <MapPin size={14} className="text-brand-primary" /> Campus Main
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                          <Users size={14} className="text-brand-secondary" /> {event.visibility === 'all' ? 'Open to All' : 'Private'}
                        </div>
                        {event.gallery_images?.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-success uppercase tracking-tight">
                            <ImageIcon size={14} /> {event.gallery_images.length} Photos
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="text-brand-secondary" /> Notice Board
          </h2>

          <div className="space-y-4">
            {notices.map((notice) => (
              <GlassCard key={notice.id} className="bg-white border-none shadow-md p-5 group hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notice.urgency === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse' :
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

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden" >
              <div className="p-8 bg-brand-primary text-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">Schedule New Event</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
                </div>
                <p className="text-white/70 text-sm">Fill in the details to broadcast a new school event.</p>
              </div>

              <form onSubmit={handleAddEvent} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Event Poster (Optional)</label>
                  <div onClick={() => posterInputRef.current?.click()} className={`h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${newEvent.posterImage ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 hover:border-brand-primary hover:bg-slate-50'}`} >
                    {newEvent.posterImage ? (
                      <div className="flex flex-col items-center"><ImageIcon className="text-brand-primary mb-1" size={24} /><p className="text-xs font-bold text-slate-700">{newEvent.posterImage.name}</p></div>
                    ) : (
                      <><Upload className="text-slate-400 mb-1" size={24} /><p className="text-xs font-medium text-slate-500">Click to upload poster</p></>
                    )}
                  </div>
                  <input type="file" ref={posterInputRef} className="hidden" accept="image/*" onChange={(e) => setNewEvent({ ...newEvent, posterImage: e.target.files?.[0] || null })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Event Title</label>
                  <input type="text" required value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" placeholder="e.g. Science Fair 2026" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Date</label>
                    <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Visibility</label>
                    <select value={newEvent.visibility} onChange={(e) => setNewEvent({ ...newEvent, visibility: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" >
                      <option value="all">Public (All)</option>
                      <option value="students">Students Only</option>
                      <option value="staff">Staff Only</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea rows={2} value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none" placeholder="Tell us more about the event..." />
                </div>
                <div className="flex gap-4 pt-2">
                  <StarButton variant="outline" className="flex-1" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>Cancel</StarButton>
                  <StarButton variant="primary" type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Create Event'}</StarButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col" >
              <div className="absolute top-6 right-6 z-20">
                <button onClick={() => setShowDetailModal(null)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20"><X size={24} /></button>
              </div>
              <div className="overflow-y-auto flex-1 scrollbar-hide">
                <div className="relative h-[400px] bg-slate-900">
                  {showDetailModal.poster_image ? (
                    <img
                      src={`${API_URL}/${showDetailModal.poster_image}`}
                      className="w-full h-full object-cover opacity-80 cursor-zoom-in"
                      alt={showDetailModal.title}
                      onClick={() => setShowLightbox(`${API_URL}/${showDetailModal.poster_image}`)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-secondary/40"><Calendar size={80} className="text-white/20" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-3 mb-4"><span className="px-3 py-1 bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">Upcoming Event</span><span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{showDetailModal.visibility === 'all' ? 'Open to All' : 'Private'}</span></div>
                    <h2 className="text-5xl font-black text-white font-heading mb-4 leading-tight">{showDetailModal.title}</h2>
                    <div className="flex flex-wrap items-center gap-6 text-white/80"><div className="flex items-center gap-2"><Calendar size={18} className="text-brand-secondary" /><span className="font-bold text-sm">{new Date(showDetailModal.event_date).toLocaleDateString(undefined, { dateStyle: 'full' })}</span></div><div className="flex items-center gap-2"><MapPin size={18} className="text-brand-primary" /><span className="font-bold text-sm">Main School Campus</span></div></div>
                  </div>
                </div>
                <div className="p-10 space-y-12">
                  <div className="max-w-3xl"><h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Description</h3><p className="text-xl text-slate-600 leading-relaxed font-body">{showDetailModal.description || 'No description provided for this event.'}</p></div>
                  <div>
                    <div className="flex items-center justify-between mb-8"><div><h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Event Gallery</h3><p className="text-xs text-slate-500">{showDetailModal.gallery_images?.length || 0} high-quality captures</p></div><StarButton variant="outline" className="px-6 py-2" onClick={() => { setShowGalleryModal(showDetailModal); setShowDetailModal(null); }}><Plus size={16} className="mr-2" /> Add Photos</StarButton></div>
                    {showDetailModal.gallery_images?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {showDetailModal.gallery_images.map((img: string, idx: number) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setShowLightbox(`${API_URL}/${img}`)}
                            className={`rounded-3xl overflow-hidden shadow-xl border border-slate-100 cursor-zoom-in ${idx % 4 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                          >
                            <img src={`${API_URL}/${img}`} className="w-full h-full object-cover min-h-[200px]" alt={`Event capture ${idx + 1}`} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center"><ImageIcon size={48} className="mx-auto text-slate-300 mb-4" /><h4 className="text-lg font-bold text-slate-900 mb-1">No Memories Captured Yet</h4><p className="text-sm text-slate-500">The gallery will be updated once the event begins.</p></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex -space-x-3">{[1, 2, 3, 4].map(i => (<div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">U{i}</div>))}<div className="w-10 h-10 rounded-full border-2 border-white bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary">+24</div></div>
                <div className="flex gap-4">
                  <StarButton variant="outline" onClick={() => { setEventToDelete(showDetailModal); setShowDetailModal(null); }} className="text-rose-500 border-rose-100 hover:bg-rose-50">Delete Event</StarButton>
                  <StarButton 
                    variant="primary" 
                    className="px-10" 
                    onClick={async () => {
                      try {
                        await erpService.rsvpToEvent(showDetailModal.id);
                        showNotification('RSVP successful!', 'success');
                        fetchEvents();
                      } catch (error: any) {
                        showNotification(error.response?.data?.message || 'Failed to RSVP. You might have already RSVPed.', 'error');
                      }
                    }}
                  >
                    RSVP to Event
                  </StarButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGalleryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGalleryModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden" >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div><h2 className="text-xl font-bold text-slate-900">{showGalleryModal.title} - Gallery</h2><p className="text-xs text-slate-500">Capture and share event memories.</p></div>
                <button onClick={() => setShowGalleryModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {showGalleryModal.gallery_images?.map((img: string, idx: number) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-100 cursor-zoom-in" onClick={() => setShowLightbox(`${API_URL}/${img}`)}><img src={`${API_URL}/${img}`} className="w-full h-full object-cover" /></div>
                  ))}
                  <div onClick={() => galleryInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-slate-400 hover:text-brand-primary"><Plus size={24} /><span className="text-[10px] font-bold uppercase mt-1">Add</span></div>
                </div>
                {galleryFiles.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3"><ImageIcon className="text-brand-primary" /><span className="text-sm font-bold text-slate-700">{galleryFiles.length} images selected</span></div>
                    <StarButton variant="primary" className="px-4 py-2 text-xs" onClick={() => handleAddGalleryImages(showGalleryModal.id)} disabled={isSubmitting}>{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Upload Now'}</StarButton>
                  </div>
                )}
                <input type="file" ref={galleryInputRef} className="hidden" multiple accept="image/*" onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLightbox(null)}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setShowLightbox(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-brand-primary transition-all"
              >
                <X size={32} />
              </button>
              <img
                src={showLightbox}
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain border-4 border-white/10"
                alt="Fullscreen Preview"
              />
              <div className="mt-6 flex items-center gap-4">
                <StarButton variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={() => setShowLightbox(null)}>
                  Close Preview
                </StarButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!eventToDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This will also remove all associated images and data. This action cannot be undone."
        confirmLabel="Delete Event"
        onConfirm={confirmDelete}
        onCancel={() => setEventToDelete(null)}
        variant="danger"
      />
    </div>
  );
};
