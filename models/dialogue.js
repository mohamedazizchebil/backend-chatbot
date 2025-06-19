// chatbot-backend/models/pageDialogue.js

const mongoose = require('mongoose');

// Déclaration précoce du schéma pour la récursivité
const dialogueStepSchema = new mongoose.Schema();

// Schéma pour les options d'une étape de dialogue
const optionSchema = new mongoose.Schema({
    label: { type: String, required: true },
    action: { type: String }, // 'action' n'est pas requis si 'next' est présent
    url: { type: String },    // Utilisé pour l'action 'redirect'
    prompt: { type: String }, // Utilisé pour l'action 'semantic_search'
    field: { type: String },  // Utilisé pour l'action 'refine_search'
    next: [dialogueStepSchema], // <-- Référence récursive pour les étapes imbriquées
});

// Schéma complet pour une étape de dialogue (question + options)
// Object.assign est utilisé ici pour ajouter les propriétés à dialogueStepSchema
// qui a été déclaré en avance pour la récursivité.
Object.assign(dialogueStepSchema.paths, new mongoose.Schema({
    question: { type: String, required: true },
    // messages: [{ type: String }], // Optionnel: pour des messages bot multiples ou complexes par étape
    options: [optionSchema],
}).paths);

// Schéma principal pour la configuration de dialogue par type de page
const pageDialogueSchema = new mongoose.Schema({
    pageType: {
        type: String,
        required: true,
        unique: true, // Chaque pageType doit avoir une configuration unique
    },
    dialogue: [dialogueStepSchema], // Tableau des étapes de dialogue de niveau supérieur
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

module.exports = mongoose.model('PageDialogue', pageDialogueSchema);