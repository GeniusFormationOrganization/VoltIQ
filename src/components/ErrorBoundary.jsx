import React from 'react';
import errorImg from '../assets/404 Not Found.svg';

/**
 * Composant de type "Frontière d'erreur" (Error Boundary).
 * Il capture les erreurs JavaScript qui se produisent dans ses composants enfants
 * et affiche une interface de secours au lieu de faire planter toute l'application.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Met à jour l'état pour afficher l'interface de secours au prochain rendu
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Permet de capturer l'erreur pour pouvoir l'envoyer à un service de reporting si besoin
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary a capturé une erreur :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Affichage de secours en cas d'erreur
      return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <img src={errorImg} alt="Erreur" style={{ width: '200px', maxWidth: '100%' }} />
            </div>
            <h2 style={{ color: 'var(--color-error)' }}>Oups, une erreur est survenue</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Nous sommes désolés, mais quelque chose s'est mal passé.
            </p>
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'left', overflowX: 'auto' }}>
              <strong>Erreur :</strong> {this.state.error && this.state.error.toString()}
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    // Si tout va bien, on affiche les enfants normalement
    return this.props.children;
  }
}

export default ErrorBoundary;
