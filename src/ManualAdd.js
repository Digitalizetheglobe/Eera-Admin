import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar1/Navbar1";
import upload from "./assests/icons/Upload icon.png";

function ManualAdd() {
  const [formData, setFormData] = useState({
    description: "",
    address: "",
    place: "",
    advocateName: "",
    date: "",
    advocate: null,
  });

  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.0.119:8080/api/allnotices");
        const notice = response.data;

        // Map fetched data to form fields
        setFormData({
          description: notice.notice_description || "",
          address: notice.address || "",
          place: notice.location || "",
          advocateName: notice.lawyer_name || "",
          date: notice.date ? new Date(notice.date).toISOString().split("T")[0] : "",
          advocate: null, // File uploads won't be included in the GET request
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      advocate: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("notice_description", formData.description);
    data.append("address", formData.address);
    data.append("location", formData.place);
    data.append("lawyer_name", formData.advocateName);
    data.append("date", formData.date);
    data.append("attached_file", formData.advocate);

    try {
      const response = await axios.post(
        "http://api.epublicnotices.in/notices",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Successfully submitted:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Manual Add</h1>
            <div className="flex space-x-4">
              <select
                className="border border-[#004B80] text-[#004B80] rounded px-3 py-2"
                defaultValue="English Notices"
              >
                <option value="English Notices">English Notices</option>
                <option value="Other Language">Other Language</option>
              </select>
              <button className="bg-[#004B80] text-white px-4 py-2 rounded hover:bg-[#00365D]">
                Scan Notice
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="bg-[#F7F8F9] p-6 rounded-lg shadow-md w-full max-w-5xl">
              <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center"></h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Form Inputs Section */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-[#001A3B] font-semibold mb-1">
                        Place
                      </label>
                      <input
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[#001A3B] font-semibold mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[#001A3B] font-semibold mb-1">
                        Advocate Name
                      </label>
                      <input
                        type="text"
                        name="advocateName"
                        value={formData.advocateName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[#001A3B] font-semibold mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[#001A3B] font-semibold mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      ></textarea>
                    </div>
                  </div>

                  {/* Upload File Section */}
                  <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <label className="block text-gray-700 font-semibold mb-4">
                      Attached Documents
                    </label>
                    <div className="flex flex-col items-center">
                      <div className="text-gray-500 mb-2">
                        <img src={upload} alt="upload-icon" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Drag & drop files or click the button below to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        JPEG, PNG, PDF, Docs smaller than 15MB
                      </p>
                      <div className="flex items-center justify-center mt-4 w-full">
                        <input
                          type="file"
                          name="advocate"
                          onChange={handleFileChange}
                          className="block ml-12 w-auto text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-6 py-2 bg-[#004B80] text-white rounded-lg hover:bg-[#00365D]
              transition font-semibold text-lg"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManualAdd;
