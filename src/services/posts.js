const { posts } = require('../config/database');
const { mediaContainer } = require('../config/storage');

async function validatePostOwnership(postId, userId) {
  try {
    const { resources } = await posts.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @postId",
        parameters: [{ name: "@postId", value: postId }]
      })
      .fetchAll();

    const post = resources[0];
    
    if (!post) {
      console.log('Post not found:', postId);
      return false;
    }

    console.log('Found post:', post);
    console.log('Comparing post.userId:', post.userId, 'with userId:', userId);
    
    return post.userId === userId;
  } catch (error) {
    console.error('Error validating post ownership:', error);
    throw error;
  }
}

async function deletePostMedia(mediaUrl) {
  if (!mediaUrl) {
    return;
  }

  try {
    const blobName = mediaUrl.split('/').pop();
    const blockBlobClient = mediaContainer.getBlockBlobClient(blobName);
    
    const exists = await blockBlobClient.exists();
    if (exists) {
      await blockBlobClient.delete();
      console.log('Media blob deleted successfully:', blobName);
    } else {
      console.log('Media blob does not exist:', blobName);
    }
  } catch (error) {
    console.error('Error checking/deleting media blob:', error);
  }
}

async function deletePost(postId) {
  try {
    const { resources } = await posts.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @postId",
        parameters: [{ name: "@postId", value: postId }]
      })
      .fetchAll();

    const post = resources[0];
    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    if (post.mediaUrl) {
      await deletePostMedia(post.mediaUrl);
    }

    console.log('Deleting post:', postId, 'by user:', post.userId);
    await posts.item(postId, post.userId).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}

module.exports = {
  validatePostOwnership,
  deletePost
};