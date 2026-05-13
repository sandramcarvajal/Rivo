import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, CreditCard, Users, ChevronLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface PassengerFormData {
  name: string;
  cedula: string;
  celula: string;
}

interface PassengerOnboardingFormProps {
  onBack: () => void;
  onSubmit: (data: PassengerFormData) => void;
}

export const PassengerOnboardingForm: React.FC<PassengerOnboardingFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState<PassengerFormData>({
    name: '',
    cedula: '',
    celula: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.cedula && formData.celula) {
      onSubmit(formData);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col px-8 pt-12 pb-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col"
      >
        <button
          id="back-to-selection"
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Volver</span>
        </button>

        <div className="space-y-3 mb-10">
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            Datos de <br />
            <span className="text-primary">Pasajero</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Necesitamos esta información para garantizar la seguridad en tus viajes.
          </p>
        </div>

        <form id="passenger-form" onSubmit={handleSubmit} className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="input-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                placeholder="Usuario SyC"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Cédula de Ciudadanía</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <input
                id="input-cedula"
                type="text"
                required
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                placeholder="Número de identificación"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Célula a la que pertenece</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Users className="w-5 h-5" />
              </div>
              <input
                id="input-celula"
                type="text"
                required
                value={formData.celula}
                onChange={(e) => setFormData({ ...formData, celula: e.target.value })}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                placeholder="Ej. Desarrollo, Ventas, etc."
              />
            </div>
          </div>

          <div className="pt-8">
            <Button type="submit" className="w-full h-16 text-lg font-bold group">
              <span>Finalizar Registro</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
