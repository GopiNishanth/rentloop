// Listing controller - Handles all listing-related operations
const Listing = require('../models/Listing');

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const { title, description, category, images, rentPerDay, city } = req.body;

    // Validate required fields
    if (!title || !description || !category || !images || !rentPerDay || !city) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate rent per day is positive
    if (rentPerDay <= 0) {
      return res.status(400).json({ message: 'Rent per day must be a positive number' });
    }

    // Create listing
    const listing = await Listing.create({
      owner: req.user._id,
      title,
      description,
      category,
      images,
      rentPerDay,
      city,
      available: true
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all listings with filters
// @route   GET /api/listings?search=&category=&city=&maxPrice=
// @access  Public
const getAllListings = async (req, res) => {
  try {
    const { search, category, city, maxPrice } = req.query;
    
    // Build query object
    let query = {};

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by city (case-insensitive)
    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }

    // Filter by max price
    if (maxPrice) {
      query.rentPerDay = { $lte: parseFloat(maxPrice) };
    }

    const listings = await Listing.find(query)
      .populate('owner', 'name email city profilePhoto')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error fetching listings' });
  }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name email city profilePhoto createdAt');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }
    res.status(500).json({ message: 'Server error fetching listing' });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (owner only)
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is owner
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    // Validate rent per day if provided
    if (req.body.rentPerDay && req.body.rentPerDay <= 0) {
      return res.status(400).json({ message: 'Rent per day must be a positive number' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email city profilePhoto');

    res.json(updatedListing);
  } catch (error) {
    console.error('Update listing error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error updating listing' });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (owner only)
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is owner
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error deleting listing' });
  }
};

// @desc    Toggle listing availability
// @route   PATCH /api/listings/:id/toggle
// @access  Private (owner only)
const toggleAvailability = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is owner
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    listing.available = !listing.available;
    await listing.save();

    res.json(listing);
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ message: 'Server error toggling availability' });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  toggleAvailability
};
