const { Komentar } = require('../models/komentarModel');
const { Karya } = require('../models/karyaModel');
const { Notifikasi } = require('../models/notifikasiModel');
const { User } = require('../models/userModel');

// GET: Semua komentar untuk suatu karya
exports.getKomentarByKarya = async (req, res) => {
  try {
    const { karya_id } = req.params;
    const komentar = await Komentar.findAll({
      where: { karya_id },
      include: [
        {
          model: User,
          attributes: ['username', 'profile_picture'], 
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(komentar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: Tambah komentar + notifikasi ke pemilik karya
exports.addKomentar = async (req, res) => {
  try {
    const { karya_id } = req.params;
    const { isi } = req.body;

    const karya = await Karya.findByPk(karya_id);
    if (!karya) return res.status(404).json({ msg: 'Karya tidak ditemukan' });

    const komentar = await Komentar.create({
      karya_id,
      user_id: req.user.id,
      isi
    });

    // Tambah notifikasi jika bukan mengomentari karya sendiri
    if (req.user.id !== karya.user_id) {
      await Notifikasi.create({
        user_id: karya.user_id,       
        dari_user_id: req.user.id,    
        karya_id,
        jenis: 'komentar',
      });
    }

    res.status(201).json(komentar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Hitung komentar untuk karya tertentu
exports.getKomentarCount = async (req, res) => {
  try {
    const { karya_id } = req.params;
    const count = await Komentar.count({ where: { karya_id } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
