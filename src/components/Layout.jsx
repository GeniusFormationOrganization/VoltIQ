import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Bell, Plus } from 'lucide-react';
import logoUrl from '../assets/logo voltiq.svg';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Desktop Sidebar (hidden on mobile via CSS) */}
      <aside className="sidebar">
        <div className="logo-container" style={{ marginBottom: '3rem' }}>
          <img src={logoUrl} alt="VoltIQ Logo" style={{ height: '40px', width: 'auto' }} />
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <Link to="/" className={`sidebar-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Tableau de bord
          </Link>
          <Link to="/history" className={`sidebar-nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
            <History size={20} />
            Historique
          </Link>
          <Link to="/settings" className={`sidebar-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
            <Bell size={20} />
            Rappels
          </Link>
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
        {/* Mobile top bar (hidden on desktop via CSS) */}
        <header className="mobile-header">
          <img src={logoUrl} alt="VoltIQ Logo" style={{ height: '32px', width: 'auto' }} />
        </header>
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation (hidden on desktop via CSS) */}
      <nav className="bottom-nav">
        <Link 
          to="/" 
          className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <LayoutDashboard size={24} />
          {location.pathname === '/' && <span>Accueil</span>}
        </Link>
        <Link 
          to="/history" 
          className={`bottom-nav-item ${location.pathname === '/history' ? 'active' : ''}`}
        >
          <History size={24} />
          {location.pathname === '/history' && <span>Historique</span>}
        </Link>
        <Link 
          to="/settings" 
          className={`bottom-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <Bell size={24} />
          {location.pathname === '/settings' && <span>Rappels</span>}
        </Link>
      </nav>
    </div>
  );
}
