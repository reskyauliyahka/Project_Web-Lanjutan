const express = require('express');
const router = express.Router();
const komentarController = require('../controllers/komentarController');
const authenticate = require('../middleware/authenticate');

router.get('/:karya_id', komentarController.getKomentarByKarya);
router.post('/:karya_id', authenticate, komentarController.addKomentar);

module.exports = router;