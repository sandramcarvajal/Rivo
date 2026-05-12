import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, DollarSign, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRuta } from '../context/RouteContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toTitleCase } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';

export const CreateRouteScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { crearRuta } = useRuta();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seats: 3,
    price: 5000,
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleCreate();
  };

  const handleCreate = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRoute = {
      id: uuidv4(),
      driverId: user.id,
      driverName: user.name,
      origin: toTitleCase(formData.origin),
      destination: toTitleCase(formData.destination),
      date: formData.date,
      time: formData.time,
      seats: formData.seats,
      availableSeats: formData.seats,
      price: formData.price,
    };

    crearRuta(newRoute);
    setIsLoading(false);
    navigate('/driver');
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="px-6 pt-12 pb-6 border-b border-gray-50 flex items-center justify-between">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-2 -ml-2 text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex space-x-1.5">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-primary' : 'w-2 bg-gray-100'}`} />
           ))}
        </div>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <header>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Ruta de Origen y Destino</h2>
               <p className="text-gray-500">¿Desde dónde inicias el viaje y a qué sede te diriges?</p>
            </header>
            
            <div className="space-y-4">
              <Input 
                label="Punto de Origen" 
                placeholder="Ej: Barrio Santa Isabel" 
                icon={<MapPin className="w-5 h-5" />} 
                value={formData.origin}
                onChange={e => setFormData({...formData, origin: e.target.value})}
              />
              <Input 
                label="Sede de Destino" 
                placeholder="Ej: Sede Principal SyC" 
                icon={<MapPin className="w-5 h-5 text-blue-500" />} 
                value={formData.destination}
                onChange={e => setFormData({...formData, destination: e.target.value})}
              />
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl">
               <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Rutas Populares
               </h4>
               <div className="space-y-3">
                  <button className="w-full text-left bg-white px-4 py-3 rounded-xl text-sm font-medium text-gray-600 border border-blue-100">SYC → Delacuesta CC</button>
                  <button className="w-full text-left bg-white px-4 py-3 rounded-xl text-sm font-medium text-gray-600 border border-blue-100">Delacuesta CC → SYC</button>
               </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <header>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Programación</h2>
               <p className="text-gray-500">¿Cuándo tienes planeado realizar el recorrido?</p>
            </header>
            
            <div className="space-y-4">
              <Input 
                label="Fecha" 
                type="date" 
                icon={<Calendar className="w-5 h-5" />} 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
              <Input 
                label="Hora de Salida" 
                type="time" 
                icon={<Clock className="w-5 h-5" />} 
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <header>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Cupos y Aporte</h2>
               <p className="text-gray-500">Define cuántos compañeros puedes llevar y el costo sugerido.</p>
            </header>
            
            <div className="space-y-8">
              <div className="space-y-4">
                 <label className="text-sm font-medium text-gray-700 ml-1">Asientos disponibles</label>
                 <div className="flex justify-between items-center space-x-4">
                    {[1, 2, 3, 4].map(n => (
                       <button
                         key={n}
                         onClick={() => setFormData({...formData, seats: n})}
                         className={`w-12 h-12 rounded-2xl font-bold transition-all ${formData.seats === n ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                       >
                         {n}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-sm font-medium text-gray-700 ml-1">Aporte por pasajero ($COP)</label>
                 <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       <input 
                          type="number"
                          className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl font-bold text-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                       />
                    </div>
                 </div>
                 <p className="text-xs text-gray-400 px-1 italic">Sugerimos entre $4.000 y $7.000 para rutas inter-sedes.</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-6 py-8 safe-area-bottom flex justify-center">
        <Button className="w-full max-w-sm h-16 shadow-xl rounded-xl" onClick={handleNext} isLoading={isLoading}>
          {step < 3 ? 'Siguiente Paso' : 'Confirmar y Publicar'}
        </Button>
      </div>
    </div>
  );
};
