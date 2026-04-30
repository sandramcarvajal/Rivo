import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, ShieldCheck, MessageCircle, AlertCircle, ListChecks, Star } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_ROUTES, MOCK_REQUESTS } from '../mock/data';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { toTitleCase } from '../lib/utils';

export const RouteDetailScreen: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Find route in mock or localStorage
  const mockRoute = MOCK_ROUTES.find(r => r.id === id);
  const localRoutes = JSON.parse(localStorage.getItem('rivo_driver_routes') || '[]');
  const localRoute = localRoutes.find((r: any) => r.id === id);
  const route = mockRoute || localRoute;

  const [requested, setRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!route) return null;

  const isDriver = user?.role === 'driver';
  const pendingRequests = MOCK_REQUESTS.filter(r => r.routeId === route.id && r.status === 'pending');
  
  const origin = toTitleCase(route.origin);
  const destination = toTitleCase(route.destination);
  const driverName = toTitleCase(route.driverName || (isDriver ? user?.name : 'Conductor SyC'));

  const handleRequest = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    setRequested(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Custom Header */}
      <div className="absolute top-0 left-0 right-0 px-6 py-12 flex justify-between items-center z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-900 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="h-64 bg-slate-200 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <img 
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop" 
          alt="Map Placeholder" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
           <ShieldCheck className="w-3 h-3 text-green-500" />
           <span className="text-[10px] font-bold text-gray-700 uppercase">Ruta Segura Rivo</span>
        </div>
      </div>

      <div className="flex-1 bg-white -mt-8 rounded-t-[40px] px-8 pt-8 overflow-y-auto space-y-8 relative z-10 shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
              {origin} <span className="text-slate-200 font-medium mx-1">→</span> {destination}
            </h1>
            <p className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-widest">Activa</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary leading-none">${route.price.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Por asiento</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <InfoCard icon={<Calendar className="w-5 h-5 text-blue-500" />} label="Fecha" value={route.date} />
          <InfoCard icon={<Clock className="w-5 h-5 text-blue-500" />} label="Hora" value={route.time} />
          <InfoCard icon={<Users className="w-5 h-5 text-blue-500" />} label="Cupos" value={`${route.availableSeats}/${route.seats || route.totalSeats}`} />
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] px-1">
            {isDriver ? 'Pasajeros Confirmados' : 'Tu Conductor'}
          </h3>
          {isDriver ? (
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3">
               <div className="w-14 h-14 bg-white rounded-md shadow-sm flex items-center justify-center text-slate-200">
                  <Users className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-sm font-black text-slate-700">Sin pasajeros aún</p>
                  <p className="text-[11px] text-slate-400 font-medium">Gestiona las solicitudes pendientes para llenar tu ruta.</p>
               </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${driverName.replace(/ /g, '+')}&background=1A365D&color=fff`} 
                  className="w-14 h-14 rounded-md shadow-sm" 
                  alt="driver" 
                />
                <div>
                  <p className="font-black text-gray-900 tracking-tight">{driverName}</p>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                     <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                     <span className="text-[10px] text-gray-500 font-black">4.9 SCO RE</span>
                     <span className="text-[10px] text-gray-300 font-medium ml-1 tracking-widest uppercase">Excellent</span>
                  </div>
                </div>
              </div>
              <button className="p-3 bg-slate-50 rounded-xl text-primary shadow-sm active:scale-95 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] px-1">Detalles del Viaje</h3>
          <div className="space-y-4">
             <div className="flex space-x-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center flex-shrink-0 shadow-sm">
                   <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-bold">
                   Punto de encuentro: Lobby de <span className="text-slate-800">{origin}</span> a las <span className="text-slate-800">{route.time}</span>. Por favor ser puntuales.
                </p>
             </div>
          </div>
        </div>

        <div className="py-6 safe-area-bottom">
          {isDriver ? (
            <div className="space-y-3">
              <Button 
                className="w-full h-16 text-lg font-black tracking-tight shadow-strong flex items-center justify-center space-x-3 rounded-xl"
                onClick={() => navigate('/manage-requests')}
              >
                <ListChecks className="w-6 h-6" />
                <span>Gestionar Solicitudes ({pendingRequests.length})</span>
              </Button>
              <Button variant="outline" className="w-full h-16 text-slate-400 border-slate-100 rounded-xl font-black text-xs uppercase tracking-widest">
                Cancelar Ruta
              </Button>
            </div>
          ) : (
            requested ? (
              <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center"
              >
                 <div className="w-14 h-14 bg-green-500 rounded-md flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                    <ShieldCheck className="w-7 h-7 text-white" />
                 </div>
                 <h4 className="font-black text-green-900 text-xl mb-1 tracking-tight">¡Solicitud Enviada!</h4>
                 <p className="text-sm text-green-700 font-medium">Te notificaremos cuando {driverName} apruebe tu solicitud.</p>
                 <Button 
                  variant="outline" 
                  className="mt-6 w-full h-14 border-green-200 text-green-800 rounded-md font-black text-xs uppercase tracking-widest"
                  onClick={() => navigate('/my-requests')}
                >
                    Ver mis solicitudes
                 </Button>
              </motion.div>
            ) : (
              <Button 
                className="w-full h-18 text-xl font-black tracking-tight shadow-strong rounded-xl" 
                onClick={handleRequest}
                isLoading={isLoading}
              >
                Solicitar Cupo ahora
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: any) => (
  <div className="bg-slate-50 border border-slate-100 p-4 rounded-md text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-black text-gray-900 tracking-tight">{value}</p>
  </div>
);
