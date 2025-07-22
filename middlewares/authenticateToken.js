const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const Client = require('../models/client');


const authenticateToken = (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1]; // Récupère le token depuis l'en-tête Authorization

    if (!token) {
        return res.status(401).json({ error 
          : 'Aucun token fourni' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Token invalide' });
        }
        try {
          const client = await Client.findOne({appid:decoded.appid});

          if (!client) {
            return res.status(404).json({ error: 'Client non trouvé' });

          }

          
          req.client = client; // Ajoute le client à la requête pour une utilisation ultérieure

          next(); // Passe au middleware suivant ou à la route

        }
        catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    });
}
module.exports = authenticateToken;

