import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bell, Settings, Filter, Home, Search, ClipboardList, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ROUTES, Route } from '../mock/data';
import { RouteCard } from '../components/RouteCard';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const PassengerHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [routes] = useState<Route[]>(MOCK_ROUTES);

  const filteredRoutes = routes.filter(r => 
    r.origin.toLowerCase().includes(filter.toLowerCase()) || 
    r.destination.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm z-20">
        <div className="flex justify-between items-center mb-6 pl-14">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Hola, {user?.name?.split(' ')[0] || 'Usuario'}</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">¿A dónde vas?</h1>
          </div>
          <div className="flex items-center space-x-3">
             <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl relative border border-slate-100 shadow-sm">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
             </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por sede o punto de origen..."
            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/10 text-sm font-medium placeholder:text-slate-400"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm">
            <Filter className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-bold text-gray-900">Rutas sugeridas hoy</h2>
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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">No hay rutas disponibles</h3>
            <p className="text-sm text-gray-500 max-w-[240px]">
              Intenta cambiar los filtros o busca una sede diferente.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center safe-area-bottom">
        <NavIcon icon={<Home className="w-6 h-6" />} label="Inicio" active />
        <NavIcon icon={<ClipboardList className="w-6 h-6" />} label="Mis Viajes" onClick={() => navigate('/my-requests')} />
        <div className="relative -mt-12">
            <button 
              onClick={() => navigate('/role-selection')}
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
