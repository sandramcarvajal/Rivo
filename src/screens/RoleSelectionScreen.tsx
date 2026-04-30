import React from 'react';
import { motion } from 'motion/react';
import { Car, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const RoleSelectionScreen: React.FC = () => {
  const { setRole, user } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role: 'driver' | 'passenger') => {
    setRole(role);
    if (role === 'driver') {
      navigate('/driver');
    } else {
      navigate('/passenger');
    }
  };

  return (
    <div className="flex-1 bg-white p-8 flex flex-col">
      <div className="pt-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">¿Cómo viajarás hoy?</h2>
        <p className="text-gray-500">Selecciona tu rol para esta jornada de trabajo.</p>
      </div>

      <div className="flex-1 space-y-6 flex flex-col justify-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectRole('driver')}
          className="bg-primary text-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full" />
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Conductor</h3>
          <p className="text-blue-100 text-sm">Crea rutas, comparte gastos y ayuda a tus compañeros.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectRole('passenger')}
          className="bg-gray-50 border-2 border-gray-100 p-8 rounded-3xl flex flex-col items-center text-center cursor-pointer transition-all hover:border-accent"
        >
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Pasajero</h3>
          <p className="text-gray-500 text-sm">Busca rutas disponibles de tus compañeros y llega a tiempo.</p>
        </motion.div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">Puedes cambiar de rol en cualquier momento desde tu perfil.</p>
      </div>
    </div>
  );
};
