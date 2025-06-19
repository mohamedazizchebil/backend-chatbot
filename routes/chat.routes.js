// chatbot-backend/routes/chat.routes.js

const express = require('express');
const router = express.Router();
const PageDialogue = require('../models/dialogue'); // Importez votre modèle Mongoose

// POST /api/chat/init
// Cette route renvoie TOUTE la configuration du dialogue pour le pageType demandé.
// Le frontend gérera ensuite la navigation dans cette structure.
router.post('/init', async (req, res) => {
    const { appId, pageType, pageSpecificData } = req.body;
    // Le sessionId peut être généré et passé au frontend pour persistance locale
    if(!req.session.sessionId){
        req.session.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        req.session.createdAt = new Date();

    }

    try {
        // Tenter de trouver la configuration de dialogue spécifique au pageType
        let config = await PageDialogue.findOne({ pageType });

        // Si aucune configuration spécifique n'est trouvée, chercher le dialogue de fallback général
        if (!config || !config.dialogue || config.dialogue.length === 0) {
            config = await PageDialogue.findOne({ pageType: 'general_fallback' });
            if (!config || !config.dialogue || config.dialogue.length === 0) {
                // Fallback ultime si même 'general_fallback' n'est pas trouvé
                return res.status(200).json({
                    sessionId: req.session.sessionId,
                    initialDialogueConfig: null, // Indique au frontend qu'aucune config n'est disponible
                    errorMessage: "Désolé, l'assistant est temporairement indisponible. Aucune configuration de dialogue n'a pu être chargée."
                });
            }
        }

        // Renvoie la configuration complète du dialogue (y compris toutes les étapes imbriquées)
        // .toObject() est important pour obtenir un objet JavaScript pur, sans les méthodes Mongoose.
        res.status(200).json({
            sessionId: req.session.sessionId,
            initialDialogueConfig: config.toObject()
        });

    } catch (error) {
        console.error('Erreur lors de l\'initialisation du chat depuis DB:', error);
        res.status(500).json({ message: 'Erreur interne du serveur lors de l\'initialisation.', error: error.message });
    }
});
router.post('/check-session', (req, res) => {
  if (!req.session || !req.session.sessionId) {
    return res.status(401).json({ error: 'SESSION_EXPIRED' });
  }

  return res.json({ valid: true, sessionId: req.session.sessionId });
});



module.exports = router;