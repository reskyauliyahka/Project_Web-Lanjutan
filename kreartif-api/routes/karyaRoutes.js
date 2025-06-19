const express = require('express');
const router = express.Router();
const karyaController = require('../controllers/karyaController');
const likeController = require('../controllers/likeController');
const authenticate = require('../middleware/authenticate');

// GET semua karya
router.get('/', karyaController.getAllKarya);

// GET karya milik user yang login
router.get('/me', authenticate, karyaController.getMyKarya);

// GET karya berdasarkan ID
router.get('/:id', karyaController.getKaryaById);

// POST: Buat karya baru (dengan upload file)
router.post(
  '/',
  authenticate,
  karyaController.uploadMiddleware, // middleware multer
  karyaController.createKarya
);

// POST (update karya dengan file jika ada)
router.post(
  '/update/:id',
  authenticate,
  karyaController.uploadMiddleware,
  karyaController.updateKarya
);

// DELETE karya
router.delete('/:id', authenticate, karyaController.deleteKarya);

// Like dan Unlike karya
router.post('/:karya_id/like', authenticate, likeController.likeKarya);
router.delete('/:karya_id/like', authenticate, likeController.unlikeKarya);

module.exports = router;
