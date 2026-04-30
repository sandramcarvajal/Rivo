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

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-[280px] bg-slate-800 text-white z-50 flex flex-col drawer-shadow"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-black text-white text-xl italic">
                  R
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Rivo</h2>
                  <span className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">SyC Corporativo</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-6 py-8 border-b border-slate-700">
              <div className="flex items-center gap-4">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3B82F6&color=fff`} 
                  className="w-12 h-12 rounded-2xl border-2 border-white/10 shadow-lg" 
                  alt="Avatar" 
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate tracking-tight">{user?.email}</p>
                  <div className="mt-1 inline-block px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] font-bold rounded uppercase">
                    {user?.role === 'driver' ? 'Conductor' : 'Pasajero'}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-4 mb-4">Menú Principal</p>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-900/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-sm">{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                  </button>
                );
              })}

              <div className="pt-8">
                 <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-4 mb-4">Ayuda</p>
                 <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5 text-slate-500" />
                    <span className="text-sm">Soporte técnico</span>
                 </button>
                 <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white transition-colors">
                    <Shield className="w-5 h-5 text-slate-500" />
                    <span className="text-sm">Privacidad</span>
                 </button>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-700/50 hover:bg-red-500/10 hover:text-red-400 text-slate-300 rounded-2xl text-sm font-bold transition-all group"
              >
                <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
