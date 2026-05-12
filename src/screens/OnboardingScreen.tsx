import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { OnboardingSelection } from './OnboardingSelection';
import { DriverOnboardingForm, DriverFormData } from './DriverOnboardingForm';
import { PassengerOnboardingForm, PassengerFormData } from './PassengerOnboardingForm';

export const OnboardingScreen: React.FC = () => {
  const { completePassengerProfile, completeDriverProfile, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'selection' | 'passenger-form' | 'driver-form'>('selection');

  const handlePassengerSubmit = (data: PassengerFormData) => {
    completePassengerProfile(data);
    navigate('/passenger');
  };

  const handleDriverSubmit = (data: DriverFormData) => {
    completeDriverProfile(data);
    navigate('/driver');
  };

  const getUserNameFromEmail = (email?: string) => {
    if (!email) return 'Usuario';
    return email.split('@')[0] || 'Usuario';
  };

  if (step === 'driver-form') {
    return <DriverOnboardingForm onBack={() => setStep('selection')} onSubmit={handleDriverSubmit} />;
  }

  if (step === 'passenger-form') {
    return <PassengerOnboardingForm onBack={() => setStep('selection')} onSubmit={handlePassengerSubmit} />;
  }

  return (
    <OnboardingSelection
      userName={getUserNameFromEmail(user?.email)}
      onSelectDriver={() => setStep('driver-form')}
      onSelectPassenger={() => setStep('passenger-form')}
    />
  );
};
