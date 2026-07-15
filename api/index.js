import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import loginHandler from './auth/login.js';
import registerHandler from './auth/register.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === 1. CONNEXION MONGODB ===
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connecté à MongoDB'))
        .catch(err => console.error('Erreur MongoDB :', err));
} else {
    console.log('⚠️ MONGODB_URI manquant');
}

// === 2. MODÈLE DE BASE DE DONNÉES ===
const RechargeSchema = new mongoose.Schema({
    amount: Number,
    energy: Number,
    remainingEnergy: Number,
    date: Date,
    estimatedDuration: Number
});
const Recharge = mongoose.models.Recharge || mongoose.model('Recharge', RechargeSchema);

// === 3. ROUTES (API) ===
app.get('/api/recharges', async (req, res) => {
    try {
        const recharges = await Recharge.find().sort({ date: -1 });
        res.json(recharges);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post('/api/recharges', async (req, res) => {
    try {
        const newRecharge = new Recharge(req.body);
        await newRecharge.save();
        res.status(201).json(newRecharge);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout" });
    }
});

// Auth Routes (Adaptation des handlers Vercel pour Express)
app.all('/api/auth/login', async (req, res) => {
    await loginHandler(req, res);
});

app.all('/api/auth/register', async (req, res) => {
    await registerHandler(req, res);
});

// === 4. LANCEMENT DU SERVEUR ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

export default app;
