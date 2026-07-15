import { createContext, useContext, useState, useEffect } from 'react';
import { calculateAverageConsumption, calculateEstimatedDuration, calculateDepletionDate } from '../utils/calculations';

// Création du contexte pour partager les données dans toute l'application
const DataContext = createContext();

export function DataProvider({ children }) {
  // Initialisation de l'état des recharges depuis le localStorage
  const [recharges, setRecharges] = useState(() => {
    const saved = localStorage.getItem('voltiq_recharges');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reconvertir les chaînes de caractères de dates en objets Date
        return parsed.map(r => ({
          ...r,
          date: new Date(r.date),
          depletionDate: r.depletionDate ? new Date(r.depletionDate) : null
        }));
      } catch (e) {
        console.error("Erreur de parsing des données locales", e);
        return [];
      }
    }
    return [];
  });

  // Vérifier si l'utilisateur a déjà terminé le tutoriel d'accueil (Onboarding)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('voltiq_onboarding_completed') === 'true';
  });

  // Sauvegarder automatiquement les recharges dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('voltiq_recharges', JSON.stringify(recharges));
  }, [recharges]);

  /**
   * Ajoute une nouvelle recharge et calcule l'estimation de consommation.
   */
  const addRecharge = async (amount, energy, date, remainingEnergy = 0) => {
    let previousRecharge = recharges.length > 0 ? recharges[0] : null;
    let averageConsumption = 0;
    const totalEnergy = energy + remainingEnergy; // Énergie totale disponible (nouvelle + reste)
    
    let actualDuration = null;

    // S'il y a une recharge précédente, calculer la consommation moyenne
    if (previousRecharge) {
      const daysElapsed = (date.getTime() - new Date(previousRecharge.date).getTime()) / (1000 * 3600 * 24);
      if (daysElapsed > 0) {
        // L'énergie totale de l'ancienne recharge moins ce qu'il en reste aujourd'hui
        const prevTotalEnergy = previousRecharge.totalEnergy || previousRecharge.energy;
        const consumedEnergy = Math.max(0, prevTotalEnergy - remainingEnergy);
        averageConsumption = calculateAverageConsumption(consumedEnergy, daysElapsed);
        actualDuration = daysElapsed;
      }
    }

    // Calculer la durée de vie estimée et la date d'épuisement
    const estimatedDuration = averageConsumption > 0 ? calculateEstimatedDuration(totalEnergy, averageConsumption) : 0;
    const depletionDate = estimatedDuration > 0 ? calculateDepletionDate(date, estimatedDuration) : null;

    // Créer le nouvel objet recharge
    const newRecharge = {
      id: Date.now().toString(), // Générer un ID local unique
      amount,
      energy,
      remainingEnergy,
      totalEnergy,
      date, // Garder comme objet Date dans l'état
      averageConsumption,
      estimatedDuration,
      depletionDate,
      actualDuration
    };

    // Mettre à jour la liste des recharges
    let newRechargesList = [newRecharge, ...recharges];
    
    // Mettre à jour l'ancienne recharge avec la durée réelle constatée
    if (previousRecharge && actualDuration !== null) {
      newRechargesList[1] = { ...newRechargesList[1], actualDuration };
    }
    
    setRecharges(newRechargesList);
    
    return newRecharge;
  };

  /**
   * Efface toutes les données de l'application (Reset)
   */
  const clearRecharges = () => {
    setRecharges([]);
    localStorage.removeItem('voltiq_recharges');
    
    setHasCompletedOnboarding(false);
    localStorage.removeItem('voltiq_onboarding_completed');
  };

  /**
   * Marque l'onboarding comme terminé
   */
  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('voltiq_onboarding_completed', 'true');
  };

  // Récupérer la recharge la plus récente
  const currentRecharge = recharges.length > 0 ? recharges[0] : null;

  return (
    <DataContext.Provider value={{ 
      recharges, 
      addRecharge, 
      clearRecharges, 
      currentRecharge, 
      hasCompletedOnboarding, 
      completeOnboarding
    }}>
      {children}
    </DataContext.Provider>
  );
}

// Hook personnalisé pour utiliser les données plus facilement dans les composants
export function useData() {
  return useContext(DataContext);
}
