import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import VendorListPage from './pages/VendorListPage';
import PublicVendorProfilePage from './pages/VendorProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages (Customer)
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OtpVerifyPage from './pages/auth/OtpVerifyPage';

// Auth Pages (Vendor)
import VendorLogin from './pages/vendor/VendorLogin';
import VendorRegister from './pages/vendor/VendorRegister';

// Protected User Pages
import BookingPage from './pages/BookingPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import MyBookings from './pages/dashboard/MyBookings';
import ProfilePage from './pages/dashboard/ProfilePage';

// Protected Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorBookings from './pages/vendor/VendorBookings';
import VendorPortalProfilePage from './pages/vendor/VendorProfilePage';

// Protected Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageVendors from './pages/admin/ManageVendors';
import AdminServices from './pages/admin/AdminServices';

// Guard Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
      <Routes>
        {/* ── Public Routes ── */}
        <Route element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:categorySlug" element={<ServicesPage />} />
          <Route path="vendors" element={<VendorListPage />} />
          <Route path="vendors/:vendorId" element={<PublicVendorProfilePage />} />
        </Route>

        {/* ── Auth Routes ── */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<Navigate to="/login" replace />} />
          <Route path="verify-otp" element={<OtpVerifyPage />} />
          <Route path="complete-profile" element={<RegisterPage />} />
        </Route>

        {/* ── Vendor Auth Routes ── */}
        <Route path="vendor/login" element={<VendorLogin />} />
        <Route path="vendor/register" element={<VendorRegister />} />

        {/* ── Protected User Routes ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="book/:serviceId" element={<BookingPage />} />
          </Route>

          {/* User Dashboard */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Vendor Dashboard */}
          <Route
            path="vendor"
            element={
              <RoleGuard allowedRoles={['vendor', 'admin']}>
                <DashboardLayout variant="vendor" />
              </RoleGuard>
            }
          >
            <Route index element={<VendorDashboard />} />
            <Route path="bookings" element={<VendorBookings />} />
            <Route path="profile" element={<VendorPortalProfilePage />} />
          </Route>

          {/* Admin Dashboard */}
          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <DashboardLayout variant="admin" />
              </RoleGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="vendors" element={<ManageVendors />} />
            <Route path="services" element={<AdminServices />} />
          </Route>
        </Route>

        {/* ── Fallback ── */}
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
