import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import likeIcon from "../assets/love.png";
import loveTerisiIcon from "../assets/loveterisi.png";
import commentIcon from "../assets/chat.png";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [karya, setKarya] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [komentarList, setKomentarList] = useState([]);
  const [komentarInput, setKomentarInput] = useState("");

  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("id"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchKaryaDetail();
    fetchLikeStatus();
    fetchLikeCount();
    fetchKomentarCount();
    fetchKomentar();
  }, [id]);

  const fetchKaryaDetail = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/karya/${id}`);
      if (!res.ok) throw new Error("Gagal memuat detail karya");
      const data = await res.json();
      setKarya(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/like/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLiked(data.liked);
    } catch (err) {
      console.error("Gagal memuat status like:", err);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/like/count/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLikeCount(data.count);
    } catch (err) {
      console.error("Gagal memuat jumlah like:", err);
    }
  };

  const fetchKomentarCount = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/komentar/${id}`);
      const data = await res.json();
      setCommentCount(data.length);
    } catch (err) {
      console.error("Gagal memuat jumlah komentar:", err);
    }
  };

  const fetchKomentar = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/komentar/${id}`);
      const data = await res.json();
      setKomentarList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat komentar:", err);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`http://localhost:3000/api/like/${id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Terjadi kesalahan saat like");

      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } catch (err) {
      alert("Gagal memproses like: " + err.message);
    }
  };

  const handleKomentarSubmit = async (e) => {
    e.preventDefault();
    if (!komentarInput.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/api/komentar/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isi: komentarInput }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan komentar");

      setKomentarInput("");
      fetchKomentar();
      fetchKomentarCount();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleHapusKarya = async () => {
    const konfirmasi = window.confirm("Yakin ingin menghapus karya ini?");
    if (!konfirmasi) return;

    try {
      const res = await fetch(`http://localhost:3000/api/karya/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gagal menghapus karya");
      alert("Karya berhasil dihapus");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-4">Memuat detail karya...</div>;
  if (!karya) return <div className="p-4">Karya tidak ditemukan.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 bg-white shadow rounded">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Gambar */}
        <div>
          <img
            src={karya.file_url}
            alt={karya.judul}
            className="w-full h-96 object-cover rounded"
          />
        </div>

        {/* Kolom Informasi */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{karya.judul}</h1>
            <p className="text-sm text-gray-500 mb-1">
              Kategori: <span className="font-semibold">{karya.kategori}</span>
            </p>
            <p className="text-gray-700 mb-4">{karya.deskripsi || "Tidak ada deskripsi."}</p>
          </div>

          {/* Like & Komentar */}
          <div className="mt-4 flex items-center space-x-4">
            <button onClick={handleLikeToggle} className="hover:scale-110 transition-transform">
              <img
                src={liked ? loveTerisiIcon : likeIcon}
                alt="Like"
                className="w-7 h-7"
              />
            </button>
            <span className="text-sm text-gray-600">{likeCount} suka</span>

            <img src={commentIcon} alt="Comment" className="w-6 h-6 ml-4" />
            <span className="text-sm text-gray-600">{commentCount} komentar</span>
          </div>

          {/* Tombol Edit dan Hapus */}
          {(karya.user_id === userId || role === "admin") && (
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => navigate(`/upload/${karya.id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleHapusKarya}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
              >
                Hapus
              </button>
            </div>
          )}

          {/* Form Komentar */}
          <form onSubmit={handleKomentarSubmit} className="flex space-x-2 mt-6">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Tulis komentar..."
              value={komentarInput}
              onChange={(e) => setKomentarInput(e.target.value)}
              disabled={!token}
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
              disabled={!token}
            >
              Kirim
            </button>
          </form>

          {/* List Komentar */}
          <div className="mt-4 max-h-40 overflow-y-auto">
            {komentarList.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada komentar.</p>
            ) : (
              <ul className="text-sm mt-2 space-y-3">
                {komentarList.map((kom, idx) => (
                  <li key={idx} className="flex items-start gap-2 border-b pb-2">
                    <img
                      src={kom.User?.profile_picture || "https://via.placeholder.com/40"}
                      alt={kom.User?.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{kom.User?.username || "Pengguna"}</p>
                      <p>{kom.isi}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
