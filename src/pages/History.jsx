import React from 'react';
import { useData } from '../context/DataContext';
import rienImg from '../assets/rien.svg';

/**
 * Composant Historique.
 * Affiche la liste complète de toutes les recharges effectuées par l'utilisateur
 * sous forme de tableau.
 */
export default function History() {
  const { recharges } = useData();

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Historique des recharges</h2>
        
        {/* Affichage d'un message si l'historique est vide */}
        {recharges.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
            <img src={rienImg} alt="Aucune donnée" style={{ width: '200px', maxWidth: '100%', marginBottom: '1.5rem', opacity: 0.8 }} />
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Aucune recharge enregistrée pour le moment.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Date</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Montant (FCFA)</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Énergie (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {/* Boucle sur toutes les recharges pour créer une ligne par recharge */}
                {recharges.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{r.date.toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{r.amount}</td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{r.energy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
