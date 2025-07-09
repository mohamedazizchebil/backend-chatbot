require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chat.routes');
const searchRoute = require('./routes/search.route');
const similairRoute = require('./routes/similair.route');

const app = express();
const PORT = process.env.PORT || 3001;

// URI de connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS pour autoriser les appels depuis le frontend
/*const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    process.env.FRONTEND_URL // dans ton fichier .env
];*/

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    credentials: true
}));



// Route de test
app.get('/', (req, res) => {
    res.send('API Chatbot Backend Fonctionne !');
});

app.use('/api/search', searchRoute); // Route de recherche

// Routes du chatbot
app.use('/api/chat', chatRoutes);

app.use('/api/similair', similairRoute); // Route de similarité

// Connexion MongoDB + lancement serveur
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connecté à MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('❌ Erreur de connexion à MongoDB:', err));
