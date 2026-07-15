import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { PlusCircle, X } from 'lucide-react';

/**
 * Composant Tableau de bord (Accueil).
 * Affiche l'état actuel du compteur (jours restants), la consommation moyenne,
 * et le bouton pour ajouter une nouvelle recharge.
 */
export default function Dashboard() {
  const { recharges, currentRecharge } = useData();
  const [isAlertDismissed, setIsAlertDismissed] = React.useState(false);

  // --- Gestion du swipe pour fermer l'alerte ---
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    // Si on a balayé de plus de 50px (gauche ou droite), on ferme
    if (Math.abs(distance) > 50) {
      setIsAlertDismissed(true);
    }
  };

  // --- Calcul des jours restants et de la barre de progression ---
  let daysRemaining = 0;
  let isAlert = false;

  if (currentRecharge && currentRecharge.depletionDate) {
    const today = new Date();
    // Différence entre la date estimée de fin et aujourd'hui
    const diffTime = currentRecharge.depletionDate.getTime() - today.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Déclenche une alerte s'il reste 3 jours ou moins
    if (daysRemaining <= 3) isAlert = true;
  }

  // --- Configuration de la barre de progression (7 segments) ---
  let litSegments = 0;
  if (daysRemaining > 0) {
    if (daysRemaining <= 2) litSegments = 1;
    else if (daysRemaining <= 5) litSegments = 2;
    else if (daysRemaining <= 9) litSegments = 3;
    else if (daysRemaining <= 14) litSegments = 4;
    else if (daysRemaining <= 20) litSegments = 5;
    else if (daysRemaining <= 27) litSegments = 6;
    else litSegments = 7;
  }
  // Couleurs allant du rouge (vide) au vert (plein)
  const progressColors = ['#FF0000', '#FF8C00', '#FFD700', '#CCFF00', '#10B981', '#10B981', '#10B981'];



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>

      {/* Bannière d'alerte rouge si le crédit est presque épuisé */}
      {isAlert && !isAlertDismissed && (
        <div 
          className="card" 
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ 
            backgroundColor: 'var(--color-warning)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden',
            transition: 'opacity 0.3s ease'
          }}
        >
          <div>⚠️</div>
          <div style={{ flex: 1, paddingRight: '20px' }}>
            <strong>Alerte : </strong>
            Votre crédit arrive à épuisement dans {daysRemaining} jours. Pensez à recharger !
          </div>
          <button 
            onClick={() => setIsAlertDismissed(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.5rem'
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Carte affichant la durée de vie restante (Barre de batterie) */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Autonomie estimée</h2>
        <div style={{ display: 'flex', gap: '4px', height: '24px', marginBottom: '0.5rem' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: i < litSegments ? progressColors[i] : '#E5E7EB',
                borderRadius: '4px'
              }}
            ></div>
          ))}
        </div>
        <div style={{ textAlign: 'right', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.875rem' }}>
          {daysRemaining > 0 ? `${daysRemaining} jours` : 'Épuisé'}
        </div>
      </div>


      {/* Carte affichant le montant de la dernière recharge et le bouton d'ajout */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Dernière recharge</h2>
        <div style={{ color: 'var(--color-primary)', fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          {currentRecharge?.amount || 0} FCFA
        </div>

        {/* Bouton pour ajouter une nouvelle recharge (redirige vers /new) */}
        <Link to="/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
          <PlusCircle size={20} /> Nouvelle Recharge
        </Link>
      </div>
    </div>
  );
}
