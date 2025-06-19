const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/nontifikasiController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, notifikasiController.getNotifikasi);

module.exports = router;
