import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { Phone, Mail, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';
import { erpService } from '../../services/erpService';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-brand-primary" />,
      title: "Phone",
      detail: "+1 (555) 123-4567",
      subDetail: "Mon-Fri, 8am-4pm"
    },
    {
      icon: <Mail className="w-6 h-6 text-brand-success" />,
      title: "Email",
      detail: "admissions@starschool.edu",
      subDetail: "Response within 24hrs"
    },
    {
      icon: <MapPin className="w-6 h-6 text-brand-secondary" />,
      title: "Address",
      detail: "123 Education Lane",
      subDetail: "Star City, ST 54321"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await erpService.fileComplaint({
        title: formData.subject,
        description: `From: ${formData.name} (${formData.email})\n\n${formData.message}`,
        category: formData.subject.toLowerCase().includes('admission') ? 'admission' : 'general'
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <section className="bg-slate-50 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl font-bold text-slate-900 mb-6"
          >
            Get in <span className="text-brand-primary">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Have questions about admissions or our programs? We're here to help you every step of the way.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="flex items-start gap-4 bg-white border-none shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-slate-900">{info.title}</h3>
                      <p className="font-body text-brand-primary font-medium">{info.detail}</p>
                      <p className="text-sm text-slate-500">{info.subDetail}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-8 bg-brand-primary rounded-[2rem] text-white overflow-hidden relative group hover:ring-4 hover:ring-brand-primary/30 hover:shadow-[0_20px_50px_rgba(12,62,38,0.3)] transition-all duration-500"
              >
                <MessageSquare className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold font-heading mb-2">Live Chat</h3>
                <p className="mb-6 text-white/80">Need instant help? Our support team is online during school hours.</p>
                <button className="bg-white text-brand-primary px-6 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  Start Chat
                </button>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <GlassCard className="bg-white border-none shadow-2xl p-10">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send size={40} />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Message Sent!</h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.
                    </p>
                    <StarButton variant="outline" onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </StarButton>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                          placeholder="Your name"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" 
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700">Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      >
                        <option>General Inquiry</option>
                        <option>Admissions Question</option>
                        <option>Fee Structure</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700">Message</label>
                      <textarea 
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none" 
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    <StarButton 
                      type="submit" 
                      variant="primary" 
                      disabled={loading}
                      className="w-full md:w-auto flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {loading ? 'Sending...' : 'Send Message'}
                    </StarButton>
                  </form>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-96 w-full rounded-[2.5rem] bg-slate-200 overflow-hidden relative"
          >
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[#E5E7EB] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <p className="font-heading font-bold text-slate-500">Interactive Map Integration Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
