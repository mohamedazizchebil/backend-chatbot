# backend-chatbot-Aidea

## Présentation

Ce projet est un backend Node.js pour un chatbot intelligent , configurable et intégrable dans les sites e-commerce avec une platforme de gestion des dialogues

## Fonctionnalités principales du backend-chatbot

1. **Initialisation du chatbot**
   - Démarrage d’une session de chat personnalisée pour chaque utilisateur.
   - Récupération du dialogue initial adapté au contexte (page d’accueil, recherche, produit, etc.).
   - Génération et gestion de tokens de session pour sécuriser les échanges.

2. **Recherche de produits intelligente**
   - Recherche sémantique de produits via Elasticsearch.
   - Recherche de produits similaires à partir d’un nom de produit.

3. **Gestion dynamique des dialogues**
   - Stockage, personnalisation et adaptation des dialogues pour différents contextes.
   - Ajout, modification, suppression et récupération de dialogues par type de page.

4. **Authentification et gestion des clients**
   - Inscription et connexion sécurisées des clients avec génération de tokens JWT.
   - Chaque client peut configurer ses propres accès à Elasticsearch.


5. **Gestion des informations Elasticsearch**
   - Ajout et récupération des informations de connexion Elasticsearch pour chaque client.




## Structure des dossiers

- `routes/` : Contient les routes de l’API (authentification, chat, recherche, etc.).
- `models/` : Modèles Mongoose pour MongoDB (clients, dialogues).
- `lib/` : Librairies utilitaires (connexion à Gemini).
- `middlewares/` : Middlewares Express (authentification JWT).


## Liste des routes de l'API backend-chatbot


## Authentification (`/api`)

- **POST** `/register` : Inscription d’un client
- **POST** `/login` : Connexion d’un client

---

## Chatbot (`/api/chat`)

- **POST** `/chat/init` : Initialiser une session de chat (récupérer le dialogue initial)
- **POST** `/chat/check-session` : Vérifier la validité d’un token de session du chatbot

---

## Dialogue (`/api/dialogue`)
*(Nécessite authentification via JWT)*

- **POST** `/dialogue/add` : Ajouter ou mettre à jour un dialogue pour un type de page
- **GET** `/dialogue/get/:pageType` : Récupérer le dialogue d’un type de page
- **DELETE** `/dialogue/delete` : Supprimer la configuration de dialogue d’un type de page
- **GET** `/dialogue/getall` : Récupérer tous les dialogues du client

---

## Recherche (`/api/search`)

- **POST** `/search` : Recherche de produits (par nom ou description, via Elasticsearch)

---

## Similarité de produits (`/api/similair`)

- **POST** `/` : Trouver des produits similaires à partir d’un nom de produit

---

## Informations Elasticsearch (`/api`)
*(Nécessite authentification via JWT)*

- **POST** `/addElasticInformation` : Ajouter ou mettre à jour les informations de connexion Elasticsearch du client
- **GET** `/getElasticInformation` : Récupérer les informations Elasticsearch du client

---


## Technologies utilisées

- Node.js, Express
- MongoDB, Mongoose
- Elasticsearch
- JWT (JSON Web Token)
- Gemini API (pour la génération de requêtes sémantiques)

