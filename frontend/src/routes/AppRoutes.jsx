import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FacilityDetails from '../pages/public/FacilityDetails';
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Landing from '../pages/public/Landing';
import Facilities from '../pages/public/Facilities';
import BloodSearch from '../pages/public/BloodSearch';
import BedsSearch from '../pages/public/BedsSearch';
import OxygenSearch from '../pages/public/OxygenSearch';
import EmergencyRequestPage from '../pages/public/EmergencyRequestPage';
import TrackRequestPage from '../pages/public/TrackRequestPage';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import PatientDashboard from '../pages/patient/Dashboard';
import PatientRequests from '../pages/patient/MyRequests';
import Profile from '../pages/patient/Profile';

import DonorDashboard from '../pages/donor/Dashboard';
import DonateBlood from '../pages/donor/DonateBlood';
import DonorBloodRequests from '../pages/donor/BloodRequests';
import MyDonations from '../pages/donor/MyDonations';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminFacilities from '../pages/admin/AdminFacilities';
import AdminBlood from '../pages/admin/AdminBlood';
import AdminBeds from '../pages/admin/AdminBeds';
import AdminOxygen from '../pages/admin/AdminOxygen';
import AdminRequests from '../pages/admin/AdminRequests';
import AdminDeliveries from '../pages/admin/AdminDeliveries';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminSettings from '../pages/admin/AdminSettings';

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-ink/60">The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<Landing />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/hospital/:id" element={<FacilityDetails />} />
        <Route path="/blood" element={<BloodSearch />} />
        <Route path="/beds" element={<BedsSearch />} />
        <Route path="/oxygen" element={<OxygenSearch />} />
        <Route path="/request/:resourceType" element={<EmergencyRequestPage />} />
        <Route path="/track/:requestId" element={<TrackRequestPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient / Donor (shared UserLayout, mode determined by activeMode) */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/requests" element={<PatientRequests />} />
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/donate" element={<DonateBlood />} />
        <Route path="/donor/requests" element={<DonorBloodRequests />} />
        <Route path="/donor/donations" element={<MyDonations />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/delivery" element={<AdminDeliveries />} />
      </Route>

      {/* Admin - gated on DB-verified role, never on frontend state */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/facilities" element={<AdminFacilities />} />
        <Route path="/admin/blood" element={<AdminBlood />} />
        <Route path="/admin/beds" element={<AdminBeds />} />
        <Route path="/admin/oxygen" element={<AdminOxygen />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/deliveries" element={<AdminDeliveries />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
