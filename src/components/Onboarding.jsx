import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

// Importation des illustrations pour chaque étape
import illu1 from '../assets/Maîtrisez votre énergie illustration.svg';
import illu2 from '../assets/Soyez alerte à temps.svg';
import illu3 from '../assets/Réduisez vos dépenses.svg';
import logoUrl from '../assets/logo voltiq.svg';

/**
 * Composant d'Onboarding (Écrans de bienvenue).
 * S'affiche uniquement lors de la toute première ouverture de l'application
 * pour expliquer le concept à l'utilisateur.
 */
export default function Onboarding() {
  const [step, setStep] = useState(0); // Étape actuelle (0, 1 ou 2)
  const { completeOnboarding } = useData(); // Fonction pour marquer le tuto comme terminé

  // Données de chaque page d'accueil
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

  // Passer à l'étape suivante
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100dvh', overflow: 'hidden', backgroundColor: 'var(--color-bg-main)' }}>
      
      {/* En-tête / Logo */}
      <div style={{ padding: '2rem 1rem 1rem 1rem', width: '100%', textAlign: 'center' }}>
        <img src={logoUrl} alt="VoltIQ Logo" style={{ width: '130px', height: 'auto' }} />
      </div>
      
      {/* Zone de contenu central (Illustration + Texte) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', maxWidth: '400px', padding: '1rem', minHeight: 0 }}>
        {/* L'image s'adapte automatiquement sans déborder */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', minHeight: 0 }}>
          <img src={steps[step].img} alt={steps[step].title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
        
        {/* Titre et description de l'étape */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '900', textAlign: 'center' }}>{steps[step].title}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.5', textAlign: 'center' }}>
            {steps[step].desc}
          </p>
        </div>
      </div>

      {/* Zone d'action en bas (Indicateurs et Bouton) */}
      <div style={{ width: '100%', maxWidth: '400px', padding: '1rem 1rem 2rem 1rem' }}>
        {/* Points indicateurs de l'étape courante */}
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

        {/* Bouton d'action (Suivant ou Commencer) */}
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
