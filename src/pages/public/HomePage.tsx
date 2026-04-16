import { Hero } from '../../components/public/Hero';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { Users, BookOpen, Trophy } from 'lucide-react';

export const HomePage = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-brand-blue" />,
      title: "Expert Faculty",
      description: "Dedicated educators committed to nurturing every child's potential."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-brand-green" />,
      title: "Modern Curriculum",
      description: "A balanced blend of academic excellence and co-curricular activities."
    },
    {
      icon: <Trophy className="w-8 h-8 text-brand-yellow" />,
      title: "Global Recognition",
      description: "Award-winning programs recognized for excellence in EdTech integration."
    }
  ];

  return (
    <div>
      <Hero />
      
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Why Choose Star School?</h2>
            <p className="font-body text-slate-600 max-w-2xl mx-auto">
              We provide a safe, engaging, and innovative environment where students can shine in their own unique way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <GlassCard className="h-full hover:shadow-xl transition-shadow border-none bg-white">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="font-body text-slate-600">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
