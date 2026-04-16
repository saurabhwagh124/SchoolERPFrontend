import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star } from 'lucide-react';
import { StarButton } from '../ui/StarButton';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Star className="w-8 h-8 text-brand-blue fill-brand-blue group-hover:rotate-12 transition-transform" />
          <span className="font-heading text-2xl font-bold text-slate-900">StarSchool</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`font-body font-medium transition-colors ${
                location.pathname === link.path ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <StarButton variant="primary" className="px-6 py-2">
            Login
          </StarButton>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium ${
                location.pathname === link.path ? 'text-brand-blue' : 'text-slate-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <StarButton variant="primary" className="w-full">
            Login
          </StarButton>
        </div>
      )}
    </nav>
  );
};
