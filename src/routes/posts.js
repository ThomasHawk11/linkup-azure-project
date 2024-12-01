const express = require('express');
const multer = require('multer');
const { posts } = require('../config/database');
const { mediaContainer } = require('../config/storage');
const { indexPost } = require('../services/search');
const { deletePost, validatePostOwnership } = require('../services/posts');
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
    await indexPost(post); // Index the post for search
    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
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

router.delete('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.auth.userId;

    console.log('Attempting to delete post:', postId, 'by user:', userId);

    // Verify post ownership
    const isOwner = await validatePostOwnership(postId, userId);
    console.log('isOwner:', isOwner);
    if (!isOwner) {
      console.log('Unauthorized deletion attempt - not owner');
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    // Delete the post and its associated media
    const result = await deletePost(postId);
    
    if (result.success) {
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error in delete post route:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;