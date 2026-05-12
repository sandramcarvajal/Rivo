import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Car, User, ArrowRight } from 'lucide-react';

interface OnboardingSelectionProps {
  userName: string;
  onSelectDriver: () => void;
  onSelectPassenger: () => void;
}

export const OnboardingSelection: React.FC<OnboardingSelectionProps> = ({
  userName,
  onSelectDriver,
  onSelectPassenger,
}) => {
  return (
    <div className="flex-1 bg-white flex flex-col px-8 pt-16 pb-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        <div className="space-y-4 mb-10">
          <div className="w-28 h-28 mx-auto rounded-[36px] bg-slate-100 border border-slate-200 flex items-center justify-center shadow-strong">
            <img src="/logo.png" alt="Logo de Rivo" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight text-center">
            ¿Cómo usarás <br />
            <span className="text-primary">Rivo</span> hoy?
          </h1>
          <p className="text-slate-500 font-medium text-center">
            Hola {userName}, selecciona tu perfil para comenzar.
          </p>
        </div>

        <div className="flex-1 space-y-4">
          <button
            id="select-driver"
            onClick={onSelectDriver}
            className="w-full text-left p-6 rounded-[32px] border-2 border-slate-100 bg-white hover:border-primary/30 hover:bg-slate-50 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Car className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">Conductor</h3>
                  <p className="text-sm text-slate-500">Comparte tu vehículo.</p>
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
            onClick={onSelectPassenger}
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
