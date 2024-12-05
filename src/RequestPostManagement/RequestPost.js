import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';

function RequestPost() {
  const [notices, setNotices] = useState([]);  // Make sure it's initialized as an array
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch notices data from API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://api.epublicnotices.in/api/request-upload-notice");

        // Log the response to see its structure
        console.log(response.data);

        // Check if response data is an array under the 'data' key
        if (Array.isArray(response.data.data)) {
          setNotices(response.data.data);  // Store the response data in state if it's an array
        } else {
          console.error("API response is not an array", response.data);
          setNotices([]);  // Set notices to empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
        setNotices([]);  // Set notices to empty array in case of an error
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched
      }
    };
    
    fetchNotices();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Submitted Notices</h1>

        {/* If loading, show a loader */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map over the notices array and display each in a card */}
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
                    <a
                      href={notice.documentPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
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
    </div>
  );
}

export default RequestPost;
