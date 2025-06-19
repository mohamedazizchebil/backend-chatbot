// chatbot-backend/scripts/importDialogues.js

require('dotenv').config(); // Charge les variables d'environnement depuis .env
const mongoose = require('mongoose');
const fs = require('fs').promises; // Utilisation de fs.promises pour les opérations asynchrones
const path = require('path');
const PageDialogue = require('./models/dialogue'); // Assurez-vous du bon chemin vers votre modèle Mongoose

// URI de connexion à MongoDB (depuis .env ou valeur par défaut)
const MONGODB_URI = process.env.MONGODB_URI;
// Chemin absolu vers le dossier contenant vos fichiers JSON de dialogue
const DIALOGUES_SOURCE_DIR = path.join(__dirname, './dialogues-sources');

async function importAllDialogues() {
    try {
        // 1. Connexion à la base de données MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB pour l\'importation des dialogues.');

        // 2. Lire tous les fichiers dans le dossier source
        const files = await fs.readdir(DIALOGUES_SOURCE_DIR);
        let importedCount = 0;

        // 3. Traiter chaque fichier JSON
        for (const file of files) {
            // Vérifier que c'est un fichier JSON
            if (file.endsWith('.json')) {
                // Le pageType est le nom du fichier sans l'extension .json
                const pageType = file.replace('.json', '');
                const filePath = path.join(DIALOGUES_SOURCE_DIR, file);

                try {
                    // Lire le contenu du fichier
                    const fileContent = await fs.readFile(filePath, 'utf8');
                    const dialogueArray = JSON.parse(fileContent); // Le fichier JSON doit être un tableau d'objets

                    // Vérifier si le contenu parsé est bien un tableau
                    if (!Array.isArray(dialogueArray)) {
                        console.warn(`[AVERTISSEMENT] Le fichier ${file} ne contient pas un tableau racine. Ignoré.`);
                        continue; // Passe au fichier suivant
                    }

                    // Créer l'objet complet qui sera stocké dans la collection PageDialogue
                    const dialogueData = {
                        pageType: pageType,
                        dialogue: dialogueArray, // C'est ici que le tableau du JSON est stocké
                    };

                    // Utiliser findOneAndUpdate avec upsert:true
                    // Cela permet d'insérer un nouveau document si le pageType n'existe pas,
                    // ou de mettre à jour le document existant si le pageType est déjà présent.
                    await PageDialogue.findOneAndUpdate(
                        { pageType: pageType }, // Critère de recherche : le pageType
                        dialogueData,            // Les données à insérer ou mettre à jour
                        {
                            upsert: true, // Si aucun document ne correspond, en crée un nouveau
                            new: true,    // Retourne le document modifié (ou nouvellement créé)
                            setDefaultsOnInsert: true // Applique les valeurs par défaut du schéma lors de l'insertion
                        }
                    );

                    console.log(`[SUCCÈS] Dialogue pour pageType '${pageType}' importé/mis à jour.`);
                    importedCount++;

                } catch (parseError) {
                    console.error(`[ERREUR] Impossible de lire ou parser le fichier JSON ${file}: ${parseError.message}`);
                }
            }
        }

        console.log(`\nImportation terminée. ${importedCount} dialogues traités.`);

    } catch (error) {
        console.error('Erreur globale lors de l\'importation des dialogues:', error);
    } finally {
        // 4. Fermeture de la connexion à la base de données
        await mongoose.disconnect();
        console.log('Déconnecté de MongoDB.');
    }
}

// Exécute le script d'importation
importAllDialogues();