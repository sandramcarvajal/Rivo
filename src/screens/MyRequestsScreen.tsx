import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, MapPin, ShieldCheck, ChevronRight, AlertCircle, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_REQUESTS } from '../mock/data';

export const MyRequestsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-slate-100">
      <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 flex items-center space-x-4 pl-20">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Viajes</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          {MOCK_REQUESTS.map((req, idx) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col space-y-5"
            >
               <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Inbox className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Solicitud #8241</p>
                        <h4 className="font-bold text-gray-900">Ruta a Sede Norte</h4>
                     </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {req.status === 'pending' ? 'Pendiente' : 'Aceptada'}
                  </div>
               </div>

               <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                     <Clock className="w-4 h-4 text-gray-400" />
                     <span className="text-sm font-medium text-gray-600">Hoy, 17:30</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <ShieldCheck className="w-4 h-4 text-green-500" />
                     <span className="text-xs font-medium text-gray-400">SyC Seguro</span>
                  </div>
               </div>

               <div className="pt-4 border-t border-gray-50 flex items-center justify-between group cursor-pointer" onClick={() => navigate('/route/r1')}>
                  <span className="text-sm font-bold text-primary">Ver detalles del viaje</span>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
               </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex space-x-4 items-start">
           <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
           <p className="text-xs text-blue-800 leading-relaxed font-medium">
             Recuerda estar en el punto de encuentro 5 minutos antes de la hora acordada para facilitar la salida del compañero.
           </p>
        </div>
      </div>
    </div>
  );
};
