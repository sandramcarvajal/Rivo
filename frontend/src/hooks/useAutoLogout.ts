/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UseAutoLogoutReturn {
  sessionExpired: boolean;
}

export const useAutoLogout = (inactivityTimeout: number = 900000): UseAutoLogoutReturn => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sessionExpired, setSessionExpired] = useState(false);

  // Refs para almacenar valores sin recrear en cada render
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Limpia datos y ejecuta logout
   */
  const performLogout = () => {
    localStorage.removeItem('rivo_user');
    localStorage.removeItem('rivo_vehicle');
    localStorage.removeItem('rivo_auth_token');
    sessionStorage.clear();

    logout();
    setSessionExpired(true);

    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
    }

    redirectTimerRef.current = setTimeout(() => {
      setSessionExpired(false);
      navigate('/login');
    }, 6000);
  };

  /**
   * Reinicia el temporizador
   */
  const resetTimer = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    if (user) {
      timeoutIdRef.current = setTimeout(() => {
        performLogout();
      }, inactivityTimeout);
    }
  };

  /**
   * Setup listeners cuando hay usuario autenticado
   */
  useEffect(() => {
    if (!user) {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      return;
    }

    // Inicia timer inicial
    resetTimer();

    // Handler para eventos
    const handleActivity = () => {
      resetTimer();
    };

    // Agrega listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [user, inactivityTimeout]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return {
    sessionExpired,
  };
};

export default useAutoLogout;
