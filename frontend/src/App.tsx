/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DrawerProvider, useDrawer } from './context/DrawerContext';
import { RouteProvider } from './context/RouteContext';
import { ThemeProvider } from './context/ThemeContext';
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
import { SessionExpiredModal } from './components/SessionExpiredModal';
import { useAutoLogout } from './hooks/useAutoLogout';
import { Menu } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const { token } = useAuth();
  const location = useLocation();

  // Hide hamburger on some screens
  const hideHamburger = ['/', '/login', '/onboarding'].includes(location.pathname);

  return (
    <div className="flex-1 flex flex-col relative h-full">
      {token && !hideHamburger && (
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-12 left-6 z-30 p-3 bg-surface-soft backdrop-blur-md rounded-2xl shadow-sm text-body active:scale-95 transition-transform"
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
  const { token, user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) return null;
  if (!token) return <Navigate to="/login" />;

  // If profile is not completed, force onboarding
  if (!user?.hasCompletedProfile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  // If profile IS completed and trying to access onboarding, redirect away
  if (user?.hasCompletedProfile && location.pathname === '/onboarding') {
    const target = user.role === 'driver' ? '/driver' : '/passenger';
    return <Navigate to={target} />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={target} />;
  }
  
  return <Layout>{children}</Layout>;
};

/**
 * Componente que maneja la aplicación
 * Debe estar dentro de AuthProvider y Router
 */
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Control de acceso diario: redirigir a /login solo la primera vez del día
  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem('lastVisitDate');

    // Si la fecha guardada es diferente a hoy, actualizar y redirigir a login (si no estamos ya ahí)
    if (lastVisitDate !== today) {
      localStorage.setItem('lastVisitDate', today);
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
    // Si es el mismo día, no hacer nada (acceso normal)
  }, [navigate, location.pathname]);

  return (
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
  );
};

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <RouteProvider>
            <DrawerProvider>
              <AppContent />
            </DrawerProvider>
          </RouteProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
