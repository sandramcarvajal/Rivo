/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { DriverHomeScreen } from './screens/DriverHomeScreen';
import { PassengerHomeScreen } from './screens/PassengerHomeScreen';
import { CreateRouteScreen } from './screens/CreateRouteScreen';
import { ManageRequestsScreen } from './screens/ManageRequestsScreen';
import { MyRequestsScreen } from './screens/MyRequestsScreen';
import { RouteDetailScreen } from './screens/RouteDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { VehicleScreen } from './screens/VehicleScreen';
import { Drawer } from './components/Drawer';
import { Menu } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Hide hamburger on some screens
  const hideHamburger = ['/', '/login', '/onboarding'].includes(location.pathname);

  return (
    <div className="flex-1 flex flex-col relative h-full">
      {user && !hideHamburger && (
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-12 left-6 z-30 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm text-slate-800 active:scale-95 transition-transform"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      {children}
    </div>
  );
};

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'driver' | 'passenger' }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;

  // If profile is not completed, force onboarding
  if (!user.hasCompletedProfile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  // If profile IS completed and trying to access onboarding, redirect away
  if (user.hasCompletedProfile && location.pathname === '/onboarding') {
    const target = user.role === 'driver' ? '/driver' : '/passenger';
    return <Navigate to={target} />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    const target = user.role === 'driver' ? '/driver' : '/passenger';
    return <Navigate to={target} />;
  }
  
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="mobile-container overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" />} />
            <Route path="/login" element={<LoginScreen />} />
            
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingScreen />
              </ProtectedRoute>
            } />

            {/* Common Routes for both roles but protected */}
            <Route path="/route/:id" element={
              <ProtectedRoute>
                <RouteDetailScreen />
              </ProtectedRoute>
            } />

            {/* Passenger Routes */}
            <Route path="/passenger" element={
              <ProtectedRoute requiredRole="passenger">
                <PassengerHomeScreen />
              </ProtectedRoute>
            } />
            <Route path="/my-requests" element={
              <ProtectedRoute requiredRole="passenger">
                <MyRequestsScreen />
              </ProtectedRoute>
            } />

            {/* Driver Routes */}
            <Route path="/driver" element={
              <ProtectedRoute requiredRole="driver">
                <DriverHomeScreen />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute requiredRole="driver">
                <HistoryScreen />
              </ProtectedRoute>
            } />
            <Route path="/vehicle" element={
              <ProtectedRoute requiredRole="driver">
                <VehicleScreen />
              </ProtectedRoute>
            } />
            <Route path="/create-route" element={
              <ProtectedRoute requiredRole="driver">
                <CreateRouteScreen />
              </ProtectedRoute>
            } />
            <Route path="/manage-requests" element={
              <ProtectedRoute requiredRole="driver">
                <ManageRequestsScreen />
              </ProtectedRoute>
            } />

            {/* Common */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
