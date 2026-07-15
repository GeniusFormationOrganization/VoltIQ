import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

export default function NewTopUp() {
  const { recharges, addRecharge, currentRecharge } = useData();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [energy, setEnergy] = useState('');
  const [remainingEnergy, setRemainingEnergy] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [step, setStep] = useState(1);
  const [estimation, setEstimation] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!amount || !energy || !date) return;

    // Simulate calculate API / Logic
    let avgConsumption = 0;
    const remaining = Number(remainingEnergy) || 0;
    const addedEnergy = Number(energy);
    const totalNewEnergy = addedEnergy + remaining;

    if (currentRecharge) {
      const prevDate = currentRecharge.date;
      const curDate = new Date(date);
      const days = (curDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
      if (days > 0) {
        const prevTotalEnergy = currentRecharge.totalEnergy || currentRecharge.energy;
        const consumedEnergy = Math.max(0, prevTotalEnergy - remaining);
        avgConsumption = consumedEnergy / days;
      }
    }

    const estDuration = avgConsumption > 0 ? totalNewEnergy / avgConsumption : 0;

    setEstimation({
      avgConsumption,
      estDuration,
      energy: addedEnergy,
      remainingEnergy: remaining,
      totalEnergy: totalNewEnergy,
      amount: Number(amount),
      date: new Date(date)
    });
    setStep(2);
  };

  const handleSave = () => {
    addRecharge(Number(amount), Number(energy), new Date(date), Number(remainingEnergy) || 0);
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Nouvelle recharge</h1>
      
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
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Résultat de l'estimation</h2>
          
          <div style={{ margin: '3rem 0' }}>
            {estimation.estDuration > 0 ? (
              <div style={{ width: 150, height: 150, borderRadius: '50%', border: '8px solid var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{estimation.estDuration.toFixed(1)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>jours</span>
              </div>
            ) : (
              <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg-main)', borderRadius: '8px' }}>
                <p>Première recharge enregistrée.</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Les estimations seront disponibles lors de votre prochaine recharge.</p>
              </div>
            )}
          </div>

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

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Modifier</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}
