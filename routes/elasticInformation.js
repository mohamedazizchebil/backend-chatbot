const express = require('express');
const router = express.Router();
const Client = require('../models/client');
const authenticateToken = require('../middlewares/authenticateToken');


router.post('/addElasticInformation', authenticateToken, async (req, res) => {
    const { url , apikey } = req.body;

    if (!url || !apikey) {
        return res.status(400).json({ error: 'url and apikey are required.' });
    }
    try {
        const client = req.client; // Récupère le client authentifié depuis le middleware
      

        // Vérifie si config déjà existante pour ce client
        let config = await Client.findOne({ appid: client.appid });

        if(config){
          if (!client.elasticsearch) {
      config.elasticsearch = {};
    }
            config.elasticsearch.url = url;
            config.elasticsearch.apiKey = apikey;
            await config.save();
        }
        
        res.status(200).json({ message: 'Elastic information saved successfully.' });
    } catch (err) {
        console.error('Error saving elastic information:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/getElasticInformation', authenticateToken, async (req, res) => {
    try {
        const client = req.client; // Récupère le client authentifié depuis le middleware
        
        // Récupère les informations Elasticsearch du client
        const config = await Client.findOne({ appid: client.appid }, 'elasticsearch');

        if (!config || !config.elasticsearch) {
            return res.status(404).json({ error: 'Elastic information not found.' });
        }
        res.status(200).json({ elasticsearch: config.elasticsearch });
    } catch (err) {
        console.error('Error retrieving elastic information:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;