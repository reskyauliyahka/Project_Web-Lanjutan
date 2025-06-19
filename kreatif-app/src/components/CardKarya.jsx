import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import likeIcon from "../assets/love.png";
import loveTerisiIcon from "../assets/loveterisi.png";
import commentIcon from "../assets/chat.png";

const CardKarya = ({ karya, onLikeToggle }) => {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [komentarList, setKomentarList] = useState([]);
  const [komentarInput, setKomentarInput] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLikeStatus();
    fetchLikeCount();
    fetchKomentarCount();
    if (showComment) fetchKomentar();
  }, [karya.id, showComment]);

  const fetchLikeStatus = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/like/check/${karya.id}`, {
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
      const res = await fetch(`http://localhost:3000/api/like/count/${karya.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLikeCount(data.count);
    } catch (err) {
      console.error("Gagal memuat jumlah like:", err);
    }
  };

  const fetchKomentar = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/komentar/${karya.id}`);
      const data = await res.json();
      setKomentarList(data);
    } catch (err) {
      console.error("Gagal memuat komentar:", err);
    }
  };

  const fetchKomentarCount = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/komentar/${karya.id}`);
      const data = await res.json();
      setCommentCount(data.length);
    } catch (err) {
      console.error("Gagal memuat jumlah komentar:", err);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`http://localhost:3000/api/like/${karya.id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Terjadi kesalahan saat like");
      }

      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
      if (onLikeToggle) onLikeToggle();
    } catch (err) {
      alert("Gagal memproses like: " + err.message);
    }
  };

  const handleKomentarSubmit = async (e) => {
    e.preventDefault();
    if (!komentarInput.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/api/komentar/${karya.id}`, {
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

  return (
    <div className="bg-white p-4 shadow rounded flex flex-col justify-between">
      <img
        src={karya.file_url}
        alt={karya.judul}
        className="w-full h-48 object-cover rounded mb-2"
      />

      <h2 className="text-lg font-semibold line-clamp-2">{karya.judul}</h2>
      <p className="text-sm text-gray-600 mb-2">{karya.kategori}</p>

      <div className="mt-auto flex justify-between items-center">
        <button
          onClick={() => navigate(`/pages/Detail/${karya.id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Detail
        </button>

        <div className="flex items-center space-x-2">
          <button onClick={handleLikeToggle} className="hover:scale-110 transition-transform">
            <img
              src={liked ? loveTerisiIcon : likeIcon}
              alt="Like"
              className="w-6 h-6"
            />
          </button>
          <span className="text-sm text-gray-600">{likeCount}</span>

          <button
            onClick={() => navigate(`/pages/Detail/${karya.id}`)}
            className="hover:scale-110 transition-transform"
          >
            <img src={commentIcon} alt="Comment" className="w-6 h-6" />
          </button>

          <span className="text-sm text-gray-600">{commentCount}</span>
        </div>
      </div>

      {showComment && (
        <div className="mt-4">
          <div className="mt-2 max-h-32 overflow-y-auto">
            {komentarList.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">Belum ada komentar.</p>
            ) : (
              <ul className="text-sm mt-2 space-y-1">
                {komentarList.map((kom, idx) => (
                  <li key={idx} className="border-b pb-1">
                    {kom.isi}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardKarya;
