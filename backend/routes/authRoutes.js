// Authentication routes - Defines endpoints for user registration and login
const express = require('express');
const router = express.Router();
const { register, login, getUserById } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', getUserById);

module.exports = router;
