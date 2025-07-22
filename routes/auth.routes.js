const express = require('express');
const router = express.Router();
const Client = require('../models/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET


// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password ) {
      return res.status(400).json({ error: 'name, password are required.' });
    }

    // Check if name already exists
    const existing = await Client.findOne({ name });
    if (existing) {
      return res.status(409).json({ error: 'name already registered.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate apiKey and appid
    const appid = Client.generateAppId();

    // Create and save client
    const client = new Client({
      name,
      password: hashedPassword,
      appid
    });
    await client.save();

    // Return apiKey and appid
    res.status(201).json({ appid });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required.' });
    }
    // Find client by name
    const client= await Client.findOne({ name });
    if (!client) {
      return res.status(404).json({ error: 'Client not found.' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, client.password); // Compare hashed passwords
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password.' });
    }


    // Generate JWT token
    const token =jwt.sign(
      { appid: client.appid, name: client.name },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return appid and apiKey
    res.status(200).json({
      appid: client.appid,
      token, // Return the JWT token
    });
  }
  catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});





module.exports = router; 