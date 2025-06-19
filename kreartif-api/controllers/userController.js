const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// simpan foto profil
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Hanya file gambar yang diizinkan'), false);
  }
});

exports.uploadProfilePicture = upload.single('profile_picture');

// GET Profil saat ini
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET semua pengguna (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role'],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update profil
exports.updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const { username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password_hash = hashedPassword;
    }

    if (req.file) {
      const profileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      user.profile_picture = profileUrl;
    }

    await user.save();

    const { password_hash, ...updatedUser } = user.toJSON();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
