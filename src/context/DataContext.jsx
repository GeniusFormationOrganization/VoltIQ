import { createContext, useContext, useState, useEffect } from 'react';
import { calculateAverageConsumption, calculateEstimatedDuration, calculateDepletionDate } from '../utils/calculations';

const DataContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'https://voltiq-v9lf.onrender.com/api';

export function DataProvider({ children }) {
  const [recharges, setRecharges] = useState([]);
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('voltiq_authenticated') === 'true';
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('voltiq_onboarding_completed') === 'true';
  });

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('voltiq_authenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('voltiq_authenticated');
  };

  // Fetch recharges from backend
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${API_URL}/recharges`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Convert string dates to Date objects
            const parsedData = data.map(r => ({
              ...r,
              date: new Date(r.date),
              depletionDate: r.depletionDate ? new Date(r.depletionDate) : null
            }));
            setRecharges(parsedData);
          }
        })
        .catch(err => console.error("Erreur chargement recharges:", err));
    }
  }, [isAuthenticated]);

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
      amount,
      energy,
      remainingEnergy,
      totalEnergy,
      date: date.toISOString(),
      averageConsumption,
      estimatedDuration,
      depletionDate: depletionDate ? depletionDate.toISOString() : null,
      actualDuration
    };

    try {
      const response = await fetch(`${API_URL}/recharges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecharge)
      });
      if (response.ok) {
        const savedRecharge = await response.json();
        const parsedRecharge = {
          ...savedRecharge,
          date: new Date(savedRecharge.date),
          depletionDate: savedRecharge.depletionDate ? new Date(savedRecharge.depletionDate) : null
        };
        
        // Mettre à jour la durée de la précédente si nécessaire
        let newRechargesList = [parsedRecharge, ...recharges];
        if (previousRecharge && actualDuration !== null) {
          newRechargesList[1] = { ...newRechargesList[1], actualDuration };
        }
        setRecharges(newRechargesList);
        return parsedRecharge;
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la recharge:", error);
    }
    return null;
  };

  const clearRecharges = () => {
    setRecharges([]);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('voltiq_onboarding_completed');
    logout();
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
      completeOnboarding,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
