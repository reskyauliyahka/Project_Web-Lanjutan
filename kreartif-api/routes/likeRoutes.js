const express = require('express');
const router = express.Router();
const {
  likeKarya,
  unlikeKarya,
  getLikeCount,
  isLikedByUser,
  getLikedKarya
} = require('../controllers/likeController');
const authenticate = require('../middleware/authenticate');

router.get('/count/:karya_id', authenticate, getLikeCount);
router.get('/check/:karya_id', authenticate, isLikedByUser);
router.get('/liked/all', authenticate, getLikedKarya);
router.post('/:karya_id', authenticate, likeKarya);
router.delete('/:karya_id', authenticate, unlikeKarya);


module.exports = router;