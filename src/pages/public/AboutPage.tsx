import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { Star, Target, Heart, Shield } from 'lucide-react';

export const AboutPage = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-brand-primary" />,
      title: "Excellence",
      description: "Striving for the highest standards in academics and character building.",
      color: "bg-brand-primary/10"
    },
    {
      icon: <Heart className="w-8 h-8 text-brand-success" />,
      title: "Compassion",
      description: "Nurturing a supportive environment where every child feels valued.",
      color: "bg-brand-success/10"
    },
    {
      icon: <Shield className="w-8 h-8 text-brand-secondary" />,
      title: "Integrity",
      description: "Fostering honesty, responsibility, and ethical behavior in our students.",
      color: "bg-brand-secondary/10"
    },
    {
      icon: <Star className="w-8 h-8 text-brand-primary" />,
      title: "Innovation",
      description: "Embracing modern technology and creative teaching methodologies.",
      color: "bg-brand-primary/10"
    }
  ];

  const stats = [
    { label: "Students", value: "1200+" },
    { label: "Faculty", value: "85+" },
    { label: "Awards", value: "25+" },
    { label: "Years", value: "15+" }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-heading text-5xl md:text-6xl font-bold text-slate-900 mb-6"
            >
              Nurturing <span className="text-brand-primary">Stars</span> for Tomorrow
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-body text-xl text-slate-600 mb-8"
            >
              At Little Star Kids Academy, we believe that every child possesses a unique sparkle. Our mission is to provide the perfect environment for that potential to shine through academic excellence and holistic development.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="text-center bg-white border-none shadow-md">
                  <h3 className="text-3xl font-bold text-brand-primary mb-1">{stat.value}</h3>
                  <p className="text-slate-500 font-medium">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="font-body text-slate-600 max-w-2xl mx-auto">
              The pillars that support our educational philosophy and guide our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full bg-white border-none shadow-xl group">
                  <div className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {value.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="font-body text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand-primary/20 rounded-[2rem] rotate-3" />
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1544717297-fa154da09f9d?w=800&auto=format&fit=crop&q=60"
                    alt="Principal"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-[1.5]"
            >
              <h2 className="font-heading text-4xl font-bold text-slate-900 mb-6">Message from the Principal</h2>
              <div className="space-y-4 font-body text-slate-600 leading-relaxed">
                <p>
                  "Welcome to Little Star Kids Academy. We are dedicated to creating an environment where learning is not just about textbooks, but about discovery and growth. Our team works tirelessly to ensure that each student is equipped with the skills and confidence to excel in a rapidly changing world."
                </p>
                <p>
                  Education here is a partnership between teachers, parents, and students. Together, we build a foundation of lifelong learning and global citizenship.
                </p>
                <div className="pt-4">
                  <p className="font-bold text-slate-900 text-xl">Dr. Sarah Johnson</p>
                  <p className="text-brand-primary font-medium">Ph.D in Educational Leadership</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
