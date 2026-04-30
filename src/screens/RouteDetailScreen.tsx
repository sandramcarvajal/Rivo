import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, ShieldCheck, MessageCircle, AlertCircle, ListChecks } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_ROUTES, MOCK_REQUESTS } from '../mock/data';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const RouteDetailScreen: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const route = MOCK_ROUTES.find(r => r.id === id);
  const [requested, setRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!route) return null;

  const isDriver = user?.role === 'driver';
  const pendingRequests = MOCK_REQUESTS.filter(r => r.routeId === route.id && r.status === 'pending');

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
           <span className="text-[10px] font-bold text-gray-700 uppercase">Ruta Segura SyC</span>
        </div>
      </div>

      <div className="flex-1 bg-white -mt-8 rounded-t-[40px] px-8 pt-8 overflow-y-auto space-y-8 relative z-10 shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {route.origin} <span className="text-slate-300 font-medium">→</span> {route.destination}
            </h1>
            <p className="text-gray-500 text-sm font-medium">Ruta Activa</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">${route.price.toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-medium uppercase">Por asiento</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <InfoCard icon={<Calendar className="w-5 h-5 text-blue-500" />} label="Fecha" value={route.date} />
          <InfoCard icon={<Clock className="w-5 h-5 text-blue-500" />} label="Hora" value={route.time} />
          <InfoCard icon={<Users className="w-5 h-5 text-blue-500" />} label="Cupos" value={`${route.availableSeats}/${route.seats}`} />
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest text-slate-400">
            {isDriver ? 'Pasajeros Actuales' : 'Tu Conductor'}
          </h3>
          {isDriver ? (
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-2">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <Users className="w-6 h-6" />
               </div>
               <p className="text-sm font-bold text-slate-600">Aún no hay pasajeros confirmados</p>
               <p className="text-xs text-slate-400">Comparte tu ruta para conseguir pasajeros.</p>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
              <div className="flex items-center space-x-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${route.driverName}&background=1A365D&color=fff`} 
                  className="w-14 h-14 rounded-2xl shadow-sm" 
                  alt="driver" 
                />
                <div>
                  <p className="font-bold text-gray-900">{route.driverName}</p>
                  <div className="flex items-center space-x-1">
                     {[1,2,3,4,5].map(i => <div key={i} className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />)}
                     <span className="text-xs text-gray-400 ml-1">(42 viajes)</span>
                  </div>
                </div>
              </div>
              <button className="p-3 bg-white border border-gray-100 rounded-xl text-primary shadow-sm active:scale-95 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest text-slate-400">Detalles del Viaje</h3>
          <div className="space-y-4">
             <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                   <AlertCircle className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">Punto de encuentro: Lobby de {route.origin} a las {route.time}. Por favor ser puntuales para evitar retrasos.</p>
             </div>
          </div>
        </div>

        <div className="py-6 safe-area-bottom">
          {isDriver ? (
            <div className="space-y-3">
              <Button 
                className="w-full h-16 text-lg tracking-tight shadow-strong flex items-center justify-center space-x-2"
                onClick={() => navigate('/manage-requests')}
              >
                <ListChecks className="w-5 h-5" />
                <span>Gestionar Solicitudes ({pendingRequests.length})</span>
              </Button>
              <Button variant="outline" className="w-full h-16 text-slate-400 border-slate-100">
                Cancelar Ruta
              </Button>
            </div>
          ) : (
            requested ? (
              <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="bg-green-50 border border-green-100 p-6 rounded-3xl text-center"
              >
                 <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6 text-white" />
                 </div>
                 <h4 className="font-bold text-green-900 text-lg mb-1">Solicitud Enviada</h4>
                 <p className="text-sm text-green-700">Te notificaremos cuando {route.driverName} apruebe tu solicitud.</p>
                 <Button 
                  variant="outline" 
                  className="mt-6 w-full py-4 border-green-200 text-green-800"
                  onClick={() => navigate('/my-requests')}
                >
                    Ver mis solicitudes
                 </Button>
              </motion.div>
            ) : (
              <Button 
                className="w-full h-16 text-lg tracking-tight shadow-strong" 
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
  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-black text-gray-900 tracking-tight">{value}</p>
  </div>
);
