const express = require('express');
const router = express.Router();
const PageDialogue = require('../models/dialogue');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_ultra_secrète';

// 🔐 Fonction pour générer un token
function generateToken(sessionId) {
    return jwt.sign({ sessionId }, JWT_SECRET, { expiresIn: '5m' }); // 5 minutes de validité
}

// 🔐 Fonction pour vérifier un token
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}



// POST /api/chat/init
router.post('/init', async (req, res) => {
    const { appId, pageType } = req.body;

    try {
        let config = await PageDialogue.findOne({ pageType });

        if (!config || !config.dialogue || config.dialogue.length === 0) {
            config = await PageDialogue.findOne({ pageType: 'general_fallback' });
            if (!config || !config.dialogue || config.dialogue.length === 0) {
                return res.status(200).json({
                    token: null,
                    initialDialogueConfig: null,
                    errorMessage: "Désolé, l'assistant est temporairement indisponible. Aucune configuration de dialogue n'a pu être chargée."
                });
            }
        }

        // Générer un ID de session aléatoire
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const token = generateToken(sessionId);

        res.status(200).json({
            token,
            initialDialogueConfig: config.toObject()
        });

    } catch (error) {
        console.error('Erreur lors de l\'initialisation du chat depuis DB:', error);
        res.status(500).json({ message: 'Erreur interne du serveur lors de l\'initialisation.', error: error.message });
    }
});

// POST /api/chat/check-session
router.post('/check-session', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'TOKEN_MISSING' });
    }

    try {
        const decoded = verifyToken(token);
        return res.status(200).json({ valid: true, sessionId: decoded.sessionId });
    } catch (err) {
        return res.status(401).json({ error: 'TOKEN_INVALID_OR_EXPIRED' });
    }
});

module.exports = router;
