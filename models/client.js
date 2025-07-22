
const mongoose = require('mongoose'); 
const crypto = require('crypto');

const ElasticsearchSchema = new mongoose.Schema({
  url: { type: String, required: true },
  apiKey: { type: String, required: true }
});


const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  appid: { type: String, unique: true },
  elasticsearch: {
    type: ElasticsearchSchema
  },
  createdAt: { type: Date, default: Date.now }
});



// Generate appid static method
clientSchema.statics.generateAppId = function() {
  return crypto.randomBytes(16).toString('hex');
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
