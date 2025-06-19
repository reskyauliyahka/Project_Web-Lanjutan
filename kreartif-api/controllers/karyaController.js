const { Karya } = require('../models/karyaModel');
const { Notifikasi } = require('../models/notifikasiModel');
const multer = require('multer');
const path = require('path');

// simpan file yang diupload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
exports.uploadMiddleware = upload.single('file'); 

// GET semua karya
exports.getAllKarya = async (req, res) => {
  try {
    const karya = await Karya.findAll();
    res.json(karya);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET karya milik user
exports.getMyKarya = async (req, res) => {
  try {
    const karya = await Karya.findAll({ where: { user_id: req.user.id } });
    res.json(karya);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET karya berdasarkan ID
exports.getKaryaById = async (req, res) => {
  try {
    const { id } = req.params;
    const karya = await Karya.findByPk(id);
    if (!karya) return res.status(404).json({ msg: 'Karya tidak ditemukan' });
    res.json(karya);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: Buat karya baru
exports.createKarya = async (req, res) => {
  try {
    const { judul, deskripsi, kategori, file_url } = req.body;

    let finalFileUrl = file_url;

    if (req.file) {
      finalFileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (!finalFileUrl) {
      return res.status(400).json({ error: 'File gambar atau URL harus disediakan.' });
    }

    const karya = await Karya.create({
      judul,
      deskripsi,
      kategori,
      file_url: finalFileUrl,
      user_id: req.user.id,
    });

    res.status(201).json(karya);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST (khusus update): Update karya (dengan FormData)
exports.updateKarya = async (req, res) => {
  try {
    const { id } = req.params;
    const karya = await Karya.findByPk(id);

    if (!karya) return res.status(404).json({ msg: 'Karya tidak ditemukan' });
    if (karya.user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Tidak diizinkan' });

    const { judul, deskripsi, kategori } = req.body;

    const updateData = {
      judul,
      deskripsi,
      kategori,
    };

    // Hanya update file_url jika ada file baru
    if (req.file) {
      updateData.file_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await karya.update(updateData);
    res.json({ msg: 'Karya berhasil diperbarui', karya });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Hapus karya dan notifikasi terkait
exports.deleteKarya = async (req, res) => {
  try {
    const { id } = req.params;
    const karya = await Karya.findByPk(id);

    if (!karya) return res.status(404).json({ msg: 'Karya tidak ditemukan' });
    if (karya.user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Tidak diizinkan' });

    // Hapus notifikasi terkait
    await Notifikasi.destroy({ where: { karya_id: id } });

    // Hapus karya
    await karya.destroy();

    res.json({ msg: 'Karya berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
