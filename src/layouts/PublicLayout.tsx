import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/public/Navbar';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-100 py-12 mt-20">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>&copy; 2026 Star School ERP. Every child is a star.</p>
        </div>
      </footer>
    </div>
  );
};
