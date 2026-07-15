import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { DataProvider } from './context/DataContext';

// Pages
import Dashboard from './pages/Dashboard';
import NewTopUp from './pages/NewTopUp';
import History from './pages/History';
import Settings from './pages/Settings';

import Onboarding from './components/Onboarding';
import { useData } from './context/DataContext';

function AppContent() {
  const { hasCompletedOnboarding } = useData();

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="new" element={<NewTopUp />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

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
