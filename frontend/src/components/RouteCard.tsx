import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import { Route } from '../mock/data';
import { cn, toTitleCase } from '../lib/utils';

interface RouteCardProps {
  route: Route;
  onClick: (route: Route) => void;
  className?: string;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onClick, className }) => {
  const driverName = toTitleCase(route.driverName);
  const origin = toTitleCase(route.origin);
  const destination = toTitleCase(route.destination);

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(route)}
      className={cn(
        'bg-white border border-slate-100 rounded-xl p-6 shadow-soft hover:border-blue-200 transition-all cursor-pointer group',
        className
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${driverName.replace(/ /g, '+')}&background=E0F2FE&color=0369A1`}
              alt={driverName}
              className="w-12 h-12 rounded-md shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 leading-tight">{driverName}</h4>
            <div className="flex items-center gap-1 mt-0.5">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SyC • Mazda 3</span>
            </div>
          </div>
        </div>
        <div className="bg-green-50 px-3 py-1.5 rounded-sm border border-green-100/50">
          <span className="text-green-700 font-black text-lg tracking-tighter">${route.price.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4 relative mb-6 pl-2">
        {/* Connection line */}
        <div className="absolute left-[13px] top-[14px] bottom-[14px] w-[2px] bg-slate-100" />
        
        <div className="flex items-center space-x-4">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50 z-10" />
          <p className="text-xs font-semibold text-slate-500 truncate">{origin}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white z-10" />
          <p className="text-xs font-bold text-slate-800 truncate">{destination}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5" />
            <span>{route.date}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            <span>{route.time}</span>
          </div>
        </div>
        <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-sm">
           <Users className="w-3.5 h-3.5 text-slate-400 mr-2" />
           <span className={cn(
             "text-[10px] font-black uppercase tracking-widest",
             route.availableSeats === 0 ? 'text-red-500' : 'text-slate-600'
           )}>
             {route.availableSeats} Cupos
           </span>
        </div>
      </div>
    </motion.div>
  );
};
