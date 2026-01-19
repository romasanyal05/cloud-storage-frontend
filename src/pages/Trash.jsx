import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Trash() {
  const navigate = useNavigate();
  const [trashFiles, setTrashFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/trash");
      setTrashFiles(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Trash files fetch नहीं हो पाई ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchTrash();
    // eslint-disable-next-line
  }, []);

  // ✅ Restore file
  const handleRestore = async (id) => {
    try {
      await api.put(`/api/files/${id}/restore`);
      alert("File restored ✅");
      fetchTrash();
    } catch (err) {
      console.log(err);
      alert("Restore failed ❌");
    }
  };

  // ✅ Permanent delete
  const handlePermanentDelete = async (id) => {
    const ok = confirm("Permanent delete करना है? ये वापस नहीं आएगी ❌");
    if (!ok) return;

    try {
      await api.delete(`/api/files/${id}/permanent`);
      alert("File permanently deleted ✅");
      fetchTrash();
    } catch (err) {
      console.log(err);
      alert("Permanent delete failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Trash</h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-5">
            Deleted Files
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : trashFiles.length === 0 ? (
            <p className="text-gray-500">Trash empty ✅</p>
          ) : (
            <div className="space-y-4">
              {trashFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 border rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{file.file_name}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(file.file_size / 1024)} KB • {file.file_type}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleRestore(file.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Restore
                    </button>

                    <button
                      onClick={() => handlePermanentDelete(file.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete Forever
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