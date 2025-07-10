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



app.use(cors({
    origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
