// Conversation model - Defines schema for chat conversations between users
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validation: participants must have exactly 2 users
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('Conversation must have exactly 2 participants'));
  }
  next();
});

// Indexes for efficient queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ listing: 1, participants: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
