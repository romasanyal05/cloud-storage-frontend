import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SharePage = () => {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSharedFile = async () => {
      try {
        console.log("Fetching for token:", token); // Log 1
        // Backend se data mangwa rahe hain
        const res = await axios.get(`http://localhost:5000/api/share/access/${token}`);
        console.log("Backend Response:", res.data); // Log 2
        setFile(res.data.file); 
      } catch (err) {
        console.error("Error fetching file:", err);
        setError(true);
      }
    };
    if (token) fetchSharedFile();
  }, [token]);

    const fileData = file?.file || file; 
if (error) return <h1 style={{ textAlign: "center", marginTop: "50px" }}>❌ Link invalid hai</h1>;

  if (!fileData) {
      return <h1 style={{ textAlign: "center", marginTop: "50px" }}>⏳ File dhoond rahe hain...</h1>;
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5", fontFamily: "Arial" }}>
      <div style={{ padding: "30px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center", width: "350px" }}>
        <h2 style={{ color: "#1a73e8" }}>Shared File</h2>
        <div style={{ fontSize: "50px", margin: "20px 0" }}>📄</div>
        <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "30px" }}>{fileData.file_name|| "Shared File"}</p>
        
        <a 
          href={file.public_url|| fileData.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ backgroundColor: "#1a73e8", color: "white", padding: "12px 25px", textDecoration: "none", borderRadius: "5px", fontWeight: "bold", display: "inline-block" }}
        >
          Download Karein ⬇️
        </a>
      </div>
    </div>
  );
};

export default SharePage;