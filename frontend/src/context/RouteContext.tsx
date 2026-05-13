import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MOCK_ROUTES, Route } from '../mock/data';

export interface RouteState extends Route {
  pasajeros: { id: string; nombre: string }[];
  status: Route['status'];
}

export interface RutaContextType {
  rutas: RouteState[];
  crearRuta: (route: Omit<RouteState, 'pasajeros' | 'status' | 'availableSeats'> & { availableSeats?: number }) => void;
  obtenerRutas: () => RouteState[];
  obtenerRutaPorId: (rutaId: string) => RouteState | undefined;
  unirseARuta: (rutaId: string, pasajero: { id: string; nombre: string }) => boolean;
  salirDeRuta: (rutaId: string, pasajeroId: string) => boolean;
  finalizarRuta: (rutaId: string) => void;
}

const initialRutas: RouteState[] = MOCK_ROUTES.map((route) => ({
  ...route,
  pasajeros: [],
  status: route.status === 'active' ? 'active' : 'completed',
}));

const RouteContext = createContext<RutaContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rutas, setRutas] = useState<RouteState[]>(() => {
    const saved = localStorage.getItem('rivo_rutas');
    return saved ? JSON.parse(saved) : initialRutas;
  });

  useEffect(() => {
    localStorage.setItem('rivo_rutas', JSON.stringify(rutas));
  }, [rutas]);

  const obtenerRutas = () => rutas.filter((ruta) => ruta.status === 'active');

  const obtenerRutaPorId = (rutaId: string) => rutas.find((ruta) => ruta.id === rutaId);

  const crearRuta = (route: Omit<RouteState, 'pasajeros' | 'status' | 'availableSeats'> & { availableSeats?: number }) => {
    const alreadyHasActiveRoute = rutas.some(
      (item) => item.driverId === route.driverId && item.status === 'active'
    );

    if (alreadyHasActiveRoute) {
      return;
    }

    const nuevaRuta: RouteState = {
      ...route,
      pasajeros: [],
      status: 'active',
      availableSeats: route.availableSeats ?? route.seats,
    };

    setRutas((current) => [nuevaRuta, ...current]);
  };

  const unirseARuta = (rutaId: string, pasajero: { id: string; nombre: string }) => {
    const passengerHasActiveRoute = rutas.some(
      (ruta) => ruta.status === 'active' && ruta.pasajeros.some(p => p.id === pasajero.id)
    );

    if (passengerHasActiveRoute) {
      return false;
    }

    let joined = false;

    setRutas((current) =>
      current.map((ruta) => {
        if (ruta.id !== rutaId || ruta.status !== 'active') {
          return ruta;
        }

        if (ruta.pasajeros.some(p => p.id === pasajero.id) || ruta.pasajeros.length >= ruta.seats) {
          return ruta;
        }

        joined = true;
        const pasajeros = [...ruta.pasajeros, pasajero];

        return {
          ...ruta,
          pasajeros,
          availableSeats: Math.max(0, ruta.seats - pasajeros.length),
        };
      })
    );

    return joined;
  };

  const salirDeRuta = (rutaId: string, pasajeroId: string) => {
    let removed = false;

    setRutas((current) =>
      current.map((ruta) => {
        if (ruta.id !== rutaId || ruta.status !== 'active') {
          return ruta;
        }

        const pasajeros = ruta.pasajeros.filter((p) => p.id !== pasajeroId);
        if (pasajeros.length !== ruta.pasajeros.length) {
          removed = true;
        }

        return {
          ...ruta,
          pasajeros,
          availableSeats: Math.max(0, ruta.seats - pasajeros.length),
        };
      })
    );

    return removed;
  };

  const finalizarRuta = (rutaId: string) => {
    setRutas((current) =>
      current.map((ruta) =>
        ruta.id === rutaId
          ? {
              ...ruta,
              status: 'completed',
              pasajeros: [],
              availableSeats: 0,
            }
          : ruta
      )
    );
  };

  return (
    <RouteContext.Provider
      value={{
        rutas,
        crearRuta,
        obtenerRutas,
        obtenerRutaPorId,
        unirseARuta,
        salirDeRuta,
        finalizarRuta,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRuta = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRuta must be used within a RouteProvider');
  }
  return context;
};
