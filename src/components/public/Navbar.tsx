import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star, LayoutDashboard } from 'lucide-react';
import { StarButton } from '../ui/StarButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/image.png';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Contact', path: '/contact' },
  ];
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="container mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <img src={logo} alt="Little Star Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="font-heading text-base md:text-xl font-bold text-slate-900 leading-tight">
            Little Star<br /><span className="text-[10px] md:text-xs text-brand-primary tracking-[0.2em] uppercase">Kids Academy</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 font-body font-bold transition-all duration-300 rounded-xl group ${
                  isActive ? 'text-brand-primary' : 'text-slate-600 hover:text-brand-primary hover:bg-brand-primary/5'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-1 bg-brand-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-brand-primary/30 rounded-full transition-all group-hover:w-4" />
                )}
              </Link>
            );
          })}
          <div className="ml-4">
            <StarButton
              variant="primary"
              className="px-6 py-2 flex items-center gap-2"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            >
              {isAuthenticated ? <><LayoutDashboard size={18} /> Portal</> : 'Login'}
            </StarButton>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium ${location.pathname === link.path ? 'text-brand-primary' : 'text-slate-700'
                }`}
            >
              {link.name}
            </Link>
          ))}
          <StarButton
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              setIsOpen(false);
              navigate(isAuthenticated ? '/dashboard' : '/login');
            }}
          >
            {isAuthenticated ? <><LayoutDashboard size={18} /> Portal</> : 'Login'}
          </StarButton>
        </div>
      )}
    </nav>
  );
};
