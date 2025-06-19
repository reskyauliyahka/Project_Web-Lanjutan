import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Beranda from './pages/Beranda';
import UploadKarya from './pages/UploadKarya';
import Favorit from './pages/Favorit';
import Riwayat from './pages/Riwayat';
import Profil from './pages/Profil';
import Notifikasi from './pages/Nontifikasi'; 
import Detail from "./pages/Detail";

// ⬇️ Import halaman baru
import LoginForm from './pages/Login';
import RegisterForm from './pages/Registrasi';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/upload" element={<UploadKarya />} />
        <Route path="/upload/:id" element={<UploadKarya />} />
        <Route path="/favorit" element={<Favorit />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/notifikasi" element={<Notifikasi />} />
        <Route path="/pages/Detail/:id" element={<Detail />} />
        
        {/* ✅ Rute baru untuk Login dan Register */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}

export default App;
