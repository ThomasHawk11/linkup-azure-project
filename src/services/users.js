const { users } = require('../config/database');
const { sanitizeUser } = require('../utils/userUtils');

async function getUserById(userId) {
  try {
    const { resource: user } = await users.item(userId).read();
    return user ? sanitizeUser(user) : null;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
}

async function getUserProfile(userId) {
  try {
    const { resource: user } = await users.item(userId).read();
    if (!user) return null;

    // Return only public profile information
    return {
      id: user.id,
      username: user.username,
      profile: user.profile,
      stats: user.stats,
      isPrivate: user.isPrivate
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

module.exports = {
  getUserById,
  getUserProfile
};