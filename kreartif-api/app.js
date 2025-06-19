const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // ganti jika frontend dihosting di domain lain
}));
app.use(express.json());

// Akses file statis yang diupload (folder uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const karyaRoutes = require('./routes/karyaRoutes');
const komentarRoutes = require('./routes/komentarRoutes');
const likeRoutes = require('./routes/likeRoutes');
const notifikasiRoutes = require('./routes/nontifikasiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/karya', karyaRoutes);
app.use('/api/komentar', komentarRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/notifikasi', notifikasiRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
