const express = require('express');
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const router = express.Router();

const searchClient = new SearchClient(
  process.env.SEARCH_ENDPOINT,
  'posts-index',
  new AzureKeyCredential(process.env.SEARCH_API_KEY)
);

router.get('/', async (req, res) => {
  const { q } = req.query;
  
  try {
    const searchResults = await searchClient.search(q);
    const results = [];
    
    for await (const result of searchResults.results) {
      results.push(result.document);
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;