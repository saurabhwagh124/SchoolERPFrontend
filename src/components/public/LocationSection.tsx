import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const LocationSection = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-40 -right-20 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Visit Our Campus</h2>
          <p className="font-body text-slate-600 max-w-2xl mx-auto">
            We are located in a serene environment, providing the perfect atmosphere for learning and growth.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <GlassCard className="bg-white border-none shadow-xl p-8 space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-slate-900 mb-1">Our Address</h4>
                  <p className="text-slate-600">Sankalp nagar near swami samarth mandir, bhaygaon road malegaon camp<br />Malegaon, Nashik, Maharashtra - 423105</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-success/10 flex items-center justify-center text-brand-success shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-slate-900 mb-1">Contact Us</h4>
                  <p className="text-slate-600">+91 9322219327 <br />+91 9021831489</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-slate-900 mb-1">Email Address</h4>
                  <p className="text-slate-600">littlestarkidsacademy01@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-slate-900 mb-1">Visiting Hours</h4>
                  <p className="text-slate-600">Monday - Friday: 8:00 AM - 4:00 PM<br />Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="footer-col space-y-4">
            <h3 className="footer-heading font-heading text-2xl font-bold text-slate-900 lg:hidden">Find Us</h3>
            <div className="footer-map-wrapper h-[500px] rounded-3xl overflow-hidden shadow-2xl relative group bg-slate-200 hover:ring-2 hover:ring-brand-primary/30 hover:shadow-[0_20px_50px_rgba(12,62,38,0.15)] transition-all duration-500">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.4!2d74.5!3d20.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bde972fac567dad%3A0x7ca29445715564a1!2sLondon%20kids%20preschool%20Sankalp%20Nagar%2C%20Camp%2C%20Malegaon!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Footer Google Map"
                className="grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
              ></iframe>

              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <GlassCard className="bg-white/90 backdrop-blur-md border-none p-4 flex items-center justify-between pointer-events-auto shadow-xl">
                  <div>
                    <p className="text-sm font-bold text-slate-900">London Kids Preschool</p>
                    <p className="text-[10px] text-slate-500">Sankalp Nagar, Malegaon</p>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/London+kids+preschool+Sankalp+Nagar,+Camp,+Malegaon,+Maharashtra/@20.5815358,74.5108922,21z/data=!4m6!3m5!1s0x3bde972fac567dad:0x7ca29445715564a1!8m2!3d20.5815777!4d74.5109762!16s%2Fg%2F11vylwz_n2?hl=en&entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-brand-primary/30 hover:scale-105 transition-transform"
                  >
                    View on Google Maps
                  </a>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
