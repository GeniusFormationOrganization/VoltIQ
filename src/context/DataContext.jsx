import { createContext, useContext, useState, useEffect } from 'react';
import { calculateAverageConsumption, calculateEstimatedDuration, calculateDepletionDate } from '../utils/calculations';

const DataContext = createContext();

export function DataProvider({ children }) {
  // Initialize state from localStorage
  const [recharges, setRecharges] = useState(() => {
    const saved = localStorage.getItem('voltiq_recharges');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
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

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('voltiq_onboarding_completed') === 'true';
  });

  // Save to localStorage whenever recharges changes
  useEffect(() => {
    localStorage.setItem('voltiq_recharges', JSON.stringify(recharges));
  }, [recharges]);

  const addRecharge = async (amount, energy, date, remainingEnergy = 0) => {
    let previousRecharge = recharges.length > 0 ? recharges[0] : null;
    let averageConsumption = 0;
    const totalEnergy = energy + remainingEnergy;
    
    let actualDuration = null;

    if (previousRecharge) {
      const daysElapsed = (date.getTime() - new Date(previousRecharge.date).getTime()) / (1000 * 3600 * 24);
      if (daysElapsed > 0) {
        const prevTotalEnergy = previousRecharge.totalEnergy || previousRecharge.energy;
        const consumedEnergy = Math.max(0, prevTotalEnergy - remainingEnergy);
        averageConsumption = calculateAverageConsumption(consumedEnergy, daysElapsed);
        actualDuration = daysElapsed;
      }
    }

    const estimatedDuration = averageConsumption > 0 ? calculateEstimatedDuration(totalEnergy, averageConsumption) : 0;
    const depletionDate = estimatedDuration > 0 ? calculateDepletionDate(date, estimatedDuration) : null;

    const newRecharge = {
      id: Date.now().toString(), // Generate a local ID
      amount,
      energy,
      remainingEnergy,
      totalEnergy,
      date, // Keep as Date object in state
      averageConsumption,
      estimatedDuration,
      depletionDate,
      actualDuration
    };

    let newRechargesList = [newRecharge, ...recharges];
    if (previousRecharge && actualDuration !== null) {
      newRechargesList[1] = { ...newRechargesList[1], actualDuration };
    }
    setRecharges(newRechargesList);
    
    return newRecharge;
  };

  const clearRecharges = () => {
    setRecharges([]);
    localStorage.removeItem('voltiq_recharges');
    
    setHasCompletedOnboarding(false);
    localStorage.removeItem('voltiq_onboarding_completed');
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('voltiq_onboarding_completed', 'true');
  };

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

export function useData() {
  return useContext(DataContext);
}
