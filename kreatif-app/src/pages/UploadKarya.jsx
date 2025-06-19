import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UploadKarya() {
  const { id } = useParams(); // jika ada berarti mode edit
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    kategori: "",
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/karya/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            judul: data.judul || "",
            deskripsi: data.deskripsi || "",
            kategori: data.kategori || "",
            file: null, // file tidak bisa diprefill
          });
        })
        .catch((err) => console.error("Gagal mengambil data karya:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login.");
      return;
    }

    const form = new FormData();
    form.append("judul", formData.judul);
    form.append("deskripsi", formData.deskripsi);
    form.append("kategori", formData.kategori);
    if (formData.file) {
      form.append("file", formData.file);
    }

    try {
      setIsLoading(true);

      const url = id
        ? `http://localhost:3000/api/karya/update/${id}`
        : `http://localhost:3000/api/karya`;

      const res = await fetch(url, {
        method: "POST", // ✅ pakai POST untuk upload & update
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Karya ${id ? "berhasil diperbarui" : "berhasil diunggah"}!`);
        navigate("/");
      } else {
        alert("Gagal: " + (result.msg || result.error || res.statusText));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Terjadi kesalahan saat menyimpan karya.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">
        {id ? "Edit Karya" : "Upload Karya"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Judul</label>
          <input
            type="text"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Kategori</label>
          <select
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="Desain">Karya Desain</option>
            <option value="Tulisan">Tulisan</option>
            <option value="Fotografi">Fotografi</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Pilih File Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required={!id} // ⬅️ file hanya wajib saat tambah
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading
            ? "Menyimpan..."
            : id
            ? "Update Karya"
            : "Kirim Karya"}
        </button>
      </form>
    </div>
  );
}

export default UploadKarya;
