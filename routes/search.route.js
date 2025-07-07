const express = require('express');
const router = express.Router();
const { askGemini } = require('../lib/gemini');
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { nom, description } = req.body;

  if (!nom && !description) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
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

    // 🔁 Simulation de réponse Elasticsearch
    const client = new Client({
  node: 'https://my-elasticsearch-project-b28f3a.es.us-east-1.aws.elastic.cloud:443',
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY 
  },
  serverMode: 'serverless',
});

const index = 'search-products';

const result = await client.search({
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








