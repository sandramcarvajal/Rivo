import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Car, User, ArrowRight, ShieldCheck, CreditCard, Users, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const OnboardingScreen: React.FC = () => {
  const { setRole, completeProfile, completePassengerProfile, completeDriverProfile, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'selection' | 'passenger-form' | 'driver-form'>('selection');
  
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    celula: ''
  });

  const [driverData, setDriverData] = useState({
    name: '',
    cedula: '',
    celula: '',
    brand: '',
    model: '',
    color: '',
    plate: ''
  });

  const handleSelection = (role: 'driver' | 'passenger') => {
    if (role === 'driver') {
      setStep('driver-form');
    } else {
      setStep('passenger-form');
    }
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.cedula && formData.celula) {
      completePassengerProfile(formData);
      navigate('/passenger-home');
    }
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (driverData.name && driverData.cedula && driverData.celula && driverData.brand && driverData.model && driverData.color && driverData.plate) {
      completeDriverProfile(driverData);
      navigate('/driver-home');
    }
  };

  if (step === 'driver-form') {
    return (
      <div className="flex-1 bg-white flex flex-col px-8 pt-10 pb-12 min-h-screen overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col"
        >
          <button 
            id="back-to-selection-driver"
            onClick={() => setStep('selection')}
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

          <form id="driver-form" onSubmit={handleDriverSubmit} className="flex-1 space-y-5">
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
                    onChange={(e) => setDriverData({ ...driverData, name: e.target.value })}
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
                    onChange={(e) => setDriverData({ ...driverData, celula: e.target.value })}
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
                    onChange={(e) => setDriverData({ ...driverData, brand: e.target.value })}
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
                    onChange={(e) => setDriverData({ ...driverData, model: e.target.value })}
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
                    onChange={(e) => setDriverData({ ...driverData, color: e.target.value })}
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
                    onChange={(e) => setDriverData({ ...driverData, plate: e.target.value.toUpperCase() })}
                    className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                    placeholder="SYC123"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit"
                className="w-full h-14 text-lg font-bold group"
              >
                <span>Finalizar Registro</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (step === 'passenger-form') {
    return (
      <div className="flex-1 bg-white flex flex-col px-8 pt-12 pb-12 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col"
        >
          <button 
            id="back-to-selection"
            onClick={() => setStep('selection')}
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

          <form id="passenger-form" onSubmit={handlePassengerSubmit} className="flex-1 space-y-6">
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
              <Button 
                type="submit"
                className="w-full h-16 text-lg font-bold group"
              >
                <span>Finalizar Registro</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col px-8 pt-16 pb-12 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Configuración Inicial</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            ¿Cómo usarás <br />
            <span className="text-primary">Rivo</span> hoy?
          </h1>
          <p className="text-slate-500 font-medium">
            Hola {user?.name?.split(' ')[0] || 'Usuario'}, selecciona tu perfil para comenzar.
          </p>
        </div>

        <div className="flex-1 space-y-4">
          <button
            id="select-driver"
            onClick={() => handleSelection('driver')}
            className="w-full text-left p-6 rounded-[32px] border-2 border-slate-100 bg-white hover:border-primary/30 hover:bg-slate-50 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Car className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">Conductor</h3>
                  <p className="text-sm text-slate-500">Comparte tu vehículo y gastos.</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Car className="w-32 h-32 transform -rotate-12" />
            </div>
          </button>

          <button
            id="select-passenger"
            onClick={() => handleSelection('passenger')}
            className="w-full text-left p-6 rounded-[32px] border-2 border-slate-100 bg-white hover:border-primary/30 hover:bg-slate-50 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">Pasajero</h3>
                  <p className="text-sm text-slate-500">Encuentra rutas cómodas y seguras.</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <User className="w-32 h-32 transform rotate-12" />
            </div>
          </button>
        </div>

        <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-xs text-amber-700 text-center font-medium">
            Podrás cambiar de rol en cualquier momento desde el menú lateral.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
