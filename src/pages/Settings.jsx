import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2 } from 'lucide-react';

/**
 * Composant Paramètres/Rappels (Settings).
 * Permet de configurer les préférences de notification et de réinitialiser l'application.
 */
export default function Settings() {
  const { clearRecharges, settings, setSettings } = useData();

  return (
    <div style={{ maxWidth: '800px', paddingBottom: '2rem' }}>
      
      {/* Section : Configuration des jours de rappel */}
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
                checked={settings.reminders[setting.id]} 
                onChange={(e) => setSettings({
                  ...settings,
                  reminders: {
                    ...settings.reminders,
                    [setting.id]: e.target.checked
                  }
                })}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontWeight: 'bold' }}>{setting.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section : Configuration des canaux de rappel */}
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
              checked={settings.channels.push} 
              onChange={async (e) => {
                const checked = e.target.checked;
                if (checked) {
                  if (!("Notification" in window)) {
                    alert("Ce navigateur ne supporte pas les notifications de bureau.");
                    return;
                  }
                  const permission = await Notification.requestPermission();
                  if (permission === "granted") {
                    setSettings({ ...settings, channels: { ...settings.channels, push: true } });
                    new Notification("VoltIQ", { body: "Les notifications sont activées !", icon: "/favicon.svg" });
                  } else {
                    alert("Vous avez refusé l'autorisation pour les notifications.");
                    setSettings({ ...settings, channels: { ...settings.channels, push: false } });
                  }
                } else {
                  setSettings({ ...settings, channels: { ...settings.channels, push: false } });
                }
              }}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontWeight: 'bold' }}>Navigateur (notification push)</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', opacity: 0.5 }}>
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={settings.channels.email} 
              onChange={(e) => setSettings({...settings, channels: { ...settings.channels, email: e.target.checked }})}
              style={{ marginRight: '0.75rem' }}
              disabled
            />
            <span style={{ fontWeight: 'bold' }}>E-mail (bientôt)</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', opacity: 0.5 }}>
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={settings.channels.sms} 
              onChange={(e) => setSettings({...settings, channels: { ...settings.channels, sms: e.target.checked }})}
              style={{ marginRight: '0.75rem' }}
              disabled
            />
            <span style={{ fontWeight: 'bold' }}>SMS (bientôt)</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', opacity: 0.5 }}>
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={settings.channels.whatsapp} 
              onChange={(e) => setSettings({...settings, channels: { ...settings.channels, whatsapp: e.target.checked }})}
              style={{ marginRight: '0.75rem' }}
              disabled
            />
            <span style={{ fontWeight: 'bold' }}>Whatsapp (bientôt)</span>
          </label>
        </div>
      </div>

      {/* Section : Effacer les données (Danger Zone) */}
      <div className="card" style={{ border: '1px solid var(--color-error)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-error)' }}>Zone de danger</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          Cette action supprimera définitivement tout votre historique de recharges. Elle est irréversible.
        </p>
        <button 
          className="btn" 
          style={{ backgroundColor: '#FEE2E2', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}
          onClick={() => {
            // Demande de confirmation avant de tout effacer
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
