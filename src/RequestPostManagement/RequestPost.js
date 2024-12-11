import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";

function RequestPost() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://api.epublicnotices.in/api/request-upload-notice");
        if (Array.isArray(response.data.data)) {
          setNotices(response.data.data);
        } else {
          setNotices([]);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const getDocumentUrl = (path) => {
    const baseUrl = "http://api.epublicnotices.in/uploads/";
    const fileName = path.split("/").pop(); // Extract the file name
    return `${baseUrl}${fileName}`;
  };

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { mode: "no-cors" });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "document-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Error downloading image. Please try again.");
    }
  };
  const openImageInNewTab = (imageUrl) => {
    try {
      // Open the image in a new tab
      const newTab = window.open(imageUrl, "_blank");
  
      // If newTab is null, it means the browser blocked the popup. Show an error
      if (!newTab) {
        alert("Failed to open image in a new tab. Please check your browser settings.");
      }
    } catch (error) {
      console.error("Failed to open image in a new tab:", error);
      alert("Error opening image. Please try again.");
    }
  };
  
  


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 mt-12">
        <h1 className="text-3xl font-bold mb-6">Submitted Notices</h1>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">No notices to display.</div>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <h2 className="text-xl font-semibold text-gray-800">{notice.name}</h2>
                  <p className="text-sm text-gray-600">{notice.location}</p>
                  <p className="mt-2 text-gray-500">{notice.email}</p>
                  <p className="mt-4 text-gray-500">{notice.message || "No message provided"}</p>

                  <div className="mt-4">
                    <button
                      onClick={() => setSelectedDocument(getDocumentUrl(notice.documentPath))}
                      className="text-[#004B80] hover:underline"
                    >
                      View Document
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-gray-400">
                    <p>Submitted on: {new Date(notice.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{marginLeft:'311px'}}
          onClick={() => setSelectedDocument(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                Close
              </button>

            </div>
            <img
              src={selectedDocument}
              alt="Document Preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}


    </div>
  );
}

export default RequestPost;
