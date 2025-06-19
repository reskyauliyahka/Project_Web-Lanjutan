const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// GET profil sendiri
router.get('/me', authenticate, userController.getMe);

// PATCH untuk update profil sendiri dengan upload file
router.patch(
  '/me',
  authenticate,
  userController.uploadProfilePicture,
  userController.updateMe
);

// GET semua user (admin)
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);

module.exports = router;
