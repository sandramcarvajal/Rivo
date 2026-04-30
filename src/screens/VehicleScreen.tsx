import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Car, CreditCard, Users, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';

import { checkPicoYPlaca } from '../lib/pico-y-placa';

export const VehicleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { vehicle: globalVehicle, updateVehicle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState(globalVehicle);

  const isRestrictedToday = checkPicoYPlaca(vehicle.placa);
  const isPlacaValid = vehicle.placa.length === 6 && /^[A-Z]{3}[0-9]{3}$/.test(vehicle.placa);

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setVehicle(prev => ({ ...prev, placa: value }));
  };
  
  const handleSave = async () => {
    if (!isPlacaValid) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    updateVehicle(vehicle);
    setIsLoading(false);
    navigate('/driver');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 flex items-center gap-4 pl-14">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Mi Vehículo</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* State Card */}
        <div className={cn(
          "rounded-[32px] p-6 border-2 transition-all",
          isRestrictedToday 
            ? "bg-red-50 border-red-100/50" 
            : "bg-green-50 border-green-100/50"
        )}>
           <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-2xl",
                isRestrictedToday ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              )}>
                 {isRestrictedToday ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
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
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-soft border border-slate-100 space-y-8">
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Marca" 
                  value={vehicle.make} 
                  onChange={e => setVehicle({...vehicle, make: e.target.value})}
                  className="bg-slate-50 border-none font-bold"
                />
                <Input 
                  label="Modelo" 
                  value={vehicle.model} 
                  onChange={e => setVehicle({...vehicle, model: e.target.value})}
                  className="bg-slate-50 border-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Color" 
                  value={vehicle.color} 
                  onChange={e => setVehicle({...vehicle, color: e.target.value})}
                  className="bg-slate-50 border-none font-bold"
                />
                <Input 
                  label="Cupos" 
                  type="number"
                  value={vehicle.capacity} 
                  onChange={e => setVehicle({...vehicle, capacity: parseInt(e.target.value)})}
                  className="bg-slate-50 border-none font-bold text-center"
                />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Placa del Vehículo</label>
                 <div className="relative">
                    <Input 
                      placeholder="ABC123" 
                      value={vehicle.placa}
                      onChange={handlePlacaChange}
                      error={vehicle.placa && !isPlacaValid ? 'Formato inválido (ej: ABC123)' : ''}
                      className="bg-slate-50 border-none font-black text-center text-2xl uppercase tracking-widest h-20 rounded-[24px] focus:ring-primary/20"
                    />
                 </div>
              </div>
           </div>

           <Button 
            className="w-full h-16 shadow-lg shadow-primary/20" 
            onClick={handleSave}
            isLoading={isLoading}
            disabled={!isPlacaValid}
           >
              Guardar Cambios
           </Button>
        </div>

        <div className="px-4 py-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
           Mantén tu información al día para viajar seguro.
        </div>
      </div>
    </div>
  );
};
