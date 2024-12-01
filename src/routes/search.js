const express = require('express');
const { searchPosts } = require('../services/search');
const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  
  try {
    const results = await searchPosts(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;