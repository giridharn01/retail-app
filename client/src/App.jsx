import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Navbar from './components/Navbar';

// Common Pages
import HomePage from './pages/common/HomePage';
import LoginPage from './pages/common/LoginPage';
import RegisterPage from './pages/common/RegisterPage';
import ProductListPage from './pages/common/ProductListPage';
import ProductDetailPage from './pages/common/ProductDetailPage';

// User Pages
import ServiceRequestPage from './pages/user/ServiceRequestPage';
import UserProfilePage from './pages/user/UserProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductManagementPage from './pages/admin/AdminProductManagementPage';
import AdminServiceRequestManagementPage from './pages/admin/AdminServiceRequestManagementPage';
import AdminServiceTypesPage from './pages/admin/AdminServiceTypesPage';

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
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
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
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 