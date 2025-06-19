import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">
        <Link to="/">KreARTif</Link>
      </div>
      <div className="flex space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-500 transition-colors">Beranda</Link>
        <Link to="/upload" className="hover:text-blue-500 transition-colors">Upload Karya</Link>
        <Link to="/favorit" className="hover:text-blue-500 transition-colors">Favorit</Link>
        <Link to="/riwayat" className="hover:text-blue-500 transition-colors">Riwayat</Link>
        <Link to="/profil" className="hover:text-blue-500 transition-colors">Profil</Link>
        <Link to="/notifikasi" className="hover:text-blue-500 transition-colors">Notif</Link>
      </div>
    </nav>
  );
};

export default Navbar;
