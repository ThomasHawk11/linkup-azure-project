# Link Up Platform Deployment Guide

Ce guide fournit les instructions étape par étape pour déployer la plateforme Link Up sur Azure en utilisant le portail Azure.

## Prérequis

1. Un compte Azure avec un abonnement actif
2. Un compte GitHub
3. Node.js 18.x ou plus récent installé localement

## Configuration des Ressources Azure

### 1. Création du Groupe de Ressources

1. Connectez-vous au [Portail Azure](https://portal.azure.com)
2. Cliquez sur "Créer une ressource" (Create a resource)
3. Recherchez "Groupe de ressources" (Resource group)
4. Cliquez sur "Créer" (Create)
5. Remplissez les informations :
   - Abonnement : Sélectionnez votre abonnement
   - Groupe de ressources : `linkup-rg`
   - Région : Choisissez la région la plus proche
6. Cliquez sur "Vérifier + créer" puis "Créer"

### 2. Azure Cosmos DB

1. Dans le portail Azure, cliquez sur "Créer une ressource"
2. Recherchez "Azure Cosmos DB"
3. Sélectionnez "Azure Cosmos DB" et cliquez sur "Créer"
4. Choisissez "Core (SQL) - Recommended"
5. Configuration de base :
   - Groupe de ressources : `linkup-rg`
   - Nom du compte : `linkup-cosmos`
   - Emplacement : Même région que le groupe de ressources
6. Cliquez sur "Vérifier + créer" puis "Créer"
7. Une fois déployé, créez une base de données :
   - Accédez à la ressource
   - Cliquez sur "Data Explorer"
   - Créez une nouvelle base de données "linkupdb"
   - Créez deux conteneurs :
     - "users" avec clé de partition "/userId"
     - "posts" avec clé de partition "/userId"

### 3. Compte de Stockage

1. Dans le portail Azure, créez une nouvelle ressource
2. Recherchez "Compte de stockage"
3. Configuration :
   - Groupe de ressources : `linkup-rg`
   - Nom du compte : `linkupstorageacc`
   - Performance : Standard
   - Redondance : LRS
4. Une fois créé, configurez le conteneur :
   - Accédez à "Conteneurs"
   - Créez un nouveau conteneur nommé "media"
   - Niveau d'accès : Blob

### 4. Azure Cognitive Search

1. Créez une nouvelle ressource
2. Recherchez "Azure Cognitive Search"
3. Configuration :
   - Groupe de ressources : `linkup-rg`
   - Nom du service : `linkup-search`
   - Niveau tarifaire : Basic
4. Une fois déployé, créez un index :
   - Accédez à "Indexes"
   - Créez un nouvel index nommé "posts-index"
   - Définissez les champs :
     ```json
     {
       "name": "posts-index",
       "fields": [
         {"name": "id", "type": "Edm.String", "key": true, "searchable": false},
         {"name": "userId", "type": "Edm.String", "searchable": false, "filterable": true},
         {"name": "content", "type": "Edm.String", "searchable": true, "analyzer": "standard.lucene"},
         {"name": "mediaUrl", "type": "Edm.String", "searchable": false},
         {"name": "createdAt", "type": "Edm.DateTimeOffset", "searchable": false, "sortable": true}
       ]
     }
     ```

### 5. Service d'application

1. Créez une nouvelle ressource
2. Recherchez "App Service"
3. Configuration :
   - Groupe de ressources : `linkup-rg`
   - Nom : `linkup-supinfo-api`
   - Pile d'exécution : Node 18 LTS
   - Système d'exploitation : Linux
   - Région : Même que le groupe de ressources
   - Plan App Service : Créez-en un nouveau (B1)

### 6. Configuration des Variables d'Environnement

Dans le Service d'application :
1. Accédez à "Configuration"
2. Ajoutez les variables d'environnement suivantes :
   - `COSMOS_ENDPOINT` : URL de votre Cosmos DB
   - `COSMOS_KEY` : Clé primaire de Cosmos DB
   - `STORAGE_CONNECTION_STRING` : Chaîne de connexion du compte de stockage
   - `SEARCH_ENDPOINT` : URL de Cognitive Search
   - `SEARCH_API_KEY` : Clé d'administration de Cognitive Search
   - `JWT_SECRET` : Une chaîne aléatoire pour signer les JWT
   - `WEBSITE_NODE_DEFAULT_VERSION` : 18.x

## Configuration du Déploiement Continu

### 1. Configuration GitHub Actions

1. Dans votre dépôt GitHub :
   - Accédez à "Settings" > "Secrets and variables" > "Actions"
   - Ajoutez les secrets suivants :
     - `AZURE_WEBAPP_PUBLISH_PROFILE` : Profil de publication du Service d'application
     - `COSMOS_ENDPOINT`
     - `COSMOS_KEY`
     - `STORAGE_CONNECTION_STRING`
     - `SEARCH_ENDPOINT`
     - `SEARCH_API_KEY`
     - `JWT_SECRET`

### 2. Obtention du Profil de Publication

1. Dans le Service d'application Azure :
   - Accédez à "Centre de déploiement"
   - Cliquez sur "Gérer le profil de publication"
   - Téléchargez le fichier
   - Copiez son contenu dans le secret GitHub `AZURE_WEBAPP_PUBLISH_PROFILE`

## Vérification du Déploiement

1. Surveillez le déploiement :
   - Dans GitHub, accédez à "Actions"
   - Vérifiez que le workflow se termine avec succès

2. Testez l'API :
   - Utilisez l'URL : `https://linkup-supinfo-api.azurewebsites.net`
   - Vérifiez les points de terminaison principaux

## Dépannage

### Problèmes Courants

1. **Erreurs de Déploiement**
   - Vérifiez les logs dans GitHub Actions
   - Assurez-vous que tous les secrets sont correctement configurés
   - Vérifiez que la version Node.js correspond

2. **Problèmes de Base de Données**
   - Vérifiez les chaînes de connexion dans les paramètres d'application
   - Vérifiez les règles de pare-feu Cosmos DB
   - Validez les permissions de la base de données

3. **Problèmes de Stockage**
   - Vérifiez la chaîne de connexion du stockage
   - Vérifiez les permissions du conteneur
   - Vérifiez les paramètres CORS