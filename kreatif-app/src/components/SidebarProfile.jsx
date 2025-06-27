// Komponen: SidebarProfil.js
import { Link, useLocation } from "react-router-dom";

const SidebarProfil = () => {
  const location = useLocation();
  const active = (path) => location.pathname === path ? "font-bold text-blue-600" : "";

  return (
    <div className="w-full md:w-1/4 p-4 shadow-md rounded-lg">
      <ul className="space-y-3 text-left text-white">
        <li><Link to="/profil" className={active("/profil")}>Profil</Link></li>
        <li><Link to="/favorit" className={active("/favorit")}>Favorit</Link></li>
        <li><Link to="/riwayat" className={active("/riwayat")}>Riwayat</Link></li>
        <li><Link to="/upload" className={active("/upload")}>Upload Karya</Link></li>
      </ul>
    </div>
  );
};

export default SidebarProfil;
