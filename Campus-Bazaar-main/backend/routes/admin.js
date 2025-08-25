// backend/routes/admin.js
const express = require('express');
const User = require('../models/User');
const Note = require('../models/Note');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Get all users
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notes
router.get('/notes', adminMiddleware, async (req, res) => {
  try {
    const notes = await Note.find();
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a note
router.delete('/notes/:id', adminMiddleware, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Site analytics
router.get('/analytics', adminMiddleware, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const noteCount = await Note.countDocuments();
    // Add more analytics as needed
    res.json({ userCount, noteCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
