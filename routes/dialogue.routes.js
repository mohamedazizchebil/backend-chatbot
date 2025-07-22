const express = require('express');
const router = express.Router();
const PageDialogue = require('../models/dialogue');
const Client = require('../models/client');
const authenticateToken = require('../middlewares/authenticateToken');




// POST /api/dialogue/add
router.post('/add',authenticateToken, async (req, res) => {
  const { pageType, dialogue } = req.body;

  if (!pageType || !Array.isArray(dialogue)) {
    return res.status(400).json({ error: 'pageType and dialogue are required.' });
  }

  if(dialogue.length === 0 ) {
    return res.status(400).json({ error: 'Dialogue cannot be empty.' });
  }

  




  try {
    const client = req.client; // Récupère le client authentifié depuis le middleware


    // Vérifie si config déjà existante pour ce client et pageType
    let config = await PageDialogue.findOne({ appid: client.appid, pageType });

    if (config) {
      config.dialogue = dialogue;
      await config.save();
    } else {

      config = new PageDialogue({

        appid: client.appid,
        pageType,
        dialogue

      });
      await config.save();
    }



    res.status(200).json({ message: 'Dialogue saved successfully.' });
  } catch (err) {
    res.status(400).json({ error: `Dialogues validation failed: ${err.message}` });
  }
});

router.get('/get/:pageType',authenticateToken, async (req, res) => {
  const { pageType } = req.params;
  try {
    const client = req.client; // Récupère le client authentifié depuis le middlewar
    // Vérifie si config existe pour ce appid et pageType
    const config = await PageDialogue.findOne({ appid:client.appid, pageType }).select('pageType dialogue');
   

    if (!config) {
      return res.status(404).json({ error: 'Dialogue configuration not found.' });
    }
    const dialogue = JSON.parse(JSON.stringify(config.dialogue, (key, value) => {
      if (key === '_id') return undefined;
      return value;
    }));
    res.status(200).json({ pageType: config.pageType, dialogue });
    
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/dialogue/delete
router.delete('/delete',authenticateToken, async (req, res) => {
  const  {pageType} = req.body;
  if (!pageType) {
    return res.status(400).json({ error: 'pageType is required.' });
  }

  try {
    // Vérifie le client
    const client = req.client; // Récupère le client authentifié depuis le middleware

    // Vérifie la page
    const page = await PageDialogue.findOne({ appid: client.appid, pageType });
    if (!page) {
      return res.status(404).json({ error: 'Page not found.' });
    }
    // Supprime la configuration de dialogue
    const result = await PageDialogue.deleteOne({ appid: client.appid, pageType });
    res.status(200).json({ message: 'Dialogue configuration deleted successfully.', result });
  }
  catch (err) {
    console.error('Error deleting dialogue:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/dialogue/getall
router.get('/getall', authenticateToken, async (req, res) => {
  try {
    const client = req.client;

    let dialogues = await PageDialogue.find({ appid: client.appid }).select('pageType dialogue');

    // Supprimer tous les _id imbriqués dans chaque dialogue (s'ils existent)
    dialogues = dialogues.map(item => {
      const cleanedDialogue = JSON.parse(JSON.stringify(item.dialogue, (key, value) => {
        if (key === '_id') return undefined;
        return value;
      }));
      return {
        pageType: item.pageType,
        dialogue: cleanedDialogue
      };
    });

    res.status(200).json({ dialogues });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});





module.exports = router;
