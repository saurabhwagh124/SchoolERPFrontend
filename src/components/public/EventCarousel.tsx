import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { erpService } from '../../services/erpService';
import { GlassCard } from '../ui/GlassCard';

export const EventCarousel = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await erpService.getEvents();
        // Show only public events if visibility exists, else all
        const publicEvents = response.data.filter((e: any) => e.visibility === 'all' || !e.visibility);
        setEvents(publicEvents.slice(0, 5)); // Latest 5 events
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % events.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);

  if (loading || events.length === 0) return null;

  const currentEvent = events[currentIndex];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-heading text-4xl font-bold text-slate-900 mb-2">School Events</h2>
            <p className="text-slate-500">Stay updated with the latest happenings at Little Star Kids Academy.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={prev} className="p-3 rounded-full border border-slate-200 hover:bg-brand-primary hover:text-white transition-all text-slate-600">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="p-3 rounded-full border border-slate-200 hover:bg-brand-primary hover:text-white transition-all text-slate-600">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="relative h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute inset-0"
            >
              <GlassCard className="h-full border-none shadow-2xl bg-gradient-to-br from-brand-primary/5 to-white p-0 overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-brand-primary relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050853063-913c6e94ecf4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar size={120} className="text-white/20" />
                  </div>
                </div>
                <div className="p-12 md:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-bold flex items-center gap-2">
                      <Clock size={16} /> {new Date(currentEvent.date).toLocaleDateString()}
                    </div>
                    <div className="px-4 py-2 bg-brand-success/10 text-brand-success rounded-full text-sm font-bold">
                      Upcoming
                    </div>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-slate-900 mb-4">{currentEvent.title}</h3>
                  <p className="font-body text-slate-600 text-lg mb-8 leading-relaxed">
                    {currentEvent.description}
                  </p>
                  <button className="self-start text-brand-primary font-bold flex items-center gap-2 group hover:gap-3 transition-all">
                    Learn More <ChevronRight size={20} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentIndex ? 'bg-brand-primary w-8' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
