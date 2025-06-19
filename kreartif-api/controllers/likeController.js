const { Like } = require('../models/likeModel');
const { Karya } = require('../models/karyaModel');
const { Notifikasi } = require('../models/notifikasiModel');

// POST: Like karya
exports.likeKarya = async (req, res) => {
  try {
    const { karya_id } = req.params;

    const karya = await Karya.findByPk(karya_id);
    if (!karya) return res.status(404).json({ msg: 'Karya tidak ditemukan' });

    const [like, created] = await Like.findOrCreate({
      where: { user_id: req.user.id, karya_id },
      defaults: { user_id: req.user.id, karya_id }
    });

    if (!created) return res.status(400).json({ msg: 'Sudah disukai' });

    // Tambah notifikasi setelah sukses like
    if (req.user.id !== karya.user_id) {
      await Notifikasi.create({
        user_id: karya.user_id,       
        dari_user_id: req.user.id,    
        karya_id,
        jenis: 'like',
      });
    }

    res.status(201).json({ msg: 'Liked', like });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Unlike karya
exports.unlikeKarya = async (req, res) => {
  try {
    const { karya_id } = req.params;
    const like = await Like.findOne({ where: { user_id: req.user.id, karya_id } });
    if (!like) return res.status(404).json({ msg: 'Like tidak ditemukan' });
    await like.destroy();
    res.json({ msg: 'Unliked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Jumlah like suatu karya
exports.getLikeCount = async (req, res) => {
  try {
    const { karya_id } = req.params;
    const count = await Like.count({ where: { karya_id } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Apakah user sudah like karya ini?
exports.isLikedByUser = async (req, res) => {
  try {
    const { karya_id } = req.params;
    const like = await Like.findOne({ where: { karya_id, user_id: req.user.id } });
    res.json({ liked: !!like });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Semua karya yang disukai oleh user
exports.getLikedKarya = async (req, res) => {
  try {
    const likes = await Like.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Karya, as: 'karya' }]
    });

    const karyaList = likes.map(like => like.karya); 
    res.json(karyaList);
  } catch (err) {
    console.error('getLikedKarya error:', err);
    res.status(500).json({ error: err.message });
  }
};
