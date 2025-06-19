const { Notifikasi } = require('../models/notifikasiModel');
const { User } = require('../models/userModel');
const { Karya } = require('../models/karyaModel');

exports.getNotifikasi = async (req, res) => {
  try {
    const notifikasi = await Notifikasi.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'dari_user', attributes: ['id', 'username', 'profile_picture'] },
        { model: Karya, as: 'karya', attributes: ['id', 'file_url'] },
      ],
    });

    res.json(notifikasi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
