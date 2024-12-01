#!/bin/bash

# Variables
RESOURCE_GROUP="linkup-rg"
LOCATION="westeurope"
COSMOS_DB_ACCOUNT="linkup-cosmos"
STORAGE_ACCOUNT="linkupstorage"
SEARCH_SERVICE="linkup-search"
SERVICE_BUS_NAMESPACE="linkup-servicebus"
APP_SERVICE_PLAN="linkup-plan"
APP_SERVICE="linkup-supinfo-api"
COMMUNICATION_SERVICE="linkup-communication"

# Create Resource Group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Cosmos DB
az cosmosdb create \
    --name $COSMOS_DB_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --kind GlobalDocumentDB \
    --locations regionName=$LOCATION

# Create database and containers
az cosmosdb sql database create \
    --account-name $COSMOS_DB_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --name linkupdb

az cosmosdb sql container create \
    --account-name $COSMOS_DB_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --database-name linkupdb \
    --name users \
    --partition-key-path "/userId"

az cosmosdb sql container create \
    --account-name $COSMOS_DB_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --database-name linkupdb \
    --name posts \
    --partition-key-path "/userId"

# Create Storage Account
az storage account create \
    --name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku Standard_LRS \
    --kind StorageV2

# Create containers for media storage
az storage container create \
    --name media \
    --account-name $STORAGE_ACCOUNT \
    --public-access blob

# Create Azure Cognitive Search
az search service create \
    --name $SEARCH_SERVICE \
    --resource-group $RESOURCE_GROUP \
    --sku Basic \
    --location $LOCATION

# Create Search Index
az rest --method put \
    --uri "https://$SEARCH_SERVICE.search.windows.net/indexes/posts-index?api-version=2020-06-30" \
    --headers "Content-Type=application/json" "api-key=$(az search admin-key show --service-name $SEARCH_SERVICE --resource-group $RESOURCE_GROUP --query primaryKey -o tsv)" \
    --body '{
        "name": "posts-index",
        "fields": [
            {"name": "id", "type": "Edm.String", "key": true, "searchable": false},
            {"name": "userId", "type": "Edm.String", "searchable": false, "filterable": true},
            {"name": "content", "type": "Edm.String", "searchable": true, "analyzer": "standard.lucene"},
            {"name": "mediaUrl", "type": "Edm.String", "searchable": false},
            {"name": "createdAt", "type": "Edm.DateTimeOffset", "searchable": false, "sortable": true}
        ]
    }'

# Create Service Bus
az servicebus namespace create \
    --name $SERVICE_BUS_NAMESPACE \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku Standard

# Create Service Bus Queue for notifications
az servicebus queue create \
    --name notifications \
    --namespace-name $SERVICE_BUS_NAMESPACE \
    --resource-group $RESOURCE_GROUP

# Create App Service Plan
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --sku B1 \
    --is-linux

# Create Web App
az webapp create \
    --name $APP_SERVICE \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --runtime "NODE|18-lts"

# Create Azure Communication Services
az communication create \
    --name $COMMUNICATION_SERVICE \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION

# Enable managed identity for the web app
az webapp identity assign \
    --name $APP_SERVICE \
    --resource-group $RESOURCE_GROUP