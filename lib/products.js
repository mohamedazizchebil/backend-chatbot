const { Client } = require('@elastic/elasticsearch');
require('dotenv').config(); // si tu utilises un fichier .env

const client = new Client({
  node: 'https://aidea-d0fb1d.es.us-central1.gcp.elastic.cloud:443',
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY // doit être au format id:secret
  }
});

const index = 'search-products';

const docs = [
  {
    nom: "Ramette de papier A4",
    description: "Ramette 500 feuilles A4 80g/m² blanc – usage bureautique.",
    image: "https://via.placeholder.com/150?text=Ramette+A4",
    lien: "https://www.bureau-vallee.fr/ramette-papier-a4.html"
  },
  {
    nom: "Classeur à levier dos 8 cm",
    description: "Classeur carton rigide, mécanisme métal, disponible en plusieurs couleurs.",
    image: "https://via.placeholder.com/150?text=Classeur+8cm",
    lien: "https://www.bureau-vallee.fr/classeur-a-levier.html"
  },
  {
    nom: "Fauteuil de bureau ergonomique",
    description: "Chaise de bureau avec soutien lombaire et accoudoirs réglables.",
    image: "https://via.placeholder.com/150?text=Fauteuil+Bureau",
    lien: "https://www.bureau-vallee.fr/fauteuils-et-chaises.html"
  },
  {
    nom: "Toner compatible HP 44A",
    description: "Cartouche laser noir compatible HP – impression économique.",
    image: "https://via.placeholder.com/150?text=Toner+HP+44A",
    lien: "https://www.bureau-vallee.fr/cartouche-toner-compatible-hp.html"
  },
  {
    nom: "Imprimante Epson EcoTank L3250",
    description: "Imprimante multifonction sans cartouche avec réservoirs rechargeables.",
    image: "https://via.placeholder.com/150?text=Epson+L3250",
    lien: "https://www.bureau-vallee.fr/imprimante-epson-ecotank.html"
  },
  {
    nom: "Plastifieuse A4",
    description: "Plastifieuse compacte, pour feuilles jusqu'à A4 – idéale pour documents importants.",
    image: "https://via.placeholder.com/150?text=Plastifieuse",
    lien: "https://www.bureau-vallee.fr/plastifieuse.html"
  },
  {
    nom: "Organiseur de bureau",
    description: "Porte-stylos multifonction en plastique recyclé – 5 compartiments.",
    image: "https://via.placeholder.com/150?text=Organiseur",
    lien: "https://www.bureau-vallee.fr/rangement-bureau.html"
  },
  {
    nom: "Calculatrice CASIO FX-92+",
    description: "Calculatrice scientifique scolaire avec plus de 240 fonctions.",
    image: "https://via.placeholder.com/150?text=CASIO+FX92+",
    lien: "https://www.bureau-vallee.fr/calculatrice-fx-92.html"
  }
];



async function runBulkInsert() {
  try {
    const bulkIngestResponse = await client.helpers.bulk({
      index,
      datasource: docs,
      onDocument() {
        return { index: {} };
      }
    });

    console.log('✅ Documents insérés :', bulkIngestResponse);
  } catch (err) {
    console.error('❌ Erreur lors de l\'insertion :', err.meta?.body?.error || err);
  }
}

runBulkInsert();
