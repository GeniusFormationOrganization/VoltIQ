import React, { useState } from 'react';
import logo from '../assets/logo voltiq.svg';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && code === '1234') {
      setError('');
      onLogin();
    } else {
      setError('Code incorrect. Veuillez réessayer.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--color-bg-main)'
    }}>
      
      {/* Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <img src={logo} alt="VoltIQ Logo" style={{ height: '40px' }} />
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connexion</h2>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Accédez à votre suivi VoltIQ
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="input-group">
          <label>Adresse</label>
          <input
            type="email"
            required
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group" style={{ marginBottom: '2rem' }}>
          <label>Code</label>
          <input
            type="password"
            required
            placeholder="••••"
            maxLength="4"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ color: 'var(--color-error)', textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Continuer
        </button>
      </form>
      
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
        Hint: Le code d'accès est 1234
      </p>
    </div>
  );
};

export default Login;
