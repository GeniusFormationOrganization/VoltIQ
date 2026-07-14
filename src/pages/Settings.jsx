import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2 } from 'lucide-react';

export default function Settings() {
  const { clearRecharges } = useData();
  const [reminders, setReminders] = useState({
    r7: false,
    r5: true,
    r3: true,
    r1: true
  });
  
  const [channels, setChannels] = useState({
    push: true,
    email: true,
    sms: false,
    whatsapp: false
  });

  return (
    <div style={{ maxWidth: '800px', paddingBottom: '2rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Seuils de notification</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Sélectionnez quand vous souhaitez être alerté avant l'épuisement augmentant de votre crédit.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { id: 'r7', label: '7 jours avant' },
            { id: 'r5', label: '5 jours avant' },
            { id: 'r3', label: '3 jours avant' },
            { id: 'r1', label: '1 jours avant' },
          ].map(setting => (
            <label key={setting.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                className="custom-checkbox"
                checked={reminders[setting.id]} 
                onChange={(e) => setReminders({...reminders, [setting.id]: e.target.checked})}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontWeight: 'bold' }}>{setting.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Canaux de notification</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Où est ce que vous recevez les rappels
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={channels.push} 
              onChange={(e) => setChannels({...channels, push: e.target.checked})}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontWeight: 'bold' }}>Navigateur (notification push)</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={channels.email} 
              onChange={(e) => setChannels({...channels, email: e.target.checked})}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontWeight: 'bold' }}>E-mail</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={channels.sms} 
              onChange={(e) => setChannels({...channels, sms: e.target.checked})}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontWeight: 'bold' }}>SMS</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={channels.whatsapp} 
              onChange={(e) => setChannels({...channels, whatsapp: e.target.checked})}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontWeight: 'bold' }}>Whatsapp</span>
          </label>
        </div>
      </div>

      <div className="card" style={{ border: '1px solid var(--color-error)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-error)' }}>Zone de danger</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          Cette action supprimera définitivement tout votre historique de recharges. Elle est irréversible.
        </p>
        <button 
          className="btn" 
          style={{ backgroundColor: '#FEE2E2', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}
          onClick={() => {
            if (window.confirm("Êtes-vous sûr de vouloir supprimer toute la base de données ?")) {
              clearRecharges();
              alert("Base de données effacée avec succès !");
            }
          }}
        >
          <Trash2 size={20} style={{ marginRight: '0.5rem' }} />
          Supprimer la base de données
        </button>
      </div>
    </div>
  );
}
