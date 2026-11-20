
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Navbar from './components/Navbar';

import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import CakeMenuPage from './pages/CakeMenuPage';
import CakeCustomizerPage from './pages/CakeCustomizerPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SessionComparisonPage from './pages/SessionComparisonPage';

function UnauthorizedPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>403 - Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Navbar cartCount={0} />

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<CakeMenuPage />} />
          <Route path="/cakes/:id" element={<CakeCustomizerPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* CUSTOMER */}
          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          {/* BAKER */}
          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* SESSION EXPERIMENT */}
          <Route
            path="/session-comparison"
            element={
              <ProtectedRoute
                allowedRoles={['customer', 'vendor', 'admin']}
              >
                <SessionComparisonPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/unauthorized"
            element={<UnauthorizedPage />}
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}
