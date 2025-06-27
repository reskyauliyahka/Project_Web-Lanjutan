import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Nontifikasi from "../pages/Nontifikasi"; // Pastikan path ini benar

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifikasi, setNotifikasi] = useState([]); // <- State notifikasi

  // Ambil profil user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal memuat profil.");
        const data = await res.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Gagal mengambil data profil:", err.message);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Ambil notifikasi saat pertama render
  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/notifikasi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Gagal memuat notifikasi");
        const data = await res.json();
        setNotifikasi(data);
      } catch (err) {
        console.error("Gagal mengambil data notifikasi:", err.message);
      }
    };

    if (token) {
      fetchNotifikasi();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Cek apakah ada notifikasi belum dibaca
  const adaNotifikasiBaru = notifikasi.some((n) => n.dibaca === false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-[48px] py-4 flex justify-between items-center font-[Montserrat] bg-cover bg-center
      + border-b border-white/40
      "
        style={{ backgroundImage: "url('/bg-navbar.png')" }}
      >
      <div className="text-2xl font-bold text-white">
        <Link to="/">KreARTif</Link>
      </div>

      <div className="flex space-x-8 text-white font-medium">
        <Link to="/" className="hover:text-[#91315F]">Home</Link>
        <Link to="/gallery" className="hover:text-[#91315F]">Gallery</Link>
        <Link to="/about" className="hover:text-[#91315F]">About</Link>
      </div>

      <div className="flex items-center space-x-4 relative">
        {token ? (
          <>
            <button
              onClick={() => setShowNotif((prev) => !prev)}
              className="hover:opacity-80 transition-opacity relative"
            >
              <img
                src={
                  adaNotifikasiBaru
                    ? "/src/assets/ic_notification_active.png"
                    : "/src/assets/ic_notification.png"
                }
                alt="Notifikasi"
                className="w-12 h-6 object-contain"
              />
            </button>

            {showNotif && <Nontifikasi />}

            <Link to="/profil">
              <img
                src={
                  userProfile?.profile_picture ||
                  "/src/assets/default-profile.png"
                }
                alt="Profile"
                className="w-9 h-9 rounded-full border border-gray-300 object-cover cursor-pointer"
              />
            </Link>
          </>
        ) : (
          <Link to="/login" className="bg-[#91315F] text-white px-4 py-2 rounded hover:bg-blue-600">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
