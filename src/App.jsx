import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { AdminLayout } from './layouts/AdminLayout';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Code-split pages on demand using React.lazy for high-performance bundle loading
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const StudentsPage = lazy(() => import('./pages/StudentsPage').then(m => ({ default: m.StudentsPage })));
const SeatsPage = lazy(() => import('./pages/SeatsPage').then(m => ({ default: m.SeatsPage })));
const FeesPage = lazy(() => import('./pages/FeesPage').then(m => ({ default: m.FeesPage })));
const ReceiptsPage = lazy(() => import('./pages/ReceiptsPage').then(m => ({ default: m.ReceiptsPage })));
const AttendancePage = lazy(() => import('./pages/AttendancePage').then(m => ({ default: m.AttendancePage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const StudentDashboardPage = lazy(() => import('./pages/StudentDashboardPage').then(m => ({ default: m.StudentDashboardPage })));
const StudentAttendancePage = lazy(() => import('./pages/StudentAttendancePage').then(m => ({ default: m.StudentAttendancePage })));

// Sleek lightweight spinner for route transitions
const PageLoader = () => (
  <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center gap-2.5">
    <div className="w-8 h-8 border-3 border-[#00A97A]/20 border-t-[#00A97A] rounded-full animate-spin" />
    <span className="text-[11px] font-bold text-slate-400">Loading Vidya Library...</span>
  </div>
);

// Protected Route for Admin Dashboard Layout
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // If logged in as student, redirect to student dashboard
  if (user?.role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }
  return children;
};

// Protected Route for Student Portal
const ProtectedStudentRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login?role=student" replace />;
  }
  return children;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LibraryProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Landing Homepage */}
              <Route path="/" element={<HomePage />} />

              {/* Authentication Login Page */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/student/login" element={<LoginPage />} />

              {/* Student Portal Routes */}
              <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedStudentRoute>
                    <StudentDashboardPage />
                  </ProtectedStudentRoute>
                }
              />
              <Route
                path="/student/attendance"
                element={
                  <ProtectedStudentRoute>
                    <StudentAttendancePage />
                  </ProtectedStudentRoute>
                }
              />

              {/* Direct top-level route redirects */}
              <Route path="/students" element={<Navigate to="/admin/students" replace />} />
              <Route path="/seats" element={<Navigate to="/admin/seats" replace />} />
              <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
              <Route path="/fees" element={<Navigate to="/admin/fees" replace />} />
              <Route path="/attendance" element={<Navigate to="/admin/attendance" replace />} />
              <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
              <Route path="/receipts" element={<Navigate to="/admin/receipts" replace />} />

              {/* Admin Dashboard using Layout & React Router <Outlet /> */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                {/* Index Route renders main Dashboard Overview */}
                <Route index element={<DashboardPage />} />

                {/* Nested Sub-routes rendered via <Outlet /> */}
                <Route path="students" element={<StudentsPage />} />
                <Route path="seats" element={<SeatsPage />} />
                <Route path="fees" element={<FeesPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route
                  path="books"
                  element={
                    <ModulePlaceholderPage
                      title="Books & Catalog"
                      description="Physical reference catalog and study material issue tracking."
                      icon={BookOpen}
                    />
                  }
                />
                <Route path="receipts" element={<ReceiptsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </LibraryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
