import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Importation des styles globaux de l'application

// Point d'entrée principal de l'application React
// C'est ici que l'application est "accrochée" à la page HTML (dans l'élément avec l'id "root")
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
