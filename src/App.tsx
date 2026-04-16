import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { AdmissionsPage } from './pages/public/AdmissionsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/about" element={<div className="pt-32 text-center h-screen">About Us Page (Coming Soon)</div>} />
          <Route path="/contact" element={<div className="pt-32 text-center h-screen">Contact Page (Coming Soon)</div>} />
        </Route>

        {/* Dashboard Routes (To be implemented in Phase B) */}
        <Route path="/dashboard" element={<div>Dashboard Layout (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
