import { createContext, useContext, useState, useEffect } from 'react';
import { calculateAverageConsumption, calculateEstimatedDuration, calculateDepletionDate } from '../utils/calculations';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [recharges, setRecharges] = useState(() => {
    const saved = localStorage.getItem('voltiq_recharges');
    if (saved) {
      return JSON.parse(saved).map(r => ({ 
        ...r, 
        date: new Date(r.date),
        depletionDate: r.depletionDate ? new Date(r.depletionDate) : null
      }));
    }
    return [];
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('voltiq_onboarding_completed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('voltiq_recharges', JSON.stringify(recharges));
  }, [recharges]);

  const addRecharge = (amount, energy, date, remainingEnergy = 0) => {
    let previousRecharge = recharges.length > 0 ? recharges[0] : null;
    let averageConsumption = 0;
    const totalEnergy = energy + remainingEnergy;
    
    if (previousRecharge) {
      const daysElapsed = (date.getTime() - previousRecharge.date.getTime()) / (1000 * 3600 * 24);
      if (daysElapsed > 0) {
        const prevTotalEnergy = previousRecharge.totalEnergy || previousRecharge.energy;
        const consumedEnergy = Math.max(0, prevTotalEnergy - remainingEnergy);
        averageConsumption = calculateAverageConsumption(consumedEnergy, daysElapsed);
        
        // Update the previous recharge with actual observed duration
        setRecharges(prev => {
          const newRecharges = [...prev];
          newRecharges[0].actualDuration = daysElapsed;
          return newRecharges;
        });
      }
    }

    const estimatedDuration = averageConsumption > 0 ? calculateEstimatedDuration(totalEnergy, averageConsumption) : 0;
    const depletionDate = estimatedDuration > 0 ? calculateDepletionDate(date, estimatedDuration) : null;

    const newRecharge = {
      id: Date.now().toString(),
      amount,
      energy,
      remainingEnergy,
      totalEnergy,
      date,
      averageConsumption,
      estimatedDuration,
      depletionDate,
      actualDuration: null // will be filled when next recharge happens
    };

    setRecharges(prev => [newRecharge, ...prev]);
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
    <DataContext.Provider value={{ recharges, addRecharge, clearRecharges, currentRecharge, hasCompletedOnboarding, completeOnboarding }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
