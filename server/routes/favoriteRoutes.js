const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/favoriteController');

// All routes require authentication
router.use(auth);

// Favorite routes
router.post('/resources/:resourceId/favorite', addFavorite);
router.delete('/resources/:resourceId/favorite', removeFavorite);
router.get('/favorites', getFavorites);

module.exports = router; 