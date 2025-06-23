const express = require('express');
const router = express.Router();
const {askGemini} = require('../lib/gemini');



router.post('/search', async (req, res) => {
  const nom = req.query.nom;
  const description = req.query.description;


  if (!nom && !description) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const query = `génère uniquement une requête Elasticsearch au format JSON, contenant obligatoirement les clés "query", "match" et "size", pour rechercher le terme "${nom || description}" dans les champs "nom" et "description". Ne retourne rien d'autre que la requête JSON.`;
    const response = await askGemini(query);
    return res.json({ response });
  } catch (error) {
    console.error('Error in search route:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

