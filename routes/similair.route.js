const express = require('express');
const router = express.Router();
const { askGemini } = require('../lib/gemini');
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

router.post('/', async (req, res) => {
  const nom = req.body.nom;


  try{
 const query = `
Tu es une intelligence artificielle experte en e-commerce et Elasticsearch.

Ta tâche est de :
1. Lire un nom de produit donné.
2. Extraire exactement **3 mots-clés** les plus importants :  
   - Le type de produit  
   - Une caractéristique (taille, usage, fonctionnalité)  
   - Une couleur ou style  

3. Générer une requête Elasticsearch **au format JSON strictement valide**, qui :
   - fait un **bool.must** sur le type de produit (obligatoire)  
   - fait un **bool.should** avec un opérateur **more_like_this** sur la caractéristique et la couleur  
   - utilise le champ **"nom"** uniquement  
   - avec "min_term_freq": 1, "min_doc_freq": 1, et "minimum_should_match": "1" dans le more_like_this

4. Retourne uniquement l’objet JSON, sans texte explicatif.

Exemple de sortie attendue :

{
  "query": {
    "bool": {
      "must": [
        { "match": { "nom": "produit" } }
      ],
      "should": [
        {
          "more_like_this": {
            "fields": ["nom"],
            "like": ["caractéristique", "couleur"],
            "min_term_freq": 1,
            "min_doc_freq": 1,
            "minimum_should_match": "1"
          }
        }
      ]
    }
  }
}

Nom du produit : ${nom}
`;





    const response = await askGemini(query);
    const cleanedResponse = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
      const parsedJSON = JSON.parse(cleanedResponse);







      
    // 🔁 Simulation de réponse Elasticsearch
    const client = new Client({
  node: process.env.ELASTIC_NODE_URL,
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

  


  }catch (error) {
    console.error('Erreur dans la route de recherche :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }


});
module.exports = router;