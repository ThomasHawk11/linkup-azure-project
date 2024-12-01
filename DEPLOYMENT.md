# Link Up Platform Deployment Guide

This guide provides step-by-step instructions for deploying the Link Up social media platform on Azure.

## Prerequisites

1. Azure Account with active subscription
2. Azure CLI installed
3. Node.js 18.x or later
4. GitHub account (for CI/CD)

## Azure Resources Setup

### 1. Initial Setup

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription <your-subscription-id>
```

### 2. Run Infrastructure Script

```bash
# Make the script executable
chmod +x infrastructure/azure-setup.sh

# Run the script
./infrastructure/azure-setup.sh
```

This script creates all necessary Azure resources:
- Resource Group
- Cosmos DB
- Storage Account
- Cognitive Search
- App Service
- Communication Services

### 3. Environment Configuration

Create a `.env` file with the following variables:

```env
COSMOS_ENDPOINT=<your-cosmos-endpoint>
COSMOS_KEY=<your-cosmos-key>
STORAGE_CONNECTION_STRING=<your-storage-connection-string>
SEARCH_ENDPOINT=<your-search-endpoint>
SEARCH_API_KEY=<your-search-api-key>
JWT_SECRET=<your-jwt-secret>
COMMUNICATION_CONNECTION_STRING=<your-communication-connection-string>
```

### 4. GitHub Actions Setup

1. Navigate to your GitHub repository settings
2. Go to "Secrets and variables" → "Actions"
3. Add the following secrets:
   - `AZURE_WEBAPP_PUBLISH_PROFILE`
   - `COSMOS_ENDPOINT`
   - `COSMOS_KEY`
   - `STORAGE_CONNECTION_STRING`
   - `SEARCH_ENDPOINT`
   - `SEARCH_API_KEY`
   - `JWT_SECRET`
   - `COMMUNICATION_CONNECTION_STRING`

### 5. Configure Azure App Service

```bash
# Set Node.js version
az webapp config appsettings set --name linkup-supinfo-api \
                                --resource-group linkup-rg \
                                --settings WEBSITE_NODE_DEFAULT_VERSION=18.x

# Enable logging
az webapp log config --name linkup-supinfo-api \
                    --resource-group linkup-rg \
                    --application-logging filesystem \
                    --detailed-error-messages true \
                    --failed-request-tracing true \
                    --web-server-logging filesystem
```

## Manual Deployment

If you prefer manual deployment over GitHub Actions:

```bash
# Build the project
npm install
npm run build

# Zip the deployment package
zip -r deployment.zip ./*

# Deploy to Azure
az webapp deployment source config-zip --resource-group linkup-rg \
                                     --name linkup-supinfo-api \
                                     --src deployment.zip
```

## Post-Deployment Verification

1. Check Application Logs:
```bash
az webapp log tail --name linkup-supinfo-api --resource-group linkup-rg
```

2. Test the endpoints:
```bash
curl https://linkup-supinfo-api.azurewebsites.net/health
```

## Troubleshooting

### Common Issues

1. **Deployment Failures**
   - Check GitHub Actions logs
   - Verify secrets are correctly set
   - Ensure Node.js version matches

2. **Database Connection Issues**
   - Verify Cosmos DB connection string
   - Check network security rules
   - Validate database permissions

3. **Storage Problems**
   - Confirm storage account connection string
   - Check container permissions
   - Verify CORS settings

### Monitoring

1. Set up Azure Monitor:
```bash
az monitor app-insights component create \
    --app linkup-insights \
    --location westeurope \
    --resource-group linkup-rg \
    --application-type web
```

2. Enable Application Insights:
```bash
az webapp config appsettings set \
    --name linkup-supinfo-api \
    --resource-group linkup-rg \
    --settings APPINSIGHTS_INSTRUMENTATIONKEY=<your-key>
```

## Scaling Configuration

### App Service Scaling

```bash
# Set up autoscaling
az monitor autoscale create \
    --resource-group linkup-rg \
    --name linkup-autoscale \
    --resource linkup-supinfo-api \
    --min-count 1 \
    --max-count 5 \
    --count 1
```

### Cosmos DB Scaling

```bash
# Update RU/s
az cosmosdb sql database throughput update \
    --account-name linkup-cosmos \
    --name linkupdb \
    --resource-group linkup-rg \
    --throughput 400
```

## Backup and Disaster Recovery

### Configure Backup

```bash
# Enable automatic backup
az webapp config backup create \
    --resource-group linkup-rg \
    --webapp-name linkup-supinfo-api \
    --frequency 1d \
    --retain-one true \
    --container-url <storage-container-url> \
    --sas-url <sas-token>
```

### Restore from Backup

```bash
az webapp config backup restore \
    --resource-group linkup-rg \
    --webapp-name linkup-supinfo-api \
    --container-url <storage-container-url> \
    --sas-url <sas-token> \
    --backup-name <backup-name>
```

## Security Considerations

1. Enable SSL:
```bash
az webapp config ssl bind \
    --name linkup-supinfo-api \
    --resource-group linkup-rg \
    --certificate-thumbprint <thumbprint> \
    --ssl-type SNI
```

2. Configure IP restrictions:
```bash
az webapp config access-restriction add \
    --resource-group linkup-rg \
    --name linkup-supinfo-api \
    --rule-name "allow-specific-ips" \
    --action Allow \
    --ip-address <your-ip-range>
```

## Maintenance

### Regular Tasks

1. Update Node.js version when needed
2. Monitor resource usage
3. Review and rotate access keys
4. Check and update SSL certificates
5. Review and optimize database indexes

### Performance Optimization

1. Enable CDN for media content
2. Configure caching headers
3. Monitor and adjust scaling rules
4. Optimize database queries
5. Review and update search indexes