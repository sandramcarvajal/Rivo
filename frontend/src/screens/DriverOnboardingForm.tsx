import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Car, ChevronLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface DriverFormData {
  name: string;
  cedula: string;
  celula: string;
  brand: string;
  model: string;
  color: string;
  plate: string;
}

interface DriverOnboardingFormProps {
  onBack: () => void;
  onSubmit: (data: DriverFormData) => void;
}

export const DriverOnboardingForm: React.FC<DriverOnboardingFormProps> = ({ onBack, onSubmit }) => {
  const [driverData, setDriverData] = useState<DriverFormData>({
    name: '',
    cedula: '',
    celula: '',
    brand: '',
    model: '',
    color: '',
    plate: ''
  });

  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    let processedValue = value;
    
    if (field === 'plate') {
      processedValue = value.toUpperCase();
    } else if (['name', 'celula', 'brand', 'model', 'color'].includes(field)) {
      processedValue = toTitleCase(value);
    }
    
    setDriverData({ ...driverData, [field]: processedValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      driverData.name &&
      driverData.cedula &&
      driverData.celula &&
      driverData.brand &&
      driverData.model &&
      driverData.color &&
      driverData.plate
    ) {
      onSubmit(driverData);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col px-8 pt-10 pb-12 min-h-screen overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col"
      >
        <button
          id="back-to-selection-driver"
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Volver</span>
        </button>

        <div className="space-y-3 mb-8">
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            Datos de <br />
            <span className="text-primary">Conductor</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Completa tu perfil y los datos de tu vehículo para empezar.
          </p>
        </div>

        <form id="driver-form" onSubmit={handleSubmit} className="flex-1 space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={driverData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                  placeholder="Usuario SyC"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Cédula</label>
                <input
                  type="text"
                  required
                  value={driverData.cedula}
                  onChange={(e) => setDriverData({ ...driverData, cedula: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                  placeholder="ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Célula</label>
                <input
                  type="text"
                  required
                  value={driverData.celula}
                  onChange={(e) => handleInputChange('celula', e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                  placeholder="Grupo"
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Car className="w-4 h-4 mr-2 text-primary" />
              Información del Vehículo
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Marca</label>
                <input
                  type="text"
                  required
                  value={driverData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                  placeholder="Ej. Mazda..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Modelo</label>
                <input
                  type="text"
                  required
                  value={driverData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                  placeholder="Ej. CX-5..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Color</label>
                <input
                  type="text"
                  required
                  value={driverData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                  placeholder="Ej. Rojo..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Placa</label>
                <input
                  type="text"
                  required
                  value={driverData.plate}
                  onChange={(e) => handleInputChange('plate', e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                  placeholder="SYC123"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" className="w-full h-14 text-lg font-bold group">
              <span>Finalizar Registro</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
