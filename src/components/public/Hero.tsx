import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import logo from '../../assets/image.png';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-brand-success/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-100 rounded-full opacity-50" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8 flex justify-center"
        >
          <div className="p-8 bg-brand-secondary/20 rounded-full relative group">
            <img src={logo} alt="Little Star" className="w-60 h-60 object-contain group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-brand-secondary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
          </div>
        </motion.div>

        <motion.h1 
          className="font-heading text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Every Child is a <span className="text-brand-primary">Star</span>
        </motion.h1>

        <motion.p 
          className="font-body text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Empowering the next generation with modern education, innovative learning tools, and a supportive growth environment.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <StarButton variant="primary" onClick={() => navigate('/admissions')}>
            Enroll Now
          </StarButton>
          <StarButton variant="outline" onClick={() => navigate('/login')}>
            Explore Portal
          </StarButton>
        </motion.div>
      </div>
    </section>
  );
};
