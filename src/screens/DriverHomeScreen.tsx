import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Bell, 
  MapPin, 
  ListChecks, 
  History, 
  LayoutDashboard, 
  ChevronRight, 
  User, 
  Shield, 
  Car, 
  AlertCircle, 
  CheckCircle2,
  Star,
  Map,
  ArrowRight,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDrawer } from '../context/DrawerContext';
import { useRuta } from '../context/RouteContext';
import { MOCK_REQUESTS, Route } from '../mock/data';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { cn, toTitleCase } from '../lib/utils';
import { checkPicoYPlaca } from '../lib/pico-y-placa';

export const DriverHomeScreen: React.FC = () => {
  const { user, vehicle } = useAuth();
  const { rutas } = useRuta();
  const { isDrawerOpen } = useDrawer();
  const navigate = useNavigate();
  const pendingRequestsCount = MOCK_REQUESTS.filter(r => r.status === 'pending' && r.routeId.includes('r')).length;

  const activeRoutes = rutas.filter((route) => route.driverId === user?.id && route.status === 'active');
  const isRestrictedToday = checkPicoYPlaca(vehicle.placa);
  const firstName = user?.name ? toTitleCase(user.name.split(' ')[0]) : 'Usuario';

  return (
    <div className="flex-1 flex flex-col bg-tertiary overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-6 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl" />
        
        <div className="flex justify-between items-center mb-8 relative">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-surface-soft backdrop-blur-md rounded-xl flex items-center justify-center border border-surface">
                <div className="w-6 h-6 bg-surface rounded-lg flex items-center justify-center">
                   <div className="w-3 h-3 bg-primary rounded-sm rotate-45" />
                </div>
             </div>
             <span className="text-xl font-black text-white tracking-tighter uppercase italic">Rivo</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 bg-surface-soft backdrop-blur-md rounded-2xl text-white border border-surface active:scale-95 transition-transform">
              <Bell className="w-5 h-5" />
            </button>
            <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                <div className="w-11 h-11 rounded-2xl border-2 border-surface bg-surface-soft flex items-center justify-center text-white/60 group-hover:border-white transition-all overflow-hidden">
                   <User className="w-5 h-5" />
                </div>
            </div>
          </div>
        </div>

        <div className="relative mb-4">
           <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">Dashboard Conductor</span>
           <h1 className="text-2xl font-black text-white leading-tight tracking-tight">Hola, {firstName}</h1>
        </div>

        {/* Improved Metrics Card */}
        <div className="bg-surface rounded-2xl p-6 shadow-strong relative z-10 flex gap-4 translate-y-10 border border-surface">
           <div 
             onClick={() => navigate('/history')}
             className="flex-1 flex items-center gap-4 p-4 rounded-md bg-surface-soft border border-surface active:scale-95 transition-transform cursor-pointer"
           >
              <div className="w-11 h-11 bg-primary/10 rounded-sm flex items-center justify-center text-primary">
                 <Car className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-none mb-1">Viajes</p>
                 <p className="text-xl font-black text-body">12</p>
              </div>
           </div>
           
           <div className="flex-1 flex items-center gap-4 p-4 rounded-md bg-warning-soft border border-border-primary transition-all">
              <div className="w-11 h-11 bg-warning/10 rounded-sm flex items-center justify-center text-warning">
                 <Star className="w-6 h-6 fill-warning" />
              </div>
              <div>
                 <div className="flex items-center gap-1">
                    <p className="text-xl font-black text-body">4.9</p>
                    <span className="text-[9px] font-black text-warning uppercase bg-warning-soft px-1.5 py-0.5 rounded-md">Top</span>
                 </div>
                 <p className="text-[10px] font-black text-muted uppercase tracking-widest">Excelente</p>
              </div>
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
            "p-5 rounded-xl border flex items-center justify-between transition-all shadow-sm",
            isRestrictedToday 
              ? "bg-danger-soft border-danger" 
              : "bg-success-soft border-success"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center shadow-sm",
              isRestrictedToday ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
            )}>
              {isRestrictedToday ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                isRestrictedToday ? "text-danger" : "text-success"
              )}>Pico y Placa hoy</p>
              <p className={cn(
                "text-sm font-black tracking-tight",
                isRestrictedToday ? "text-danger" : "text-success"
              )}>
                {isRestrictedToday ? 'Restricción Activa' : 'Sin Restricción'}
              </p>
              <p className={cn(
                "text-[11px] font-medium opacity-80",
                isRestrictedToday ? "text-danger" : "text-success"
              )}>
                {isRestrictedToday ? "No disponible hoy" : "Disponible para conducir"}
              </p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Vehículo</p>
             <p className="text-xs font-black text-body tracking-widest">{vehicle.placa}</p>
          </div>
        </motion.div>

        {isRestrictedToday ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface rounded-2xl p-8 border border-danger text-center space-y-4 shadow-soft"
          >
            <div className="w-20 h-20 bg-danger-soft rounded-full flex items-center justify-center mx-auto">
               <Car className="w-10 h-10 text-danger opacity-50" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-body text-lg leading-tight uppercase tracking-widest">Atención</h3>
              <p className="text-sm text-text-secondary font-medium leading-relaxed px-4">
                Hoy tienes pico y placa. <span className="text-danger font-bold">No puedes crear ni gestionar rutas</span> por restricción vehicular.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-between items-end px-1">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-primary rounded-full" />
                   <h2 className="text-lg font-black text-body tracking-tight">Rutas Activas</h2>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/manage-requests')}
                  className="text-xs font-bold text-primary flex items-center bg-info-soft px-4 py-2 rounded-md hover:bg-info-soft transition-colors shadow-sm"
                >
                  {pendingRequestsCount > 0 ? (
                    <>Pendientes <span className="ml-2 bg-primary text-white px-2 py-0.5 rounded-full text-[9px] font-black">{pendingRequestsCount}</span></>
                  ) : (
                    "Solicitudes"
                  )}
                </motion.button>
            </div>

            <AnimatePresence>
            {activeRoutes.length > 0 ? (
              <div className="space-y-4">
                  {activeRoutes.map((route, index) => (
                    <motion.div 
                      key={route.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/route/${route.id}`)}
                      className="bg-surface p-6 rounded-2xl border border-border-primary shadow-soft flex items-center justify-between group cursor-pointer transition-all"
                    >
                        <div className="flex items-center space-x-5">
                          {/* Visual Path UI */}
                          <div className="flex flex-col items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full border-2 border-border-primary bg-surface" />
                              <div className="w-[2px] h-6 bg-border-primary rounded-full" />
                              <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shadow-sm shadow-primary/40">
                                 <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                          </div>

                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[9px] font-black text-primary uppercase bg-info-soft px-2 py-0.5 rounded-md tracking-widest">Activa</span>
                                 <p className="text-[10px] font-bold text-muted">{route.time}</p>
                              </div>
                              <h3 className="font-black text-body text-base leading-tight tracking-tight mb-2 flex items-center gap-2">
                                {toTitleCase(route.origin)}
                                <ArrowRight className="w-3.5 h-3.5 text-muted" />
                                {toTitleCase(route.destination)}
                              </h3>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center gap-1.5 bg-surface-soft px-2.5 py-1 rounded-xl border border-border-primary">
                                    <Users className="w-3 h-3 text-muted" />
                                    <p className="text-[10px] font-black text-body uppercase tracking-widest">{route.availableSeats} Cupos</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-success-soft px-2.5 py-1 rounded-xl border border-success">
                                    <CheckCircle2 className="w-3 h-3 text-success" />
                                    <p className="text-[10px] font-black text-success uppercase tracking-widest">Publicada</p>
                                </div>
                              </div>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-surface-soft flex items-center justify-center text-muted group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface rounded-[32px] p-12 border-2 border-dashed border-border-primary text-center"
              >
                  <div className="w-20 h-20 bg-surface-soft rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 border border-border-primary shadow-sm">
                    <Map className="w-10 h-10 text-muted" />
                  </div>
                  <h3 className="font-black text-body mb-1 text-lg">Sin rutas para hoy</h3>
                  <p className="text-sm text-text-secondary max-w-[220px] mx-auto mb-8 font-medium">Comienza a ahorrar compartiendo tu ruta al trabajo.</p>
                  <Button 
                    className="rounded-md px-8 h-12 shadow-lg shadow-primary/20" 
                    onClick={() => navigate('/create-route')}
                  >
                    Crear Nueva Ruta
                  </Button>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}

        <div className="pb-12 text-center">
           <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">
             Sede Principal • Mobile Team
           </p>
        </div>
      </div>

      {/* Floating Sticky Button */}
      <div className={cn(
        "fixed bottom-8 left-0 right-0 px-6 flex justify-center pointer-events-none",
        isDrawerOpen ? "z-30" : "z-50"
      )}>
        <motion.div
           initial={{ y: 100 }}
           animate={{ y: 0 }}
           transition={{ type: 'spring', damping: 20, stiffness: 100 }}
           className="w-full max-w-xs sm:max-w-sm pointer-events-auto"
        >
          <Button 
            onClick={() => !isRestrictedToday && navigate('/create-route')}
            disabled={isRestrictedToday}
            className={cn(
              "w-full h-16 shadow-2xl rounded-xl flex items-center justify-center space-x-4 text-lg group active:scale-95 transition-all text-white",
              isRestrictedToday 
                ? "bg-slate-300 shadow-none border-none grayscale cursor-not-allowed opacity-50" 
                : "bg-primary shadow-primary/40"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-transform",
              isRestrictedToday ? "bg-slate-400/50" : "bg-white/20 group-hover:rotate-90 group-hover:scale-110"
            )}>
              {isRestrictedToday ? <AlertCircle className="w-5 h-5 text-white" /> : <Plus className="w-6 h-6 text-white" />}
            </div>
            <div className="text-left">
               <p className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-none mb-0.5">
                 {isRestrictedToday ? 'No disponible' : 'Acción rápida'}
               </p>
               <span className="font-black tracking-tight block text-base">
                 {isRestrictedToday ? 'Restricción Hoy' : 'Publicar Ruta'}
               </span>
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
