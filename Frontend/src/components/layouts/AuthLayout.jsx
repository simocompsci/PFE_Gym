import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../lib/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * AuthLayout component serves as a layout wrapper for authenticated routes
 * It includes the sidebar and main content area
 */
const AuthLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="ml-2 text-lg font-medium text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute bg-white" />
        <div className="absolute inset-0" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
