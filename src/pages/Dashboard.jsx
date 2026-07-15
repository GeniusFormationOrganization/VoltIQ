import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const { recharges, currentRecharge } = useData();

  // Calculate days remaining
  let daysRemaining = 0;
  let isAlert = false;
  let percentRemaining = 0;
  
  if (currentRecharge && currentRecharge.depletionDate) {
    const today = new Date();
    const diffTime = currentRecharge.depletionDate.getTime() - today.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    if (daysRemaining <= 3) isAlert = true;
    
    if (currentRecharge.estimatedDuration) {
      percentRemaining = Math.max(0, Math.min(1, daysRemaining / currentRecharge.estimatedDuration));
    } else {
      percentRemaining = daysRemaining > 0 ? 1 : 0;
    }
  }

  // Calculate segments (7 total)
  const litSegments = Math.max(0, Math.min(7, Math.ceil(percentRemaining * 7)));
  const progressColors = ['#FF0000', '#FF8C00', '#FFD700', '#CCFF00', '#10B981', '#10B981', '#10B981'];

  // Calculate chart data from history (last 9 recharges max)
  let historyData = recharges.slice(0, 9).map(r => r.averageConsumption > 0 ? r.averageConsumption : r.energy).reverse();
  // If we don't have 9 items, pad with zeros at the beginning
  while (historyData.length < 9) {
    historyData.unshift(0);
  }
  const maxHistory = Math.max(...historyData, 1); // Avoid div by zero
  const chartHeights = historyData.map(val => (val / maxHistory) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
      {/* Alert banner if needed */}
      {isAlert && (
        <div className="card" style={{ backgroundColor: 'var(--color-warning)', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>⚠️</div>
          <div>
            <strong>Alerte : </strong>
            Votre crédit arrive à épuisement dans {daysRemaining} jours. Pensez à recharger !
          </div>
        </div>
      )}

      {/* Durée restante Card */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Carte restante</h2>
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

      {/* Consommation moyenne Card */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Consommation moyenne</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px', paddingTop: '10px' }}>
          {chartHeights.map((height, i) => (
            <div key={i} style={{ flex: 1, height: `${height}%`, backgroundColor: 'var(--color-primary)', borderRadius: '4px 4px 0 0' }}></div>
          ))}
        </div>
      </div>

      {/* Dernière recharge Card */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Dernière recharge</h2>
        <div style={{ color: 'var(--color-primary)', fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          {currentRecharge?.amount || 0} FCFA
        </div>
        
        {/* Nouvelle Recharge Button */}
        <Link to="/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
          <PlusCircle size={20} /> Nouvelle Recharge
        </Link>
      </div>
    </div>
  );
}
