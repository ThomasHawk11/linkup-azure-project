const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
require('dotenv').config();

const searchClient = new SearchClient(
  process.env.SEARCH_ENDPOINT,
  'posts-index',
  new AzureKeyCredential(process.env.SEARCH_API_KEY)
);

async function indexPost(post) {
  try {
    await searchClient.uploadDocuments([post]);
    return true;
  } catch (error) {
    console.error('Error indexing post:', error);
    return false;
  }
}

async function searchPosts(query) {
  try {
    const searchResults = await searchClient.search(query);
    const results = [];
    for await (const result of searchResults.results) {
      results.push(result.document);
    }
    return results;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}

module.exports = {
  indexPost,
  searchPosts
};