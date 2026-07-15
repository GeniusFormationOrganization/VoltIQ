import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import logoUrl from '../assets/logo voltiq.svg';

/**
 * Composant de mise en page principal (Layout).
 * Il s'occupe d'afficher la barre du haut (logo) et la barre de navigation en bas.
 * Le contenu spécifique de chaque page s'affiche au niveau de la balise <Outlet />.
 */
export default function Layout() {
  const location = useLocation(); // Permet de savoir sur quelle page on se trouve actuellement

  return (
    <div className="app-container">
      {/* En-tête mobile avec le logo de l'application */}
      <header className="mobile-header">
        <img src={logoUrl} alt="VoltIQ Logo" style={{ height: '32px', width: 'auto' }} />
      </header>
      
      {/* Contenu principal de la page courante (Dashboard, Historique, etc.) */}
      <main className="main-content">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>

      {/* Barre de navigation collée en bas de l'écran */}
      <nav className="bottom-nav">
        {/* Lien vers le tableau de bord (Accueil) */}
        <Link 
          to="/" 
          className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={location.pathname === '/' ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <LayoutDashboard size={24} />
          </motion.div>
          <span>Tableau de bord</span>
        </Link>

        {/* Lien vers l'historique des recharges */}
        <Link 
          to="/history" 
          className={`bottom-nav-item ${location.pathname === '/history' ? 'active' : ''}`}
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={location.pathname === '/history' ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <History size={24} />
          </motion.div>
          <span>Historique</span>
        </Link>

        {/* Lien vers les paramètres/rappels */}
        <Link 
          to="/settings" 
          className={`bottom-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <motion.div
            whileTap={{ scale: 0.8, rotate: -15 }}
            animate={location.pathname === '/settings' ? { y: -2, scale: 1.1, rotate: [0, -10, 10, -10, 10, 0] } : { y: 0, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Bell size={24} />
          </motion.div>
          <span>Rappels</span>
        </Link>
      </nav>
    </div>
  );
}
