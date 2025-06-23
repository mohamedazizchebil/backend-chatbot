const express = require('express');
const router = express.Router();
const {askGemini} = require('../lib/gemini');



router.post('/', async (req, res) => {
 const { nom, description } = req.body;


  if (!nom && !description) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const query = `
Génère uniquement une requête Elasticsearch au format JSON brut, contenant obligatoirement les clés "query", "match" et "size". 
La requête doit rechercher le terme "${nom || ''}" dans le champ "nom" ET le terme "${description || ''}" dans le champ "description". 
Utilise une clause booléenne "must" avec deux conditions "match", une par champ.
Ne retourne aucun texte explicatif ni bloc markdown, seulement l'objet JSON valide.
`;

    const response = await askGemini(query);
    const cleaned = response
    .replace(/```json/g, '')  
    .replace(/```/g, '')      
    .trim();                  
    let parsedJSON;
  parsedJSON = JSON.parse(cleaned);
    return res.json(parsedJSON);
  } catch (error) {
    console.error('Error in search route:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


module.exports = router;