import { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    // Send file to Node.js backend
    const formData = new FormData();
    formData.append('pdf', uploadedFile);

    try {
      const response = await axios.post('https://api.epublicnotices.in/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data); // Handle response, show OCR results
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <input type="file" accept=".pdf" onChange={handleFileUpload} />
  );
};
export default FileUpload; 