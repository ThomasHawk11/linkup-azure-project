const express = require('express');
const multer = require('multer');
const { posts } = require('../config/database');
const { mediaContainer } = require('../config/storage');
const router = express.Router();
const upload = multer();

router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.auth.userId;

    let mediaUrl = null;
    if (req.file) {
      const blobName = `${userId}-${Date.now()}-${req.file.originalname}`;
      const blockBlobClient = mediaContainer.getBlockBlobClient(blobName);
      await blockBlobClient.upload(req.file.buffer, req.file.size);
      mediaUrl = blockBlobClient.url;
    }

    const post = {
      id: `post-${Date.now()}`,
      userId,
      content,
      mediaUrl,
      createdAt: new Date().toISOString()
    };

    await posts.items.create(post);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { resources: userPosts } = await posts.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC",
        parameters: [{ name: "@userId", value: req.params.userId }]
      })
      .fetchAll();

    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;