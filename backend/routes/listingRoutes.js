// Listing routes - Defines endpoints for listing operations
const express = require('express');
const router = express.Router();
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  toggleAvailability
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createListing)
  .get(getAllListings);

router.route('/:id')
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

router.patch('/:id/toggle', protect, toggleAvailability);

module.exports = router;
