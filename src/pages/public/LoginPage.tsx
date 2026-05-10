import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StarButton } from '../../components/ui/StarButton';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import logo from '../../assets/image.png';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data?.token) {
        console.log('Login successful, saving session...');
        // Correctly mapping from response.data based on the actual API structure
        login(response.data.token, response.data.user);
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        console.error('Login failed: token missing in response', response);
        setError('Login failed. Authentication token not received.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-6">
      {/* Background Blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-brand-success/10 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl mb-4">
            <img src={logo} alt="Little Star Logo" className="w-48 h-48 object-contain" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="font-body text-slate-600">Access your Little Star Kids Academy Portal</p>
        </div>

        <GlassCard className="bg-white/80 border-none shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                  placeholder="name@school.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <StarButton
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Login to Portal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </StarButton>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-500">
              Forgot your password? <button className="text-brand-primary font-bold hover:underline">Reset it here</button>
            </p>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Principal Login: principal@stxavierscbse.in / Admin@1234!
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
