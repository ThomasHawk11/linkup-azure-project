const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.STORAGE_CONNECTION_STRING
);

const mediaContainer = blobServiceClient.getContainerClient('media');

module.exports = { mediaContainer };