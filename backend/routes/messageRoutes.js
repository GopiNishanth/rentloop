// Message routes - Defines endpoints for conversations and messages
const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  getMessages,
  sendMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/conversations', protect, createConversation);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id/messages', protect, getMessages);
router.post('/messages', protect, sendMessage);

module.exports = router;
