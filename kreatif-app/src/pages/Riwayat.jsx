import React, { useEffect, useState } from "react";
import CardKarya from "../components/CardKarya"; // Pastikan path-nya sesuai struktur proyekmu

function Riwayat() {
  const [karyaList, setKaryaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKarya = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Silakan login terlebih dahulu.");
        return;
      }

      const res = await fetch("http://localhost:3000/api/karya/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal memuat data karya.");

      const data = await res.json();
      setKaryaList(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKarya();
  }, []);

  return (
    <div className="p-6 mt-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Riwayat Karya Saya</h1>

      {loading ? (
        <p className="text-center">Memuat karya...</p>
      ) : karyaList.length === 0 ? (
        <p className="text-center">Anda belum mengunggah karya.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {karyaList.map((karya) => (
            <CardKarya key={karya.id} karya={karya} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Riwayat;
