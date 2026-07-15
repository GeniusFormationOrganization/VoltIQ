# Présentation de VoltIQ ⚡

**VoltIQ** est une application web progressive (PWA) conçue pour aider les utilisateurs à suivre et optimiser leur consommation d'énergie (électricité). 
Grâce à un système d'historique de recharges et à un calcul intelligent de la consommation moyenne, l'application est capable de **prédire la date d'épuisement** de l'énergie restante et d'avertir l'utilisateur à l'avance.

---

## 🛠️ Stack Technique

- **Framework :** React 18 (avec Vite pour une compilation ultra-rapide).
- **Styling :** Tailwind CSS (utilitaire) pour un design moderne et responsive.
- **Icônes :** Lucide React.
- **Routage :** React Router v6.
- **PWA (Progressive Web App) :** `vite-plugin-pwa` pour permettre l'installation sur mobile (Android/iOS) et le fonctionnement hors-ligne via les Service Workers.
- **Hébergement :** Vercel (déploiement continu via GitHub).

---

## 📂 Architecture du Projet

L'application suit une structure classique et modulaire de React :

```text
src/
├── assets/          # Images, logos, fichiers statiques (SVG)
├── components/      # Composants réutilisables (Layout, ErrorBoundary, Onboarding)
├── context/         # Gestion de l'état global (DataContext)
├── pages/           # Pages de l'application (Dashboard, History, NewTopUp, Settings)
├── utils/           # Fonctions utilitaires et algorithmes (calculations.js)
├── App.jsx          # Composant racine, configuration du routage et des Providers
└── main.jsx         # Point d'entrée de React
```

---

## 🧠 Explications du Code : Les Coeurs de l'Application

### 1. Gestion des Données Globales (`DataContext.jsx`)
Plutôt que de faire passer les données de page en page (prop drilling), VoltIQ utilise l'API **Context** de React. Cela permet à n'importe quelle page d'accéder à la liste des recharges ou aux paramètres.

```javascript
// src/context/DataContext.jsx

// Initialisation de l'état en lisant le stockage local (localStorage)
const [recharges, setRecharges] = useState(() => {
  try {
    const saved = localStorage.getItem('voltiq_recharges');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reconversion des chaînes de texte ISO en véritables objets Date
      if (Array.isArray(parsed)) {
        return parsed.map(r => ({
          ...r,
          date: new Date(r.date),
          depletionDate: r.depletionDate ? new Date(r.depletionDate) : null
        }));
      }
    }
  } catch (e) {
    console.error("Erreur de parsing", e);
  }
  return initialData; // Données de démo au premier lancement
});

// Sauvegarde automatique dans le navigateur à chaque changement
useEffect(() => {
  localStorage.setItem('voltiq_recharges', JSON.stringify(recharges));
}, [recharges]);
```
> [!NOTE]
> Nous sauvegardons tout dans le `localStorage` du navigateur. Ainsi, même si l'utilisateur ferme l'application, ses données sont conservées localement, sans avoir besoin d'une base de données distante.

### 2. Le Moteur Mathématique (`utils/calculations.js`)
L'intelligence de VoltIQ réside dans sa capacité à calculer l'autonomie restante en se basant sur les habitudes de l'utilisateur.

```javascript
// src/utils/calculations.js

// 1. Calcul de la consommation moyenne par jour
export const calculateAverageConsumption = (energy, daysElapsed) => {
  if (daysElapsed <= 0) return 0;
  return Number((energy / daysElapsed).toFixed(2));
};

// 2. Estimation de la durée de vie (en jours) d'une nouvelle recharge
export const calculateEstimatedDuration = (energy, averageConsumption) => {
  if (averageConsumption <= 0) return 0;
  return Number((energy / averageConsumption).toFixed(1));
};

// 3. Calcul de la date exacte d'épuisement
export const calculateDepletionDate = (startDate, durationInDays) => {
  const date = new Date(startDate);
  // Ajoute la durée estimée à la date actuelle
  date.setTime(date.getTime() + (durationInDays * 24 * 60 * 60 * 1000));
  return date;
};
```
> [!TIP]
> Lors de l'ajout d'une **nouvelle** recharge, l'application regarde l'énergie qui avait été injectée lors de la **précédente** recharge et calcule combien de temps elle a duré. Cela donne la consommation moyenne exacte du foyer.

### 3. Le Système d'Alerte et de Notifications (`DataContext.jsx`)
VoltIQ prévient l'utilisateur lorsque son énergie arrive à épuisement (ex: à 7, 5, 3 ou 1 jours restants).

```javascript
// Détection des alertes dans le useEffect
useEffect(() => {
  if (!currentRecharge || !currentRecharge.depletionDate || !settings?.channels?.push) return;

  const today = new Date();
  const diffTime = currentRecharge.depletionDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Vérifie si on a franchi un seuil (ex: reste 3 jours)
  if (daysRemaining <= 3 && settings.reminders.r3) {
    const title = "VoltIQ - Alerte";
    const options = {
      body: `Attention, il ne reste qu'environ ${daysRemaining} jour(s) d'autonomie.`,
      icon: '/favicon.svg'
    };

    try {
      // Tente d'afficher une notification classique (Fonctionne sur PC)
      new Notification(title, options);
    } catch (e) {
      // Fallback PWA : Si le navigateur (Android) bloque le constructeur classique,
      // on utilise l'API Service Worker approuvée pour le mobile.
      if (navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, options);
        });
      }
    }
  }
}, [currentRecharge, settings]);
```
> [!IMPORTANT]  
> Le "Fallback PWA" en `try/catch` est une mécanique de sécurité essentielle. Sans cela, l'application planterait sur Android car les téléphones mobiles interdisent l'usage du constructeur classique `new Notification()` pour des raisons de sécurité liées au fonctionnement en arrière-plan.

### 4. Interactions Gestuelles (Swipe-to-Dismiss) sur le Dashboard
L'application propose des interactions de type "mobile-first", comme la possibilité de balayer une alerte pour la supprimer.

```javascript
// src/pages/Dashboard.jsx
const [touchStart, setTouchStart] = useState(null);
const [touchEnd, setTouchEnd] = useState(null);

// L'utilisateur pose son doigt
const onTouchStart = (e) => {
  setTouchEnd(null);
  setTouchStart(e.targetTouches[0].clientX); // Enregistre la position X
};

// L'utilisateur glisse son doigt
const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

// L'utilisateur retire son doigt
const onTouchEnd = () => {
  if (!touchStart || !touchEnd) return;
  const distance = touchStart - touchEnd;
  
  // Si le balayage dépasse 50 pixels (vers la gauche ou la droite)
  if (Math.abs(distance) > 50) {
    setIsAlertDismissed(true); // Ferme l'alerte
  }
};
```

---

## 🚀 La Dimension PWA (Progressive Web App)

Le fichier `vite.config.js` utilise le plugin `VitePWA`. C'est ce qui génère le fichier **manifest.webmanifest** et le **Service Worker** (`sw.js`).
Ces deux éléments permettent à l'application :
1. **D'être installable** sur l'écran d'accueil comme une vraie application native.
2. **De fonctionner sans internet** (en mettant en cache le code source, le HTML, CSS et JS).
3. **De gérer des API mobiles** comme l'envoi de notifications via le système du téléphone.

---

## 🎯 Conclusion
VoltIQ est une solution technique élégante, entièrement côté client (Client-side), sans base de données coûteuse. Elle tire parti de la puissance des appareils modernes (stockage local, service workers, notifications web) pour offrir une expérience mobile native tout en restant une application web accessible via une simple URL.
