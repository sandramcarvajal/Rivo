import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, MapPin, ShieldCheck, ChevronRight, AlertCircle, Inbox, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_REQUESTS } from '../mock/data';
import { toTitleCase } from '../lib/utils';

export const MyRequestsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 flex items-center justify-between pl-20">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center shadow-lg shadow-primary/20">
              <div className="w-2 h-2 bg-white rounded-sm rotate-45" />
           </div>
           <span className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">Rivo</span>
        </div>
        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-md border border-slate-100 shadow-sm transition-transform active:scale-95">
           <Bell className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center gap-2 px-1">
           <div className="w-1.5 h-6 bg-primary rounded-full" />
           <h2 className="text-lg font-black text-slate-900 tracking-tight">Mis Solicitudes</h2>
        </div>

        <div className="space-y-6">
          {MOCK_REQUESTS.map((req, idx) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-5"
            >
               <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-slate-50 rounded-md flex items-center justify-center border border-slate-100">
                        <Inbox className="w-6 h-6 text-primary" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Viaje Programado</p>
                        <h4 className="font-black text-slate-800 tracking-tight leading-tight">Ruta a Sede Norte</h4>
                     </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${req.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                    {req.status === 'pending' ? 'Buscando' : 'Confirmado'}
                  </div>
               </div>

               <div className="flex items-center gap-6 px-1">
                  <div className="flex items-center space-x-2">
                     <Clock className="w-4 h-4 text-slate-300" />
                     <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Hoy, 17:30</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <ShieldCheck className="w-4 h-4 text-green-500" />
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Rivo Safe</span>
                  </div>
               </div>

               <div className="pt-5 border-t border-slate-50 flex items-center justify-between group cursor-pointer" onClick={() => navigate('/route/r1')}>
                  <span className="text-xs font-black text-primary uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform inline-block">Ver detalles del viaje</span>
                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-all" />
               </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex space-x-4 items-start">
           <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
           <p className="text-xs text-blue-800 leading-relaxed font-medium">
             Recuerda estar en el punto de encuentro 5 minutos antes de la hora acordada para facilitar la salida del compañero.
           </p>
        </div>
      </div>
    </div>
  );
};
