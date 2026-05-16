// Message controller - Handles conversations and messages
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Create new conversation
// @route   POST /api/conversations
// @access  Private
const createConversation = async (req, res) => {
  try {
    const { listingId, participantId } = req.body;

    if (!listingId || !participantId) {
      return res.status(400).json({ message: 'Please provide listing and participant' });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      listing: listingId,
      participants: { $all: [req.user._id, participantId] }
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    // Create new conversation
    const conversation = await Conversation.create({
      listing: listingId,
      participants: [req.user._id, participantId]
    });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('listing', 'title images')
      .populate('participants', 'name profilePhoto');

    res.status(201).json(populatedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's conversations
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('listing', 'title images')
      .populate('participants', 'name profilePhoto')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error fetching conversations' });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    // Check if user is participant
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      p => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    const messages = await Message.find({ conversationId: req.params.id })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({ message: 'Please provide conversation and message text' });
    }

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      p => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      text
    });

    // Update conversation's last message
    conversation.lastMessage = text;
    conversation.updatedAt = Date.now();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePhoto');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

module.exports = {
  createConversation,
  getConversations,
  getMessages,
  sendMessage
};
