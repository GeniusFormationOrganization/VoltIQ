import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

/**
 * Composant pour ajouter une nouvelle recharge.
 * Se déroule en deux étapes :
 * 1. Saisie des informations (montant, énergie, etc.)
 * 2. Affichage de l'estimation (durée de vie prévue) avant confirmation
 */
export default function NewTopUp() {
  const { addRecharge, currentRecharge } = useData();
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [amount, setAmount] = useState('');
  const [energy, setEnergy] = useState('');
  const [remainingEnergy, setRemainingEnergy] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Date du jour par défaut
  
  // État pour gérer l'étape actuelle (1: Formulaire, 2: Résultat estimation)
  const [step, setStep] = useState(1);
  // État pour stocker les résultats du calcul d'estimation
  const [estimation, setEstimation] = useState(null);

  // Fonction déclenchée lors de la soumission du formulaire (Étape 1)
  const handleCalculate = (e) => {
    e.preventDefault();
    if (!amount || !energy || !date) return; // Sécurité : on vérifie que les champs requis sont remplis

    // --- Logique de calcul de l'estimation ---
    let avgConsumption = 0;
    const remaining = Number(remainingEnergy) || 0;
    const addedEnergy = Number(energy);
    const totalNewEnergy = addedEnergy + remaining; // Énergie totale sur le compteur après recharge

    // S'il y a déjà eu une recharge précédente, on calcule la consommation moyenne
    if (currentRecharge) {
      const prevDate = currentRecharge.date;
      const curDate = new Date(date);
      // Calcul du nombre de jours écoulés depuis la dernière recharge
      const days = (curDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
      
      if (days > 0) {
        // L'énergie que l'utilisateur avait au total lors de la dernière recharge
        const prevTotalEnergy = currentRecharge.totalEnergy || currentRecharge.energy;
        // On soustrait ce qui reste aujourd'hui pour savoir ce qui a été consommé
        const consumedEnergy = Math.max(0, prevTotalEnergy - remaining);
        // On divise par le nombre de jours pour avoir la moyenne quotidienne
        avgConsumption = consumedEnergy / days;
      }
    }

    // Durée estimée = Nouvelle énergie totale / Consommation moyenne journalière
    const estDuration = avgConsumption > 0 ? totalNewEnergy / avgConsumption : 0;

    // On stocke les résultats pour l'étape 2
    setEstimation({
      avgConsumption,
      estDuration,
      energy: addedEnergy,
      remainingEnergy: remaining,
      totalEnergy: totalNewEnergy,
      amount: Number(amount),
      date: new Date(date)
    });
    
    // On passe à l'étape 2
    setStep(2);
  };

  // Fonction déclenchée lors de la confirmation finale (Étape 2)
  const handleSave = () => {
    addRecharge(Number(amount), Number(energy), new Date(date), Number(remainingEnergy) || 0);
    navigate('/'); // Redirection vers le tableau de bord
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Nouvelle recharge</h1>
      
      {/* ÉTAPE 1 : Le Formulaire */}
      {step === 1 ? (
        <form className="card" onSubmit={handleCalculate}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Saisissez les informations de votre ticket de recharge CIE pour estimer sa durée.
          </p>

          <div className="input-group">
            <label>Reste sur le compteur (kWh) <span style={{color: 'var(--color-text-muted)', fontWeight: 'normal', fontSize: '0.8rem'}}>- Optionnel</span></label>
            <input 
              type="number" 
              step="0.1" 
              value={remainingEnergy} 
              onChange={e => setRemainingEnergy(e.target.value)} 
              placeholder="Ex: 24"
            />
          </div>

          <div className="input-group">
            <label>Montant payé (FCFA)</label>
            <input 
              type="number" 
              required 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="Ex: 5000"
            />
          </div>

          <div className="input-group">
            <label>Énergie obtenue (kWh)</label>
            <input 
              type="number" 
              step="0.1" 
              required 
              value={energy} 
              onChange={e => setEnergy(e.target.value)} 
              placeholder="Ex: 72"
            />
          </div>

          <div className="input-group">
            <label>Date de la recharge</label>
            <input 
              type="date" 
              required 
              value={date} 
              onChange={e => setDate(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Enregistrer
          </button>
        </form>
      ) : (
        /* ÉTAPE 2 : Résultats de l'estimation */
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Résultat de l'estimation</h2>
          
          <div style={{ margin: '3rem 0' }}>
            {/* Si on a pu calculer une estimation (donc s'il y a un historique suffisant) */}
            {estimation.estDuration > 0 ? (
              <div style={{ width: 150, height: 150, borderRadius: '50%', border: '8px solid var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{estimation.estDuration.toFixed(1)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>jours</span>
              </div>
            ) : (
              // S'il s'agit de la toute première recharge, on ne peut rien estimer
              <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg-main)', borderRadius: '8px' }}>
                <p>Première recharge enregistrée.</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Les estimations seront disponibles lors de votre prochaine recharge.</p>
              </div>
            )}
          </div>

          {/* Détails supplémentaires du calcul */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem', textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Consommation moyenne</div>
              <div style={{ fontWeight: 'bold' }}>{estimation.avgConsumption > 0 ? `${estimation.avgConsumption.toFixed(2)} kWh/j` : 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Énergie Totale</div>
              <div style={{ fontWeight: 'bold' }}>{estimation.totalEnergy} kWh</div>
            </div>
          </div>

          {/* Boutons de navigation (Retour ou Valider) */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Modifier</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}
