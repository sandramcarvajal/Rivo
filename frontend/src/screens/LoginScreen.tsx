import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, ChevronRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor ingresa tu correo corporativo');
      return;
    }

    setIsLoading(true);
    // Simulate delay
    await new Promise(r => setTimeout(r, 1500));
    
    const success = await login(email);
    setIsLoading(false);

    if (success) {
      navigate('/onboarding');
    } else {
      setError('Solo se permiten correos @syc.com.co');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto flex flex-col justify-center">
      <div className="mb-12">
        <div className="w-28 h-28 bg-slate-100 border border-slate-200 rounded-[36px] flex items-center justify-center mb-8 shadow-strong">
          <img src="/logo.png" alt="Logo de Rivo" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Bienvenido a Rivo</h2>
        <p className="text-slate-500 font-medium leading-relaxed">Accede con tu cuenta corporativa para gestionar tus rutas en SyC.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100 space-y-6">
          <Input
            label="Correo Corporativo"
            placeholder="nombre@syc.com.co"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          
          <Input
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            icon={<Lock className="w-5 h-5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <button type="button" className="text-xs font-bold text-primary hover:underline uppercase tracking-wide">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-16 text-lg" 
          isLoading={isLoading}
        >
          Iniciar Sesión
        </Button>
      </form>




      {error && !error.includes('@syc.com.co') && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </motion.div>
      )}
    </div>
  );
};
