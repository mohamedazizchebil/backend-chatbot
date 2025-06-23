require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const chatRoutes = require('./routes/chat.routes');
const searchRoute = require('./routes/search.route');

const app = express();
const PORT = process.env.PORT || 3001;

// URI de connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS pour autoriser les appels depuis le frontend
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true // 🔑 Important pour autoriser les cookies de session
}));

// Middleware session
app.use(session({
    secret: process.env.SESSION_SECRET || 'votre_clé_secrète',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60*5, // ⏱️ Durée de vie de la session : 5 minutes
        httpOnly: true,
        secure: true 
    }
}));

// Route de test
app.get('/', (req, res) => {
    res.send('API Chatbot Backend Fonctionne !');
});

app.use('/api/search', searchRoute); // Route de recherche

// Routes du chatbot
app.use('/api/chat', chatRoutes);

// Connexion MongoDB + lancement serveur
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connecté à MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('❌ Erreur de connexion à MongoDB:', err));
