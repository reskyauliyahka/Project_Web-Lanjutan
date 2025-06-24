import React, { useEffect, useState } from "react";
import CardKarya from "../components/CardKarya";
import { Link } from "react-router-dom";

const Beranda = () => {
  const [karyaList, setKaryaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchKarya = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/karya");
        const data = await response.json();
        setKaryaList(data);
      } catch (error) {
        console.error("Gagal memuat data karya:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKarya();
  }, []);

  return (
    <div className="p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4">Beranda</h1>

      {/* Jika belum login, tampilkan tombol login & register */}
      {!token && (
        <div className="mb-6 bg-yellow-100 border border-yellow-300 p-4 rounded">
          <p className="mb-2 text-yellow-800 font-medium">
            Anda belum login. Untuk menyukai dan mengunggah karya, silakan masuk terlebih dahulu.
          </p>
          <div className="flex space-x-4">
            <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <p>Memuat karya...</p>
      ) : karyaList.length === 0 ? (
        <p>Tidak ada karya untuk ditampilkan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {karyaList.map((karya) => (
            <CardKarya key={karya.id} karya={karya} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Beranda;
