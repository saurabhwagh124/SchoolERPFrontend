import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { AdmissionsPage } from './pages/public/AdmissionsPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { AttendancePage } from './pages/dashboard/AttendancePage';
import { FeesPage } from './pages/dashboard/FeesPage';
import { AdmissionsListPage } from './pages/dashboard/AdmissionsListPage';
import { StudentsPage } from './pages/dashboard/StudentsPage';
import { TimetablePage } from './pages/dashboard/TimetablePage';
import { ResultsPage } from './pages/dashboard/ResultsPage';
import { EventsPage } from './pages/dashboard/EventsPage';
import { ClassesPage } from './pages/dashboard/ClassesPage';
import { SubjectsPage } from './pages/dashboard/SubjectsPage';
import { LeavesPage } from './pages/dashboard/LeavesPage';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { UsersPage } from './pages/dashboard/UsersPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { TeachersPage } from './pages/dashboard/TeachersPage';
import { StudentProfilePage } from './pages/dashboard/StudentProfilePage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  // Fallback to localStorage check to prevent race conditions during state updates
  const hasToken = isAuthenticated || !!localStorage.getItem('token');

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Dashboard Routes (Phase B) */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/dashboard/attendance" element={<AttendancePage />} />
          <Route path="/dashboard/students" element={<StudentsPage />} />
          <Route path="/dashboard/students/:studentId" element={<StudentProfilePage />} />
          <Route path="/dashboard/teachers" element={<TeachersPage />} />
          <Route path="/dashboard/timetable" element={<TimetablePage />} />
          <Route path="/dashboard/fees" element={<FeesPage />} />
          <Route path="/dashboard/admissions" element={<AdmissionsListPage />} />
          <Route path="/dashboard/results" element={<ResultsPage />} />
          <Route path="/dashboard/events" element={<EventsPage />} />
          <Route path="/dashboard/classes" element={<ClassesPage />} />
          <Route path="/dashboard/subjects" element={<SubjectsPage />} />
          <Route path="/dashboard/leaves" element={<LeavesPage />} />
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
