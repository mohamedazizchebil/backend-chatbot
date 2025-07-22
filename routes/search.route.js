const express = require('express');
const router = express.Router();
const { askGemini } = require('../lib/gemini');
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();
const ClientModel= require('../models/client');



router.post('/search', async (req, res) => {
  const { nom, description,appid } = req.body;

  if (!nom && !description && !appid) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const client = await ClientModel.findOne({appid});
    
        if (!client) {
          return res.status(404).json({ error: 'Client not found.' });
        }
    // Génère une requête Elasticsearch avec Gemini
    const query = `
Génère uniquement une requête Elasticsearch au format JSON brut, contenant obligatoirement les clés "query", "match" et "size". 
La requête doit rechercher le terme "${nom || ''}" dans le champ "nom" OU le terme "${description || ''}" dans le champ "description". 
Utilise une clause booléenne "should" avec deux conditions "match", une par champ.
Ne retourne aucun texte explicatif ni bloc markdown, seulement l'objet JSON valide.
`;

    const response = await askGemini(query);
    const cleaned = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsedJSON = JSON.parse(cleaned);

    // Simulation de réponse Elasticsearch
    const clientElastic = new Client({
  node: client.elasticsearch.url,
  auth: {
    apiKey: client.elasticsearch.apiKey 
  },
  serverMode: 'serverless',
});

const index = 'search-products';

const result = await clientElastic.search({
  index,
  body: parsedJSON,
});

console.log(result.hits.hits);
const hits = result.hits.hits.map(hit => hit._source);
return res.json(hits);

  } catch (error) {
    console.error('Error in search route:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;








