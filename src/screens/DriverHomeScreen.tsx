import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bell, MapPin, ListChecks, History, LayoutDashboard, ChevronRight, User, Shield, Car, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ROUTES, MOCK_REQUESTS, Route } from '../mock/data';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

import { checkPicoYPlaca } from '../lib/pico-y-placa';

export const DriverHomeScreen: React.FC = () => {
  const { user, vehicle } = useAuth();
  const navigate = useNavigate();
  const [activeRoutes] = useState<Route[]>(MOCK_ROUTES.filter(r => r.driverId === 'u1'));
  const pendingRequestsCount = MOCK_REQUESTS.filter(r => r.status === 'pending').length;

  // Logic based on the new utility
  const isRestrictedToday = checkPicoYPlaca(vehicle.placa);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-6 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-center mb-8 relative pl-14">
          <div className="flex items-center space-x-3">
             <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                <img src={user?.avatar} className="w-12 h-12 rounded-2xl border-2 border-white/20 group-hover:border-white transition-all" alt="avatar" />
             </div>
             <div>
                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">SyC Conductor</span>
                <h1 className="text-xl font-black text-white leading-tight tracking-tight">Hola, {user?.name?.split(' ')[0] || 'Usuario'}</h1>
             </div>
          </div>
          <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10 active:scale-95 transition-transform">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-strong relative z-10 flex justify-between items-center translate-y-8 h-28 border border-white">
           <div className="text-center border-r border-slate-100 flex-1 cursor-pointer hover:bg-slate-50 transition-colors rounded-l-[32px] h-full flex flex-col justify-center" onClick={() => navigate('/history')}>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Viajes</p>
              <p className="text-2xl font-black text-primary">12</p>
           </div>
           <div className="text-center flex-1 cursor-pointer hover:bg-slate-50 transition-colors rounded-r-[32px] h-full flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Score</p>
              <p className="text-2xl font-black text-primary">4.9</p>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-16 pb-32 space-y-6">
        {/* Pico y Placa Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-5 rounded-[28px] border flex items-center justify-between transition-all shadow-sm",
            isRestrictedToday 
              ? "bg-red-50 border-red-100" 
              : "bg-green-50 border-green-100"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-[18px] flex items-center justify-center shadow-sm",
              isRestrictedToday ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            )}>
              {isRestrictedToday ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest leading-none mb-1 shadow-sm",
                isRestrictedToday ? "text-red-500/70" : "text-green-500/70"
              )}>Pico y Placa hoy</p>
              <p className={cn(
                "text-sm font-black tracking-tight",
                isRestrictedToday ? "text-red-700" : "text-green-700"
              )}>
                {isRestrictedToday ? 'Restricción Activa' : 'Sin Restricción'}
              </p>
              <p className={cn(
                "text-[11px] font-medium opacity-80",
                isRestrictedToday ? "text-red-600" : "text-green-600"
              )}>
                {isRestrictedToday ? "No disponible por restricción" : "Disponible para conducir hoy"}
              </p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Placa</p>
             <p className="text-xs font-black text-slate-500 tracking-widest">{vehicle.placa}</p>
          </div>
        </motion.div>

        {isRestrictedToday ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[32px] p-8 border border-red-100 text-center space-y-4 shadow-soft"
          >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
               <Car className="w-10 h-10 text-red-400 opacity-50" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-slate-900 text-lg leading-tight uppercase tracking-widest">Atención</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
                Hoy tienes pico y placa. <span className="text-red-600 font-bold">No puedes crear ni gestionar rutas</span> por restricción vehicular.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-between items-end px-1">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Rutas Activas</h2>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/manage-requests')}
                  className="text-xs font-bold text-blue-600 flex items-center bg-blue-50 px-4 py-2 rounded-2xl hover:bg-blue-100 transition-colors shadow-sm"
                >
                  {pendingRequestsCount > 0 ? (
                    <>Pendientes <span className="ml-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[9px] font-black">{pendingRequestsCount}</span></>
                  ) : (
                    "Sin solicitudes"
                  )}
                </motion.button>
            </div>

            {activeRoutes.length > 0 ? (
              <div className="space-y-4">
                  {activeRoutes.map(route => (
                    <motion.div 
                      key={route.id} 
                      whileHover={{ y: -4, border: '1px solid rgba(37, 99, 235, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/route/${route.id}`)}
                      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-soft flex items-center justify-between group cursor-pointer transition-all"
                    >
                        <div className="flex items-center space-x-5">
                          {/* Visual Path UI */}
                          <div className="flex flex-col items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full border-2 border-slate-200 bg-white" />
                              <div className="w-[2px] h-6 bg-slate-100 rounded-full" />
                              <div className="w-3 h-3 rounded-full bg-primary" />
                          </div>

                          <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tu Ruta</p>
                              <h3 className="font-black text-slate-800 text-lg leading-tight tracking-tight mb-2">
                                SYC <span className="text-slate-300 font-medium">→</span> Delacuesta CC
                              </h3>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                                    <ListChecks className="w-3 h-3 text-slate-400" />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{route.time}</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{route.availableSeats} Cupos</p>
                                </div>
                              </div>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] p-10 border border-dashed border-slate-200 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-slate-200" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Sin rutas para hoy</h3>
                  <p className="text-sm text-slate-400 max-w-[200px] mx-auto mb-6">Comienza a ahorrar compartiendo tu ruta al trabajo.</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/create-route')}>
                    Crear Mi Primera Ruta
                  </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Button */}
      <div className="absolute bottom-10 left-6 right-6 z-30">
        <Button 
          onClick={() => !isRestrictedToday && navigate('/create-route')}
          disabled={isRestrictedToday}
          className={cn(
            "w-full h-18 shadow-strong rounded-[28px] flex items-center justify-center space-x-4 text-xl group active:scale-95 transition-all text-white",
            isRestrictedToday 
              ? "bg-slate-300 shadow-none border-none grayscale cursor-not-allowed opacity-50" 
              : "bg-primary shadow-primary/40"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform",
            isRestrictedToday ? "bg-slate-400/50" : "bg-white/20 group-hover:rotate-12"
          )}>
            {isRestrictedToday ? <AlertCircle className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
          </div>
          <span className="tracking-tight">
            {isRestrictedToday ? 'Restricción Hoy' : 'Crear Nueva Ruta'}
          </span>
        </Button>
      </div>
    </div>
  );
};
