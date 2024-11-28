const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { CommunicationIdentityClient } = require('@azure/communication-identity');
const router = express.Router();
const { users } = require('../config/database');

const identityClient = new CommunicationIdentityClient(process.env.COMMUNICATION_CONNECTION_STRING);
const SALT_ROUNDS = 10;

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = {
      id: `user-${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      isPrivate: false,
      createdAt: new Date().toISOString()
    };

    await users.items.create(user);
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { resources: [user] } = await users.items
      .query({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: email }]
      })
      .fetchAll();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;