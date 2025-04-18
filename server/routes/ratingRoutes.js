const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createRating,
  updateRating,
  deleteRating,
  getResourceRatings,
  getUserRatings
} = require('../controllers/ratingController');

// All routes require authentication
router.use(auth);

// Rating routes
router.post('/resources/:resourceId/ratings', createRating);
router.patch('/ratings/:ratingId', updateRating);
router.delete('/ratings/:ratingId', deleteRating);
router.get('/resources/:resourceId/ratings', getResourceRatings);
router.get('/user/ratings', getUserRatings);

module.exports = router; 