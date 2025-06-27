import React, { useEffect, useState } from "react";
import Favorit from "./Favorit";
import Riwayat from "./Riwayat";
import UploadKarya from "./UploadKarya";
import { useLocation } from 'react-router-dom';

const ProfilPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", profile_picture: null });
  const [activeTab, setActiveTab] = useState("profil");
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace('/', '');
    setActiveTab(path || 'profil');
  }, [location]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal memuat profil");
      const data = await res.json();
      setUser(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        profile_picture: null,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profile_picture: e.target.files[0] }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", "");
      if (formData.profile_picture) {
        data.append("file", formData.profile_picture);
      }

      const res = await fetch("http://127.0.0.1:3000/api/user/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) throw new Error("Gagal update profil");
      alert("Profil berhasil diperbarui");
      fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <p className="text-center mt-8">Memuat profil...</p>;

  const displayImage = formData.profile_picture
    ? URL.createObjectURL(formData.profile_picture)
    : user.profile_picture
    ? (user.profile_picture.includes("http")
        ? user.profile_picture
        : `http://127.0.0.1:3000/${user.profile_picture}`)
    : "/profile_default.png";

  return (
    <div className="min-h-screen flex bg-gray-100 font-[Montserrat]">
      {/* Sidebar */}
      <aside className="w-64 shadow-md p-6 bg-cover bg-center mt-16 border-r border-white/50"
        style={{ backgroundImage: "url('/sidebar-bg.png')" }}>
        <div className="text-center mb-6">
          <img
            src={displayImage}
            alt="Profil"
            className="w-20 h-20 rounded-full mx-auto object-cover border border-white"
          />
          <h2 className="text-lg font-semibold text-white mt-2">{user.username}</h2>
          <p className="text-sm text-[#aeaeaf]">{user.email}</p>
        </div>
        <nav className="flex flex-col gap-3 text-white">
          <button onClick={() => setActiveTab("profil")} className={`text-left px-3 py-2 rounded ${activeTab === "profil" ? "bg-[#a159ff54] font-semibold" : "hover:bg-[#a159ff54]"}`}>
            Profil
          </button>
          <button onClick={() => setActiveTab("favorit")} className={`text-left px-3 py-2 rounded ${activeTab === "favorit" ? "bg-[#a159ff54] font-semibold" : "hover:bg-[#a159ff54]"}`}>
            Favorit
          </button>
          <button onClick={() => setActiveTab("riwayat")} className={`text-left px-3 py-2 rounded ${activeTab === "riwayat" ? "bg-[#a159ff54] font-semibold" : "hover:bg-[#a159ff54]"}`}>
            Riwayat
          </button>
          <button onClick={() => setActiveTab("upload")} className={`text-left px-3 py-2 rounded ${activeTab === "upload" ? "bg-[#a159ff54] font-semibold" : "hover:bg-[#a159ff54]"}`}>
            Upload Karya
          </button>
          <button onClick={handleLogout} className="text-left px-3 py-2 rounded hover:bg-[#7b19197c] mt-4">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-2 flex bg-cover bg-center mt-16"
        style={{ backgroundImage: "url('/profile-bg.png')" }}>
        {activeTab === "profil" && (
          <section className="w-full max-w-3xl p-8 rounded-xl shadow-lg backdrop-blur-sm text-white">
            <h1 className="text-2xl font-bold mb-6">Edit Profil</h1>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex flex-col md:flex-row items-start  gap-16">
                {/* Foto Profil Preview yang Bisa Diklik */}
                <div className="flex-shrink-0 text-center">
                  <label className="block font-medium mb-2 text-white">Foto Profil</label>
                  <img
                    src={displayImage}
                    alt="Preview"
                    className="w-48 h-48 rounded-full object-cover border-2  border-white cursor-pointer"
                    onClick={() => document.getElementById("profileInput").click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="profileInput"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="mt-2 text-xs text-white/70">Click the image to select a photo</p>
                </div>

                {/* Input Username dan Email */}
                <div className="flex-1 space-y-4 w-full">
                  <p className="text-base font-bold">Username</p>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F]"
                    placeholder="Username"
                    required
                  />
                  <p className="text-base font-bold">Email</p>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#91315F]"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>
               {/* Tombol Simpan */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "favorit" && <Favorit />}
        {activeTab === "riwayat" && <Riwayat />}
        {activeTab === "upload" && <UploadKarya />}
      </main>
    </div>
  );
};

export default ProfilPage;
