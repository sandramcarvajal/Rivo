import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  MapPin, 
  Bell, 
  ChevronRight, 
  HelpCircle, 
  FileText,
  Car,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Users,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Normalizar nombre a Title Case
  const toTitleCase = (str: string = "") => {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  const displayName = toTitleCase(user?.name || "");

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="bg-white px-6 pt-12 pb-10 shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center mb-10 pl-14">
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mi Perfil</h1>
           <button className="p-3 bg-slate-50 border border-slate-100 rounded-md text-slate-400 shadow-sm active:scale-95 transition-transform">
              <Settings className="w-5 h-5" />
           </button>
        </div>

        <div className="flex flex-col items-center">
           <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-slate-300 relative overflow-visible">
                <User className="w-12 h-12" />
              </div>
              <button 
                onClick={() => console.log("Cambiar foto")}
                className="absolute -top-1 -right-1 bg-white w-9 h-9 rounded-full shadow-md border border-slate-100 flex items-center justify-center text-primary active:scale-90 transition-transform z-20"
              >
                <Camera className="w-4 h-4" />
              </button>
           </div>
           
           <h3 className="text-xl font-black text-slate-900 tracking-tight">{displayName}</h3>
           <p className="inline-flex px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mt-2 mb-8">
             {user?.role === 'driver' ? 'Conductor' : 'Pasajero'}
           </p>
           
           <div className="flex space-x-3 w-full max-w-xs">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-200 bg-white rounded-md text-[10px] font-black uppercase tracking-widest text-slate-500 h-12 shadow-sm hover:bg-slate-50 group transition-all" 
                onClick={() => navigate('/onboarding')}
              >
                 <div className="flex items-center justify-center gap-2">
                   <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                   <span>Cambiar Rol</span>
                 </div>
              </Button>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {user?.role === 'driver' && (
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Gestión Operativa</h2>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/vehicle')}
              className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                  <Car className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                   <p className="text-sm font-black text-slate-800 leading-none mb-1.5">Mi Vehículo</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Información y Restricciones</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-all" />
            </motion.div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Preferencias</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <MenuItem icon={<MapPin className="w-5 h-5 text-slate-400" />} label="Rutas frecuentes" value="Sede Principal" />
            <MenuItem icon={<Bell className="w-5 h-5 text-slate-400" />} label="Notificaciones" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Soporte</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
             <MenuItem icon={<HelpCircle className="w-5 h-5 text-slate-400" />} label="Ayuda y Soporte" />
             <MenuItem icon={<FileText className="w-5 h-5 text-slate-400" />} label="Políticas de SyC" />
          </div>
        </div>

        <div className="pt-4">
          <button 
             onClick={handleLogout}
             className="w-full py-6 bg-white text-red-500 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center space-x-3 active:scale-95 transition-transform border border-red-50 shadow-sm"
          >
             <LogOut className="w-4 h-4" />
             <span>Cerrar Sesión</span>
          </button>
        </div>

        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] pb-12">
          Rivo v1.2.0 • SYC MOBILE
        </p>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, value }: any) => (
  <button className="w-full px-6 py-5 flex items-center justify-between group active:bg-slate-50 transition-colors">
     <div className="flex items-center space-x-4">
        <div className="bg-slate-50 shadow-sm p-3 rounded-md border border-slate-100 group-hover:bg-white transition-colors">
           {icon}
        </div>
        <div className="text-left">
           <p className="text-sm font-bold text-slate-800 leading-none mb-1">{label}</p>
           {value && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{value}</p>}
        </div>
     </div>
     <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-colors" />
  </button>
);
