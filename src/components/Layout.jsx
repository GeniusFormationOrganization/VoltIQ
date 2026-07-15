import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Bell } from 'lucide-react';
import logoUrl from '../assets/logo voltiq.svg';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Mobile top bar */}
      <header className="mobile-header">
        <img src={logoUrl} alt="VoltIQ Logo" style={{ height: '32px', width: 'auto' }} />
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link 
          to="/" 
          className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <LayoutDashboard size={24} />
          <span>Tableau de bord</span>
        </Link>
        <Link 
          to="/history" 
          className={`bottom-nav-item ${location.pathname === '/history' ? 'active' : ''}`}
        >
          <History size={24} />
          <span>Historique</span>
        </Link>
        <Link 
          to="/settings" 
          className={`bottom-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <Bell size={24} />
          <span>Rappels</span>
        </Link>
      </nav>
    </div>
  );
}
