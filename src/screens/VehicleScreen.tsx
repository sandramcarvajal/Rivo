import React from 'react';
import { motion } from 'motion/react';
import { Car, CreditCard, Users, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

import { checkPicoYPlaca } from '../lib/pico-y-placa';

export const VehicleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { vehicle, user } = useAuth();

  // If not a driver, redirect (extra safety)
  if (user?.role !== 'driver') {
    return <Navigate to="/onboarding" />;
  }

  const isRestrictedToday = checkPicoYPlaca(vehicle.placa);

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 flex items-center gap-4 pl-14">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Mi Vehículo</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        {/* State Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-2xl p-6 border-2 transition-all shadow-sm",
            isRestrictedToday 
              ? "bg-red-50 border-red-100/50" 
              : "bg-green-50 border-green-100/50"
          )}
        >
           <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-md",
                isRestrictedToday ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              )}>
                 {isRestrictedToday ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                isRestrictedToday ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"
              )}>
                 {isRestrictedToday ? 'Restricción Activa' : 'Disponible Hoy'}
              </div>
           </div>
           
           <h3 className={cn(
             "text-lg font-black tracking-tight mb-1",
             isRestrictedToday ? "text-red-900" : "text-green-900"
           )}>
             {isRestrictedToday ? 'Pico y Placa hoy' : 'Circulación Libre'}
           </h3>
           <p className={cn(
             "text-xs font-medium opacity-80",
             isRestrictedToday ? "text-red-700" : "text-green-700"
           )}>
             {isRestrictedToday 
               ? "Tu vehículo tiene restricción de movilidad hoy." 
               : "Puedes crear rutas y viajar sin restricciones el día de hoy."}
           </p>
        </motion.div>

        {/* Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-soft border border-slate-100 space-y-8"
        >
           <div className="flex items-center gap-4 border-b border-slate-50 pb-6 mb-6">
              <div className="w-14 h-14 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                 <Car className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehículo Registrado</p>
                 <h2 className="text-xl font-black text-slate-900">{vehicle.make} {vehicle.model}</h2>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                      <Car className="w-4 h-4" />
                   </div>
                   <p className="text-xs font-bold text-slate-500">Marca / Modelo</p>
                </div>
                <p className="text-sm font-black text-slate-800">{vehicle.make} {vehicle.model}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                      <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: vehicle.color.toLowerCase() }} />
                   </div>
                   <p className="text-xs font-bold text-slate-500">Color</p>
                </div>
                <p className="text-sm font-black text-slate-800 capitalize">{vehicle.color}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-sm shadow-sm flex items-center justify-center text-slate-400">
                      <CreditCard className="w-4 h-4" />
                   </div>
                   <p className="text-xs font-bold text-slate-500">Placa</p>
                </div>
                <p className="text-sm font-black text-primary tracking-widest">{vehicle.placa}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-sm shadow-sm flex items-center justify-center text-slate-400">
                      <Users className="w-4 h-4" />
                   </div>
                   <p className="text-xs font-bold text-slate-500">Capacidad</p>
                </div>
                <p className="text-sm font-black text-slate-800">{vehicle.capacity} Cupos</p>
              </div>
           </div>

           <div className="pt-4 p-4 bg-blue-50/50 rounded-[24px] border border-blue-50 flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0 mt-1">
                 <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Nota importante</p>
                 <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                   Si necesitas actualizar la información de tu vehículo, por favor contacta al área de soporte de SyC.
                 </p>
              </div>
           </div>
        </motion.div>

        <div className="px-4 py-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
           Vehículo verificado por Rivo SyC
        </div>
      </div>
    </div>
  );
};
