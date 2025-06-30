import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Navbar from './components/Navbar';

// Lazy load major pages
const HomePage = lazy(() => import('./pages/common/HomePage'));
const LoginPage = lazy(() => import('./pages/common/LoginPage'));
const RegisterPage = lazy(() => import('./pages/common/RegisterPage'));
const ProductListPage = lazy(() => import('./pages/common/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/common/ProductDetailPage'));
const ServiceRequestPage = lazy(() => import('./pages/user/ServiceRequestPage'));
const UserProfilePage = lazy(() => import('./pages/user/UserProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProductManagementPage = lazy(() => import('./pages/admin/AdminProductManagementPage'));
const AdminServiceRequestManagementPage = lazy(() => import('./pages/admin/AdminServiceRequestManagementPage'));
const AdminServiceTypesPage = lazy(() => import('./pages/admin/AdminServiceTypesPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

// Protected Route component
const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 relative">
          <Navbar />
          <main className="container mx-auto px-4 py-8 relative z-10">
            <Suspense fallback={<div className="flex justify-center items-center min-h-[40vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>}>
              <Routes>
                {/* Common Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* User Routes */}
                <Route path="/service-request" element={<PrivateRoute><ServiceRequestPage /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<PrivateRoute requireAdmin><AdminDashboardPage /></PrivateRoute>} />
                <Route path="/admin/products" element={<PrivateRoute requireAdmin><AdminProductManagementPage /></PrivateRoute>} />
                <Route path="/admin/service-requests" element={<PrivateRoute requireAdmin><AdminServiceRequestManagementPage /></PrivateRoute>} />
                <Route path="/admin/service-types" element={<PrivateRoute requireAdmin><AdminServiceTypesPage /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute requireAdmin><AdminUsersPage /></PrivateRoute>} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 