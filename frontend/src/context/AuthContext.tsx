import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../mock/data';
import { v4 as uuidv4 } from 'uuid';

interface Vehicle {
  make: string;
  model: string;
  color: string;
  placa: string;
  capacity: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rivo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });
  const [vehicle, setVehicle] = useState<Vehicle>(() => {
    const saved = localStorage.getItem('rivo_vehicle');
    return saved ? JSON.parse(saved) : {
      make: 'Mazda',
      model: '3 Grand Touring',
      color: 'Gris Metalizado',
      placa: 'SYC123',
      capacity: 4
    };
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('rivo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rivo_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('rivo_vehicle', JSON.stringify(vehicle));
  }, [vehicle]);

  useEffect(() => {
    // Simulate checking session
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toTitleCase = (str: string = "") => {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  const login = async (email: string) => {
    if (!email.toLowerCase().endsWith('@syc.com.co')) {
      return false;
    }

    // Extract name from email (e.g. juan.perez@syc.com.co -> Juan Perez)
    const rawName = email.split('@')[0].replace(/\./g, ' ');
    const name = toTitleCase(rawName);

    // Generate token for persistent session
    const newToken = 'authenticated_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    setToken(newToken);

    // Mock successful login
    setUser({
      id: uuidv4(),
      name: name,
      email: email,
      role: null,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=1A365D&color=fff`,
      hasCompletedProfile: false, // Default for new login in this demo
    });
    return true;
  };

  const logout = () => {
    setToken(null);
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
        name: toTitleCase(data.name),
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
        name: toTitleCase(data.name),
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
      token,
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
