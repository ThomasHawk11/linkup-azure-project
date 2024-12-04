const express = require('express');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const authMiddleware = require('./middleware/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

// Public routes
app.use('/', (req, res) => {
  res.json({ message: 'Welcome to Linkup API' });
});
app.use('/auth', authRoutes);

// Protected routes
app.use('/users', authMiddleware, usersRoutes);
app.use('/posts', authMiddleware, postsRoutes);
app.use('/search', authMiddleware, searchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});