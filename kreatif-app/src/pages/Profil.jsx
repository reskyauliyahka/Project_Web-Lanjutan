import React, { useEffect, useState } from "react";

function Profil() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profile_picture: null,
  });

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal memuat profil.");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
      if (formData.profile_picture) {
        data.append("profile_picture", formData.profile_picture);
      }

      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "PATCH", // ✅ sesuai dengan rute di Express
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });


      if (!res.ok) throw new Error("Gagal memperbarui profil.");
      alert("Profil berhasil diperbarui.");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <p>Memuat profil...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg text-center">
      <img
        src={
          user.profile_picture ||
          "https://via.placeholder.com/150?text=Profil"
        }
        alt="Foto Profil"
        className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
      />

      {editMode ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <div className="flex justify-center gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Edit Profil
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Profil;
