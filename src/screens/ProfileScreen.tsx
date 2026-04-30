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
  Users
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

  return (
    <div className="flex-1 flex flex-col bg-slate-100">
      <div className="bg-white px-6 pt-12 pb-10 shadow-soft border-b border-slate-100">
        <div className="flex justify-between items-center mb-8 pl-14">
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mi Perfil</h1>
           <button className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 shadow-sm">
              <Settings className="w-5 h-5" />
           </button>
        </div>

        <div className="flex flex-col items-center">
           <div className="relative mb-4">
              <img src={user?.avatar} className="w-24 h-24 rounded-[32px] border-4 border-white shadow-xl" alt="avatar" />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white">
                 <Shield className="w-4 h-4" />
              </div>
           </div>
           <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 mb-6">
             {user?.role === 'driver' ? 'Conductor Verificado' : 'Pasajero Frecuente'}
           </p>
           
           <div className="flex space-x-3 w-full">
              <Button variant="outline" className="flex-1 border-slate-100 bg-slate-50 rounded-2xl text-xs font-bold uppercase text-slate-600" onClick={() => navigate('/role-selection')}>
                 Cambiar Rol
              </Button>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {user?.role === 'driver' && (
          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] px-2">Mi Vehículo</h2>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/vehicle')}
              className="bg-white rounded-[32px] p-6 shadow-soft border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Car className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-800 leading-none mb-1">Gestionar Vehículo</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Placa, Pico y Placa, Cupos</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-all" />
            </motion.div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] px-2">Configuración</h2>
          <div className="bg-white rounded-[32px] shadow-soft border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <MenuItem icon={<MapPin className="w-5 h-5 text-blue-500" />} label="Dirección habitual" value="Sede Principal" />
            <MenuItem icon={<Bell className="w-5 h-5 text-amber-500" />} label="Notificaciones" />
            <MenuItem icon={<User className="w-5 h-5 text-purple-500" />} label="Editar Información" />
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-soft border border-slate-100 overflow-hidden divide-y divide-slate-50">
           <MenuItem icon={<HelpCircle className="w-5 h-5 text-slate-400" />} label="Soporte SyC" />
           <MenuItem icon={<FileText className="w-5 h-5 text-slate-400" />} label="Términos y Privacidad" />
        </div>

        <button 
           onClick={handleLogout}
           className="w-full py-6 bg-red-50 text-red-600 font-bold rounded-[32px] flex items-center justify-center space-x-3 active:scale-95 transition-transform border border-red-100 shadow-sm"
        >
           <LogOut className="w-5 h-5" />
           <span>Cerrar Sesión Corporativa</span>
        </button>

        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] pb-12">
          Rivo v1.1.0 • Powered by SyC
        </p>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, value }: any) => (
  <button className="w-full px-6 py-5 flex items-center justify-between group active:bg-slate-50 transition-colors">
     <div className="flex items-center space-x-4">
        <div className="bg-slate-50 shadow-sm p-3 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
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
