import { useState } from 'react';
import axios from 'axios';

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);

    try {
      const response = await axios.post('https://api.epublicnotices.in/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setOcrResult(response.data); // Store the OCR response
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to process the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Upload & Read PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Read"}
      </button>

      {ocrResult && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>Extracted Text:</h3>
          <pre>{ocrResult.text}</pre>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
