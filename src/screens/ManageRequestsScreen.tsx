import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X, Clock, MapPin, ListChecks, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_REQUESTS, MOCK_ROUTES, JoinRequest } from '../mock/data';
import { Button } from '../components/ui/Button';

export const ManageRequestsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<JoinRequest[]>(MOCK_REQUESTS);
  const pendingRequests = requests.filter(r => r.status === 'pending');

  const handleAction = async (id: string, status: 'accepted' | 'rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100">
      <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 flex items-center justify-between relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-6 top-12 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 active:scale-95 transition-transform z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-4 pl-16">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Solicitudes</h1>
        </div>
        <div className="bg-blue-100 px-3 py-1 rounded-full">
           <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{pendingRequests.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-2xl">
           <button className="flex-1 py-3 bg-white shadow-sm rounded-xl text-xs font-bold text-primary uppercase tracking-tight">Pendientes</button>
           <button className="flex-1 py-3 text-xs font-bold text-gray-400 uppercase tracking-tight">Historial</button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request, idx) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden relative"
                >
                  <div className="flex items-center space-x-4 mb-6">
                     <img 
                      src={`https://ui-avatars.com/api/?name=${request.passengerName}&background=EBF8FF&color=1A365D`} 
                      className="w-14 h-14 rounded-2xl" 
                      alt="passenger" 
                     />
                     <div>
                        <h4 className="font-bold text-lg text-gray-900 leading-tight">{request.passengerName}</h4>
                        <p className="text-xs text-blue-500 font-medium tracking-tight">Solicita unirse al viaje</p>
                     </div>
                  </div>

                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                     {(() => {
                       const route = MOCK_ROUTES.find(r => r.id === request.routeId);
                       return (
                         <>
                           <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 text-primary" />
                              <span>{route?.origin || 'Sede Principal'}</span>
                           </div>
                           <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2 text-primary" />
                              <span>Hoy, {route?.time || '00:00'}</span>
                           </div>
                         </>
                       );
                     })()}
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleAction(request.id, 'rejected')}
                      className="flex-1 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl border border-gray-100 active:scale-95 transition-transform"
                    >
                      Rechazar
                    </button>
                    <button 
                       onClick={() => handleAction(request.id, 'accepted')}
                       className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                    >
                      <Check className="w-5 h-5" />
                      <span>Aceptar</span>
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-[32px] p-12 border border-dashed border-slate-200 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListChecks className="w-8 h-8 text-slate-200" />
                 </div>
                 <h3 className="font-bold text-slate-800 mb-1">Sin solicitudes</h3>
                 <p className="text-sm text-slate-400">Todo al día por aquí.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
