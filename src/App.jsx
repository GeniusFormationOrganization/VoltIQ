import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { DataProvider } from './context/DataContext';

// Importation des différentes pages de l'application
import Dashboard from './pages/Dashboard';
import NewTopUp from './pages/NewTopUp';
import History from './pages/History';
import Settings from './pages/Settings';

import Onboarding from './components/Onboarding';
import { useData } from './context/DataContext';

/**
 * Composant qui gère la navigation (le routage) interne de l'application.
 * Il vérifie d'abord si l'utilisateur a terminé l'onboarding.
 */
function AppContent() {
  const { hasCompletedOnboarding } = useData();

  // Si c'est la première visite, on affiche l'écran de bienvenue
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  // Sinon, on affiche les routes normales de l'application
  return (
    <Routes>
      {/* Toutes ces routes partagent la même mise en page (Layout) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} /> {/* Page d'accueil */}
        <Route path="new" element={<NewTopUp />} /> {/* Nouvelle recharge */}
        <Route path="history" element={<History />} /> {/* Historique */}
        <Route path="settings" element={<Settings />} /> {/* Paramètres */}
      </Route>
    </Routes>
  );
}

/**
 * Composant racine de l'application.
 * Enveloppe l'application avec les fournisseurs (Providers) nécessaires :
 * - ErrorBoundary : pour capturer les erreurs inattendues
 * - DataProvider : pour rendre les données (historique, paramètres) accessibles partout
 * - BrowserRouter : pour gérer la navigation entre les pages
 */
function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;
