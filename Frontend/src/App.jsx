// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthLayout from './components/layouts/AuthLayout';
import LoginPage from './Pages/LoginPage';
import OverviewPage from './Pages/OverviewPage';
import StaffPage from './Pages/StaffPage';
import ClientsPage from './Pages/ClientsPage';
import ProductsPage from './Pages/ProductsPage';
import ClassesPage from './Pages/ClassesPage';
import AnalyticsPage from './Pages/AnalyticsPage';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <Toaster position="top-right" /> */}
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with AuthLayout (includes sidebar) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'coach', 'secretary']} />}>
            <Route element={<AuthLayout />}>
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route index element={<OverviewPage />} />
                </Route>

                {/* Coach routes */}
                <Route path="/coach/dashboard" element={<ProtectedRoute allowedRoles={['coach']} />}>
                  <Route index element={<OverviewPage />} />
                </Route>

                {/* Secretary routes */}
                <Route path="/secretary/dashboard" element={<ProtectedRoute allowedRoles={['secretary']} />}>
                  <Route index element={<OverviewPage />} />
                </Route>

                {/* Shared routes with role-based access */}
                <Route path="/staff" element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route index element={<StaffPage />} />
                </Route>

                <Route path="/clients" element={<ProtectedRoute allowedRoles={['admin', 'secretary']} />}>
                  <Route index element={<ClientsPage />} />
                </Route>

                <Route path="/products" element={<ProtectedRoute allowedRoles={['admin', 'secretary']} />}>
                  <Route index element={<ProductsPage />} />
                </Route>

                <Route path="/classes" element={<ProtectedRoute allowedRoles={['admin', 'coach']} />}>
                  <Route index element={<ClassesPage />} />
                </Route>

                <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route index element={<AnalyticsPage />} />
                </Route>
            </Route>
          </Route>

          {/* Redirect root to login or appropriate dashboard */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all - 404 */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;