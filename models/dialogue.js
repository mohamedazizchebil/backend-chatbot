// chatbot-backend/models/pageDialogue.js

const mongoose = require('mongoose');

// Déclaration précoce du schéma pour la récursivité
const dialogueStepSchema = new mongoose.Schema();

// Schéma pour les options d'une étape de dialogue
const optionSchema = new mongoose.Schema({
    label: { type: String, required: true },
    action: { type: String,required:true }, // 'action' n'est pas requis si 'next' est présent
    url: { type: String, required:function(){
        return this.action === 'redirect'; // 'url' est requis uniquement si l'action est 'redirect'
    } },    // Utilisé pour l'action 'redirect'
    next: [dialogueStepSchema], // <-- Référence récursive pour les étapes imbriquées
});


Object.assign(dialogueStepSchema.paths, new mongoose.Schema({
    question: { type: String, required: true },
    options: [optionSchema],
}).paths);

// Schéma principal pour la configuration de dialogue par type de page
const pageDialogueSchema = new mongoose.Schema({
    appid:{
        type: String,
        required:true
    },
    pageType: {
        type: String,
        required: true,
        
    },
    dialogue: [dialogueStepSchema],
}, { timestamps: true }); 


pageDialogueSchema.index({ appid: 1, pageType: 1 }, { unique: true }); // Index unique pour appid et pageType




module.exports = mongoose.model('Dialogues', pageDialogueSchema);