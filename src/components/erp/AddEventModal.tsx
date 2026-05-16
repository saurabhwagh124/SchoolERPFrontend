import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ImageIcon, Upload, Loader2 } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { erpService } from '../../services/erpService';
import { useNotification } from '../ui/Notification';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);
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
      showNotification('Event created successfully!', 'success');
      onSuccess();
      onClose();
      setNewEvent({ title: '', description: '', date: '', visibility: 'all', posterImage: null });
    } catch (error) {
      console.error('Error creating event:', error);
      showNotification('Failed to create event. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden" >
            <div className="p-8 bg-brand-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-2xl font-bold font-heading">Schedule New Event</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
              </div>
              <p className="text-white/70 text-sm relative z-10">Fill in the details to broadcast a new school event.</p>
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
                <input type="text" required value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" placeholder="e.g. Science Fair 2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Date</label>
                  <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Visibility</label>
                  <select value={newEvent.visibility} onChange={(e) => setNewEvent({ ...newEvent, visibility: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" >
                    <option value="all">Public (All)</option>
                    <option value="students">Students Only</option>
                    <option value="staff">Staff Only</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea rows={2} value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none" placeholder="Tell us more about the event..." />
              </div>
              <div className="flex gap-4 pt-2">
                <StarButton variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>Cancel</StarButton>
                <StarButton variant="primary" type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Create Event'}</StarButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
