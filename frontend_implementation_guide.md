# Lead Frontend Architect's Implementation Guide: Star School ERP & Web Portal

This document serves as the master blueprint for the frontend development. It contains the visual DNA, technical architecture, and implementation roadmap required to build a premium, responsive, and star-themed EdTech platform.

---

## 1. Visual Identity & Design System
The UI should feel "EdTech Modern": vibrant, playful, yet professionally robust.

### Core Palette
- **Primary Blue (#00AEEF)**: Used for high-priority actions, headers, and primary buttons.
- **Star Yellow (#FFD700)**: Used for accents, star motifs, and "Pulse" status indicators.
- **Growth Green (#228B22)**: Used for success states, enrollment CTAs, and organic background "blobs".
- **Neutral**: Slate-50 for backgrounds, Slate-900 for primary text.

### Typography
- **Headings**: `Fredoka` or `Quicksand` (Google Fonts). Soft, rounded, and welcoming.
- **Body & Data**: `Inter` or `Poppins`. Clean, high readability for ERP tables and forms.

### Design Elements
- **Radius**: `2xl` (1rem / 16px) for all cards and buttons.
- **Glassmorphism**: `.glass` class (Backdrop-blur-md, White/20 border, subtle inner shadow).
- **Animations**: Page transitions should use "Star-Entry" (scaling and fading in from center).

---

## 2. Technical Stack
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Redux Toolkit for ERP state; Context API for Auth.
- **API Client**: Axios with interceptors for Bearer token handling.

---

## 3. Recommended Directory Structure
```text
frontend/
├── public/              # Static assets (favicon, star graphics)
├── src/
│   ├── assets/          # Images, custom SVG illustrations
│   ├── components/
│   │   ├── ui/          # Atomic components (GlassCard, StarButton, Input)
│   │   ├── public/      # Navigation, Footer, Hero for marketing
│   │   └── erp/         # Sidebar, StatCards, TableView for dashboard
│   ├── context/         # AuthContext.jsx (Bearer token management)
│   ├── hooks/           # useAuth.js, useForm.js
│   ├── layouts/         # PublicLayout.jsx, DashboardLayout.jsx
│   ├── pages/
│   │   ├── public/      # Home, Admissions, About
│   │   └── dashboard/   # Attendance, Fees, Results
│   ├── services/        # api.js, authService.js, admissionService.js
│   └── utils/           # formatters.js, constants.js
├── tailwind.config.js
└── package.json
```

---

## 4. Brand Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwind.config').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#00AEEF",
          yellow: "#FFD700",
          green: "#228B22",
        },
      },
      borderRadius: {
        '2xl': '1rem',
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      }
    },
  },
  plugins: [],
};
```

---

## 5. Core Component Templates

### Landing Page Hero (`Hero.jsx`)
```jsx
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8 flex justify-center"
        >
          <div className="p-4 bg-brand-yellow/20 rounded-full">
            <Star className="w-16 h-16 text-brand-yellow fill-brand-yellow" />
          </div>
        </motion.div>

        <motion.h1 
          className="font-heading text-5xl md:text-7xl font-bold text-slate-900 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Every Child is a <span className="text-brand-blue">Star</span>
        </motion.h1>

        <motion.p 
          className="font-body text-xl text-slate-600 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Empowering the next generation with modern education and a supportive growth environment.
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button className="bg-brand-blue hover:bg-sky-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-blue/30 transition-all transform hover:scale-105">
            Enroll Now
          </button>
          <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            Explore Portal
          </button>
        </motion.div>
      </div>
    </section>
  );
};
```

### Main Navigation (`Navbar.jsx`)
```jsx
import { useState } from 'react';
import { Menu, X, Star } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-8 h-8 text-brand-blue fill-brand-blue" />
          <span className="font-heading text-2xl font-bold text-slate-900">StarSchool</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'About', 'Admissions', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="font-body font-medium text-slate-600 hover:text-brand-blue transition-colors">
              {item}
            </a>
          ))}
          <button className="bg-brand-blue text-white px-6 py-2 rounded-2xl font-bold hover:shadow-lg transition-all">
            Login
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
          {['Home', 'About', 'Admissions', 'Contact', 'Login'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-lg font-medium text-slate-700">
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
```

---

## 6. Implementation Roadmap

### Phase A: Public Portal
1. **Admissions Form (High Priority)**:
   - Implement a multi-step form (Personal, Academic, Documents).
   - **Document Support**: Since the user requires handling "it all", use a `FormData` object to send documents. *Note: Backend may need extension to handle file storage (S3/Multer).*
2. **Mobile-First Validation**: Use Chrome DevTools to ensure no component breaks at 320px. Mobile bottom navigation should be considered for the Dashboard view.

### Phase B: ERP Dashboard
1. **Protected Layout**: A layout that checks for the Bearer token in local storage.
2. **Dynamic Sidebar**: Rollout specific views based on `role_id` (Admin, Teacher, Student).
3. **Data Hydration**: Use the provided Postman collection to map out all `GET` requests for dashboards.

---

## 7. Backend Context for Agent
- **Auth**: `POST /auth/login` returns a Bearer token. This must be stored in `SecureStore` or `LocalStorage`.
- **API Status**: All routes are active and tested. See `SchoolERP_API.postman_collection.json` for headers and body requirements.
- **Port**: Default backend cluster is on port `1881`.
