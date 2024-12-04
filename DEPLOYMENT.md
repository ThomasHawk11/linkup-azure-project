# Link Up Platform Deployment Guide

This guide provides step-by-step instructions for deploying the Link Up platform on Azure using the Azure Portal.

- #### See [documentation](./README.md)

## Prerequisites

1. An Azure account with an active subscription
2. A GitHub account
3. Node.js 18.x or later installed locally

## Azure Resources Configuration

### 1. Create Resource Group

1. Log in to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Resource group"
4. Click "Create"
5. Fill in the information:
   - Subscription: Select your subscription
   - Resource group: `linkup-rg`
   - Region: Choose the closest region
6. Click "Review + create" then "Create"

### 2. Azure Cosmos DB

1. In Azure Portal, click "Create a resource"
2. Search for "Azure Cosmos DB"
3. Select "Azure Cosmos DB" and click "Create"
4. Choose "Core (SQL) - Recommended"
5. Basic configuration:
   - Resource group: `linkup-rg`
   - Account name: `linkup-cosmos`
   - Location: Same region as resource group
6. Click "Review + create" then "Create"
7. Once deployed, create a database:
   - Go to the resource
   - Click "Data Explorer"
   - Create a new database "linkupdb"
   - Create two containers:
     - "users" with partition key "/userId"
     - "posts" with partition key "/userId"

### 3. Storage Account

1. In Azure Portal, create a new resource
2. Search for "Storage account"
3. Configuration:
   - Resource group: `linkup-rg`
   - Account name: `linkupstorageacc`
   - Performance: Standard
   - Redundancy: LRS
4. Once created, configure the container:
   - Go to "Containers"
   - Create a new container named "media"
   - Access level: Blob

### 4. Azure Cognitive Search

1. Create a new resource
2. Search for "Azure Cognitive Search"
3. Configuration:
   - Resource group: `linkup-rg`
   - Service name: `linkup-search`
   - Pricing tier: Basic
4. Once deployed, create an index:
   - Go to "Indexes"
   - Create a new index named "posts-index"
   - Define the fields:
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

### 5. App Service

1. Create a new resource
2. Search for "App Service"
3. Configuration:
   - Resource group: `linkup-rg`
   - Name: `linkup-supinfo-api`
   - Runtime stack: Node 18 LTS
   - Operating System: Linux
   - Region: Same as resource group
   - App Service Plan: Create new (B1)

### 6. Environment Variables Configuration

In App Service:
1. Go to "Configuration"
2. Add the following environment variables:
   - `COSMOS_ENDPOINT`: Your Cosmos DB URL
   - `COSMOS_KEY`: Cosmos DB Primary Key
   - `STORAGE_CONNECTION_STRING`: Storage account connection string
   - `SEARCH_ENDPOINT`: Cognitive Search URL
   - `SEARCH_API_KEY`: Cognitive Search admin key
   - `JWT_SECRET`: Random string for JWT signing
   - `WEBSITE_NODE_DEFAULT_VERSION`: 18.x

## Continuous Deployment Setup

### 1. GitHub Actions Configuration

1. In your GitHub repository:
   - Go to "Settings" > "Secrets and variables" > "Actions"
   - Add the following secrets:
     - `AZURE_WEBAPP_PUBLISH_PROFILE`: App Service publish profile
     - `COSMOS_ENDPOINT`
     - `COSMOS_KEY`
     - `STORAGE_CONNECTION_STRING`
     - `SEARCH_ENDPOINT`
     - `SEARCH_API_KEY`
     - `JWT_SECRET`

### 2. Getting the Publish Profile

1. In Azure App Service:
   - Go to "Deployment Center"
   - Click "Manage publish profile"
   - Download the file
   - Copy its contents to the GitHub secret `AZURE_WEBAPP_PUBLISH_PROFILE`

## Deployment Verification

1. Monitor deployment:
   - In GitHub, go to "Actions"
   - Verify that the workflow completes successfully

2. Test the API:
   - Use the URL: `https://linkup-supinfo-api.azurewebsites.net`
   - Check the main endpoints

## Troubleshooting

### Common Issues

1. **Deployment Errors**
   - Check GitHub Actions logs
   - Ensure all secrets are properly configured
   - Verify Node.js version matches

2. **Database Issues**
   - Check connection strings in application settings
   - Verify Cosmos DB firewall rules
   - Validate database permissions

3. **Storage Issues**
   - Verify storage connection string
   - Check container permissions
   - Verify CORS settings

### Monitoring

In Azure Portal:
1. Go to App Service
2. Check the "Monitoring" section
3. Verify:
   - Application logs
   - Metrics
   - Diagnostics

## Security Best Practices

1. **Access Control**
   - Use Managed Identities when possible
   - Implement least privilege access
   - Regularly rotate keys and secrets

2. **Network Security**
   - Enable Azure Front Door for DDoS protection
   - Configure IP restrictions
   - Use VNet integration where possible

3. **Data Security**
   - Enable encryption at rest
   - Use HTTPS/SSL for all endpoints
   - Implement proper backup strategies

## Cost Management

1. **Resource Optimization**
   - Monitor resource usage
   - Set up budget alerts
   - Use appropriate pricing tiers

2. **Scaling Guidelines**
   - Start with lower tiers
   - Scale based on actual usage
   - Monitor performance metrics

## Maintenance

1. **Regular Updates**
   - Keep Node.js version updated
   - Monitor dependency updates
   - Apply security patches

2. **Backup Strategy**
   - Configure automated backups
   - Test restore procedures
   - Document recovery processes

3. **Performance Monitoring**
   - Set up alerts for key metrics
   - Monitor response times
   - Track resource utilization