import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  PlusCircle, 
  ClipboardList, 
  User, 
  LogOut, 
  X,
  FileText,
  Shield,
  HelpCircle,
  History,
  Car
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const menuItems = user?.role === 'driver' ? [
    { label: 'Inicio', icon: Home, path: '/driver' },
    { label: 'Crear Ruta', icon: PlusCircle, path: '/create-route' },
    { label: 'Solicitudes', icon: ClipboardList, path: '/manage-requests' },
    { label: 'Historial', icon: History, path: '/history' },
    { label: 'Mi Vehículo', icon: Car, path: '/vehicle' },
    { label: 'Perfil', icon: User, path: '/profile' },
  ] : [
    { label: 'Home', icon: Home, path: '/passenger' },
    { label: 'Mis Solicitudes', icon: ClipboardList, path: '/my-requests' },
    { label: 'Perfil', icon: User, path: '/profile' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-[280px] bg-surface-strong text-text-primary z-50 flex flex-col drawer-shadow"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-border-primary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xl italic">
                  R
                </div>
                <h2 className="text-xl font-bold tracking-tight text-body">Rivo</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-soft rounded-lg transition-colors text-text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-6 py-8 border-b border-border-primary">
              <div className="flex items-center gap-4">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1a365d&color=fff`} 
                  className="w-12 h-12 rounded-2xl border-2 border-border-primary shadow-lg" 
                  alt="Avatar" 
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-body">{user?.name}</p>
                  <p className="text-[10px] text-muted truncate tracking-tight">{user?.email}</p>
                  <div className="mt-1 inline-block px-2 py-0.5 bg-info-soft text-info text-[9px] font-bold rounded uppercase">
                    {user?.role === 'driver' ? 'Conductor' : 'Pasajero'}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <p className="text-[10px] uppercase font-bold text-muted tracking-[0.2em] px-4 mb-4">Menú Principal</p>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-primary text-white font-semibold shadow-lg shadow-primary/20' 
                        : 'text-muted hover:text-body hover:bg-surface-soft'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted'}`} />
                    <span className="text-sm">{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                  </button>
                );
              })}

              <div className="pt-8">
                 <p className="text-[10px] uppercase font-bold text-muted tracking-[0.2em] px-4 mb-4">Ayuda</p>
                 <button className="w-full flex items-center gap-4 px-4 py-3 text-muted hover:text-body transition-colors">
                    <HelpCircle className="w-5 h-5 text-muted" />
                    <span className="text-sm">Soporte técnico</span>
                 </button>
                 <button className="w-full flex items-center gap-4 px-4 py-3 text-muted hover:text-body transition-colors">
                    <Shield className="w-5 h-5 text-muted" />
                    <span className="text-sm">Privacidad</span>
                 </button>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-border-primary">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 bg-surface-soft hover:bg-danger-soft hover:text-danger text-text-secondary rounded-2xl text-sm font-bold transition-all group"
              >
                <LogOut className="w-4 h-4 text-muted group-hover:text-danger" />
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
