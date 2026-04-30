import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../mock/data';

interface Vehicle {
  make: string;
  model: string;
  color: string;
  placa: string;
  capacity: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: 'driver' | 'passenger') => void;
  completeProfile: () => void;
  completePassengerProfile: (data: { name: string, cedula: string, celula: string }) => void;
  completeDriverProfile: (data: { 
    name: string, 
    cedula: string, 
    celula: string, 
    brand: string, 
    model: string, 
    color: string,
    plate: string
  }) => void;
  vehicle: Vehicle;
  updateVehicle: (vehicle: Vehicle) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle>({
    make: 'Mazda',
    model: '3 Grand Touring',
    color: 'Gris Metalizado',
    placa: 'SYC123',
    capacity: 4
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking session
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string) => {
    if (!email.toLowerCase().endsWith('@syc.com.co')) {
      return false;
    }

    // Mock successful login
    setUser({
      id: 'u2',
      name: 'Usuario SyC',
      email: email,
      role: null,
      avatar: 'https://ui-avatars.com/api/?name=Usuario+SyC&background=1A365D&color=fff',
      hasCompletedProfile: false, // Default for new login in this demo
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const setRole = (role: 'driver' | 'passenger') => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const completeProfile = () => {
    if (user) {
      setUser({ ...user, hasCompletedProfile: true });
    }
  };

  const completePassengerProfile = (data: { name: string, cedula: string, celula: string }) => {
    if (user) {
      setUser({ 
        ...user, 
        name: data.name,
        cedula: data.cedula,
        celula: data.celula,
        role: 'passenger',
        hasCompletedProfile: true 
      });
    }
  };

  const completeDriverProfile = (data: { 
    name: string, 
    cedula: string, 
    celula: string, 
    brand: string, 
    model: string, 
    color: string,
    plate: string
  }) => {
    if (user) {
      setUser({ 
        ...user, 
        name: data.name,
        cedula: data.cedula,
        celula: data.celula,
        role: 'driver',
        hasCompletedProfile: true 
      });
      setVehicle({
        ...vehicle,
        make: data.brand,
        model: data.model,
        color: data.color,
        placa: data.plate
      });
    }
  };

  const updateVehicle = (newVehicle: Vehicle) => {
    setVehicle(newVehicle);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      setRole, 
      completeProfile, 
      completePassengerProfile,
      completeDriverProfile,
      vehicle, 
      updateVehicle, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
