import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

import illu1 from '../assets/Maîtrisez votre énergie illustration.svg';
import illu2 from '../assets/Soyez alerte à temps.svg';
import illu3 from '../assets/Réduisez vos dépenses.svg';
import logoUrl from '../assets/logo voltiq.svg';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const { completeOnboarding } = useData();

  const steps = [
    {
      img: illu1,
      title: 'Maîtrisez votre énergie',
      desc: 'VoltIQ vous aide à comprendre et suivre la consommation de votre compteur prépayé, jour après jour.'
    },
    {
      img: illu2,
      title: 'Soyez alerte à temps',
      desc: 'Fini les coupures surprises ! Recevez des rappels automatiques avant que votre crédit ne s\'épuise.'
    },
    {
      img: illu3,
      title: 'Réduisez vos dépenses',
      desc: 'Analysez vos habitudes, identifiez ce qui consomme le plus et faites des économies sur vos prochaines recharges.'
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      
      {/* Header / Logo */}
      <div style={{ padding: '2rem 1rem 1rem 1rem', width: '100%', textAlign: 'center' }}>
        <img src={logoUrl} alt="VoltIQ Logo" style={{ width: '130px', height: 'auto' }} />
      </div>
      
      {/* Scrollable / Flexible Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', maxWidth: '400px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img src={steps[step].img} alt={steps[step].title} style={{ maxWidth: '100%', height: '250px', objectFit: 'contain' }} />
        </div>
        <div style={{ minHeight: '150px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: '900', textAlign: 'center' }}>{steps[step].title}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.5', textAlign: 'center' }}>
            {steps[step].desc}
          </p>
        </div>
      </div>

      {/* Fixed Bottom Action Area */}
      <div style={{ width: '100%', maxWidth: '400px', padding: '1rem 1rem 2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {steps.map((_, index) => (
            <div 
              key={index} 
              style={{ 
                width: index === step ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                backgroundColor: index === step ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'all 0.3s ease'
              }} 
            />
          ))}
        </div>

        {step < steps.length - 1 ? (
          <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={nextStep}>
            Suivant <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
          </button>
        ) : (
          <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 'bold' }} onClick={completeOnboarding}>
            Commencer
          </button>
        )}
      </div>
    </div>
  );
}
