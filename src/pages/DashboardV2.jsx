import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DashboardV2() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ✅ states
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Drag drop UI state
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Sorting
  const [sortBy, setSortBy] = useState("az");

  // ✅ Preview Modal
  const [previewFile, setPreviewFile] = useState(null);

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  // ✅ Search
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ fetch files
  const fetchFiles = async (pageNo = page) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/files?limit=${limit}&page=${pageNo}`);
      setFiles(res.data.files || []);
    } catch (err) {
      console.log(err);
      alert("Files fetch failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchFiles(1);
    // eslint-disable-next-line
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ BuyPremium
  const handleBuyPremium = async () => {
  try {
    const res = await api.post("/api/payment/create-checkout-session", {
      fileId: "", // optional
    });

    window.location.href = res.data.url;
  } catch (err) {
    console.log(err);
    alert("Payment start failed ❌");
  }
};

  // ✅ Upload with progress bar
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", selectedFile);

      await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },

        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percent);
        },
      });

      alert("File uploaded ✅");
      setSelectedFile(null);
      fetchFiles(1);
      setPage(1);
    } catch (err) {
      console.log(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 700);
    }
  };

  // ✅ Share (as-is)
  const handleShare = async (fileId) => {
    alert("Function triggered");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/share/${fileId}`,
        { permission: "view" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const shareUrl = `http://localhost:5173/share/${res.data.token}`;
      await navigator.clipboard.writeText(shareUrl);

      alert("✅ Share link copied!");
      console.log("✅ Copied link:", shareUrl);
    } catch (err) {
      console.error("Share error:", err.response?.data || err.message);
      alert("❌ Share failed");
    }
  };

  // ✅ Trash
  const handleTrash = async (id) => {
    try {
      await api.delete(`/api/files/${id}/trash`);
      fetchFiles(page);
    } catch (err) {
      console.log(err);
      alert("Trash failed ❌");
    }
  };

  // ✅ Rename
  const handleRename = async (id) => {
    const newName = prompt("Enter new file name:");
    if (!newName) return;

    try {
      await api.put(`/api/files/${id}/rename`, { new_name: newName });
      fetchFiles(page);
    } catch (err) {
      console.log(err);
      alert("Rename failed ❌");
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

  // ✅ Preview open
  const handlePreview = async (file) => {
    try {
      const res = await api.get(`/api/files/${file.id}/signed-url`);
      setPreviewFile({ ...file, previewUrl: res.data.signedUrl });
    } catch (err) {
      alert("Preview failed ❌");
    }
  };

  // ✅ Sorting logic
  const sortedFiles = useMemo(() => {
    const result = [...files];

    if (sortBy === "az") {
      result.sort((a, b) =>
        (a.file_name || "").localeCompare(b.file_name || "")
      );
    } else if (sortBy === "za") {
      result.sort((a, b) =>
        (b.file_name || "").localeCompare(a.file_name || "")
      );
    } else if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    return result;
  }, [files, sortBy]);

  // ✅ Filtered files (Search)
  const filteredFiles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return sortedFiles;

    return sortedFiles.filter((f) => {
      const name = (f.file_name || "").toLowerCase();
      const type = (f.file_type || "").toLowerCase();
      return name.includes(q) || type.includes(q);
    });
  }, [sortedFiles, searchTerm]);

  // ✅ Next / Previous
  const handleNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFiles(nextPage);
  };

  const handlePrev = () => {
    if (page === 1) return;
    const prevPage = page - 1;
    setPage(prevPage);
    fetchFiles(prevPage);
  };

  // ✅ Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setSelectedFile(droppedFile);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearSearch = () => setSearchTerm("");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Cloud Storage (V2 - Google Style)
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

      {/* ✅ Upload section */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3">
          Upload New File
        </h2>

        {/* ✅ Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleChooseFileClick}
          className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition flex flex-col items-center justify-center text-center ${
            isDragging
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <p className="font-semibold text-gray-800">Drag & Drop files here</p>
          <p className="text-sm text-gray-500 mt-1">or click to choose file</p>

          {selectedFile && (
            <p className="mt-3 text-sm font-semibold text-blue-700">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Upload
          </button>

          <button
            onClick={() => {
              setPage(1);
              fetchFiles(1);
            }}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-black"
          >
            Refresh
          </button>
        </div>

        {/* ✅ Upload Progress Bar */}
        {uploadProgress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 mt-1">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* ✅ Files section */}
      <div className="bg-white p-5 rounded-xl shadow">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-lg font-bold text-gray-700">
            Files (Page {page})
          </h2>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* ✅ Search bar - Google Drive style */}
            <div className="relative w-full sm:w-[380px]">
              {/* 🔍 icon */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="w-full border bg-white pl-10 pr-10 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* ❌ clear */}
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
                  title="Clear"
                >
                  ✖
                </button>
              )}
            </div>

            {/* Sorting dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>

            <button
              onClick={() => fetchFiles(page)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-end gap-2 mb-3">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
          >
            Next
          </button>
        </div>

        {/* Files table */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredFiles.length === 0 ? (
          <p className="text-gray-500">
            {searchTerm ? "No matching files found." : "No files uploaded yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">Size</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border font-semibold text-gray-800">
                      {file.file_name}
                    </td>

                    <td className="p-3 border text-gray-600">{file.file_type}</td>

                    <td className="p-3 border text-gray-600">
                      {Math.round(file.file_size / 1024)} KB
                    </td>

                    <td className="p-3 border">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handlePreview(file)}
                          className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                        >
                          Preview
                        </button>

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

                        {/* ✅ Share */}
                        <button
                          onClick={() => handleShare(file.id)}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                        >
                          Share
                        </button>
                        <button
                          onClick={handleBuyPremium}
                          className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700"
>
  Upgrade
</button>

                        <button
                          onClick={() => handleTrash(file.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                        >
                          Trash
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-sm text-gray-500 mt-3">
              Showing {filteredFiles.length} file(s)
              {searchTerm ? ` (filtered from ${sortedFiles.length})` : ""}
            </p>
          </div>
        )}
      </div>

      {/* ✅ Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="font-bold text-gray-800">{previewFile.file_name}</p>
                <p className="text-sm text-gray-500">{previewFile.file_type}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(previewFile.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Download
                </button>

                <button
                  onClick={() => setPreviewFile(null)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50">
              {previewFile.file_type?.includes("pdf") ? (
                <iframe
                  title="pdf-preview"
                  src={previewFile.previewUrl}
                  className="w-full h-[500px] rounded-lg border"
                />
              ) : previewFile.file_type?.includes("image") ? (
                <img
                  src={previewFile.previewUrl}
                  alt="preview"
                  className="max-h-[500px] mx-auto rounded-lg border"
                />
              ) : (
                <div className="text-center p-10 text-gray-600">
                  Preview not supported for this file type.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}