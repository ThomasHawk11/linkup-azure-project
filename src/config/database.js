const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const database = client.database('linkupdb');
const containers = {
  users: database.container('users'),
  posts: database.container('posts')
};

module.exports = containers;