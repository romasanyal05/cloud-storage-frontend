import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();


  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/files?limit=50&page=1");
      setFiles(res.data.files || []);
    } catch (err) {
      console.log(err);
      alert("Files fetch नहीं हो पाई ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchFiles();
    // eslint-disable-next-line
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("पहले file select करो ❌");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded ✅");
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      console.log(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Move to Trash
  const handleTrash = async (id) => {
    try {
      await api.delete(`/api/files/${id}/trash`);
      fetchFiles();
    } catch (err) {
      console.log(err);
      alert("Trash में नहीं गया ❌");
    }
  };

  // ✅ Rename
  const handleRename = async (id) => {
    const newName = prompt("New file name लिखो:");
    if (!newName) return;
 
    try {
      await api.put(`/api/files/${id}/rename`, { new_name: newName });
      fetchFiles();
    } catch (err) {
      console.log(err);
      alert("Rename failed ❌");
    }
  };

  // ✅ Share
const handleShare = async (fileId) => {
  alert("Function triggered");// If this pops up, your button is fixed
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/share/${fileId}`,
        { permission: "view"},
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          }}
        
      );

      const shareToken = res.data.token;
      const shareUrl = `http://localhost:5173/share/${res.data.token}`;

    // ✅ auto copy
    await navigator.clipboard.writeText(shareUrl);

    alert("✅ Share link copied!");
    console.log("✅ Copied link:", shareUrl);

    // ✅ Optional: prompt also
    // window.prompt("Copy Share Link:", shareUrl);
      
     console.log("Share success", res.data);
    console.log("✅ FULL SHARE RESPONSE >>>", res.data);
    console.log("✅ SHARE LINK 👉", res.data.shareUrl);
     alert("✅ Share created:\n" + res.data.shareUrl); 
    } catch (err) {
      console.error("Share error:", err.response?.data || err.message);
      alert("❌ Share failed");
  }
  };
  
  // ✅ Download
    const handleDownload = async (fileId) => {
  try {
    const res = await api.get(`/api/files/${fileId}/signed-url`);
    const signedUrl = res.data.signedUrl;

    window.open(signedUrl, "_blank");
  } catch (err) {
    alert(err?.response?.data?.error || "Download failed");
  }
};

  // ✅ Open
  const handleOpen = (publicUrl) => {
    window.open(publicUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Cloud Storage Dashboard
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/trash")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600"
            >
              Trash
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Main */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ✅ Upload box */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Upload New File</h2>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full sm:w-auto border p-2 rounded-lg"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </div>

        {/* ✅ Files List */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">Your Uploaded Files</h2>

            <button
              onClick={fetchFiles}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : files.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 border rounded-lg px-4 py-3"
                >
                  {/* file info */}
                  <div>
                    <p className="font-semibold text-gray-800">{file.file_name}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(file.file_size / 1024)} KB • {file.file_type}
                    </p>
                  </div>

                  {/* action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleOpen(file.public_url)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Open
                    </button>

                    <button
                      onClick={() => handleDownload(file.id)}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Download
                    </button>

                    <button
                      onClick={() => handleRename(file.id)}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-black"
                    >
                      Rename
                    </button>

                    <button
                      onClick={() => handleShare(file.id)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                    >
                      Share
                    </button>

                    <button
                      onClick={() => handleTrash(file.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                    >
                      Trash
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}