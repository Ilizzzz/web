const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController');

// All routes require authentication
router.use(auth);

// Comment routes
router.post('/resources/:resourceId/comments', createComment);
router.get('/resources/:resourceId/comments', getComments);
router.patch('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);
router.post('/comments/:commentId/like', likeComment);

module.exports = router; 