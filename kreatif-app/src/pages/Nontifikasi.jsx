import React, { useEffect, useState } from "react";
import axios from "axios";

function Nontifikasi() {
  const [notifikasi, setNotifikasi] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/notifikasi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifikasi(res.data);
      } catch (err) {
        console.error("Gagal memuat notifikasi:", err);
      }
    };

    fetchNotifikasi();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Notifikasi</h1>

      {notifikasi.length === 0 ? (
        <p>Tidak ada notifikasi baru.</p>
      ) : (
        <ul className="space-y-4">
          {notifikasi.map((notif) => (
            <li key={notif.id} className="flex items-center space-x-4 p-3 bg-white shadow rounded">
              <img
                src={notif.dari_user?.profile_picture || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-bold">{notif.dari_user?.username}</span>{" "}
                  {notif.jenis === "like"
                    ? "menyukai postingan Anda"
                    : "mengomentari postingan Anda"}
                </p>
              </div>

              <img
                src={notif.karya?.file_url}
                alt="Karya"
                className="w-14 h-14 object-cover rounded"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Nontifikasi;
