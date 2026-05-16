// Listing model - Defines schema for rental listings
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Rooms', 'Furniture', 'Vehicles', 'Tools', 'Sports', 'Clothing', 'Books', 'Appliances', 'Other']
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Images array cannot be empty'
    }
  },
  rentPerDay: {
    type: Number,
    required: [true, 'Rent per day is required'],
    min: [0, 'Rent per day must be positive']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
listingSchema.index({ owner: 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ city: 1 });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
