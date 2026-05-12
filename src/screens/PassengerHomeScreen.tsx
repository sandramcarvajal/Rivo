import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bell, Settings, Filter, Home, Search, ClipboardList, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRuta } from '../context/RouteContext';
import { RouteCard } from '../components/RouteCard';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from '../lib/utils';

export const PassengerHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { obtenerRutas } = useRuta();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');

  const rutas = obtenerRutas();
  const activeRoute = user?.id ? rutas.find((ruta) => ruta.pasajeros.some(p => p.id === user.id)) : undefined;
  const filteredRoutes = rutas.filter(
    (r) =>
      r.origin.toLowerCase().includes(filter.toLowerCase()) ||
      r.destination.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-tertiary overflow-hidden">
      {/* Header */}
      <div className="bg-surface px-6 pt-12 pb-6 shadow-sm z-20 border-b border-border-primary">
        <div className="flex justify-between items-center mb-8 pl-14">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center shadow-lg shadow-primary/20">
                <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
             </div>
             <span className="text-xl font-black text-body tracking-tighter uppercase italic">Rivo</span>
          </div>
          <div className="flex items-center space-x-3">
             <button className="p-3 bg-surface-soft text-text-muted rounded-md relative border border-border-primary shadow-sm transition-transform active:scale-95">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-success rounded-full border-2 border-surface"></span>
             </button>
          </div>
        </div>

        <div className="mb-6">
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">Pasajero</span>
           <h1 className="text-2xl font-black text-body tracking-tight">¿A dónde vas, {user?.name?.split(' ')[0] ? toTitleCase(user.name.split(' ')[0]) : 'Usuario'}?</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Buscar por sede o punto de origen..."
            className="w-full pl-12 pr-12 py-4 bg-surface-soft border-none rounded-md focus:ring-2 focus:ring-primary/10 text-sm font-medium placeholder:text-muted text-body"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-surface rounded-sm shadow-sm">
            <Filter className="w-4 h-4 text-primary" />
          </button>
        </div>

        {activeRoute && activeRoute.status === 'active' && (
          <div className="mt-6 bg-success-soft border border-success rounded-3xl p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-success">Ruta en curso</p>
                <p className="mt-2 text-sm text-body font-medium">Estás dentro de una ruta compartida. Puedes ver los detalles o abandonar la ruta desde aquí.</p>
              </div>
              <button
                onClick={() => navigate(`/route/${activeRoute.id}`)}
                className="text-sm font-black uppercase tracking-widest text-success bg-surface px-4 py-3 rounded-2xl shadow-sm border border-success"
              >
                Ver ruta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-bold text-body">Rutas sugeridas hoy</h2>
          <button className="text-sm font-semibold text-primary">Ver todas</button>
        </div>

        {filteredRoutes.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredRoutes.map((route, idx) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <RouteCard 
                    route={route} 
                    onClick={() => navigate(`/route/${route.id}`)} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-surface-soft rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-muted" />
            </div>
            <h3 className="font-bold text-body mb-1">No hay rutas disponibles</h3>
            <p className="text-sm text-muted max-w-[240px]">
              Intenta cambiar los filtros o busca una sede diferente.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-surface border-t border-border-primary px-8 py-4 flex justify-between items-center safe-area-bottom">
        <NavIcon icon={<Home className="w-6 h-6" />} label="Inicio" active />
        <NavIcon icon={<ClipboardList className="w-6 h-6" />} label="Mis Viajes" onClick={() => navigate('/my-requests')} />
        <div className="relative -mt-12">
            <button 
              onClick={() => navigate('/onboarding')}
              className="w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <Plus className="w-8 h-8" />
            </button>
        </div>
        <Search className="w-6 h-6 text-gray-400" />
        <User className="w-6 h-6 text-gray-400" onClick={() => navigate('/profile')} />
      </div>
    </div>
  );
};

const NavIcon = ({ icon, label, active = false, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center space-y-1">
    <div className={active ? 'text-primary' : 'text-gray-400'}>{icon}</div>
    {active && <div className="w-1 h-1 bg-primary rounded-full" />}
  </button>
);
