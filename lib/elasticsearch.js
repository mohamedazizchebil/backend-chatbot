const { Client } = require('@elastic/elasticsearch');
require('dotenv').config(); 
const client = new Client({
  node: 'https://my-elasticsearch-project-b28f3a.es.us-east-1.aws.elastic.cloud:443',
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY 
  }
});

const index = 'search-products';

async function updateMapping() {
  try {
    const response = await client.indices.putMapping({
      index,
      body: {
        properties: {
          nom: { type: 'text' },
          description: { type: 'text' }
        }
      }
    });

    console.log('✅ Mapping mis à jour avec succès :', response);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du mapping :', error.meta?.body?.error || error);
  }
}

updateMapping();
