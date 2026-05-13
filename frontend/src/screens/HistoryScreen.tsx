import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Users, CheckCircle2, ChevronRight, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MOCK_HISTORY = [
  {
    id: 'h1',
    origin: 'SYC',
    destination: 'Delacuesta CC',
    date: '2026-04-25',
    passengers: 3,
    status: 'completed'
  },
  {
    id: 'h2',
    origin: 'Piedecuesta',
    destination: 'SYC',
    date: '2026-04-23',
    passengers: 2,
    status: 'completed'
  }
];

export const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 flex items-center gap-4 pl-14">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Historial de Viajes</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {MOCK_HISTORY.length > 0 ? (
          <div className="space-y-4">
            {MOCK_HISTORY.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Completado</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{item.date}</span>
                </div>

                <div className="space-y-3 relative mb-4">
                  <div className="absolute left-[3px] top-[10px] bottom-[10px] w-[1px] bg-slate-100" />
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300 z-10" />
                    <p className="text-xs font-medium text-slate-500">{item.origin}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-3 h-3 text-primary z-10" />
                    <p className="text-sm font-bold text-slate-800">{item.destination}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{item.passengers} Pasajeros</span>
                  </div>
                  <button className="text-xs font-black text-primary uppercase tracking-tighter flex items-center gap-1 group-hover:gap-2 transition-all">
                    Detalles <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">No tienes viajes aún</h3>
            <p className="text-sm text-slate-400 max-w-[200px] mx-auto mt-2">
              Tus viajes completados aparecerán aquí para que lleves un control.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
