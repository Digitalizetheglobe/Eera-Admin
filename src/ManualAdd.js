import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar/Sidebar";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

function ManualAdd() {
  const [formData, setFormData] = useState({
    notice_title: "",
    notice_description: "",
    date: "",
    lawyer_name: "",
    location: "",
  });

  // Check if all fields are filled
  const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      notice_description: value, // Update the description field
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://api.epublicnotices.in/notices", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        toast.success("Notice added successfully!");
        setFormData({
          notice_title: "",
          notice_description: "",
          date: "",
          lawyer_name: "",
          location: "",
        });
      }
    } catch (error) {
      console.error("Error submitting notice:", error);
      toast.error("Failed to add notice. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col mt-12">
        <div className="p-6">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-semibold">Manually Add Your Notice</h1>
          </div>
          <div className="flex justify-center items-center">
            <div className="bg-[#F7F8F9] p-6 rounded-lg shadow-md w-full max-w-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Notice Title */}
                <div className="mb-4">
                  <label className="block text-[#001A3B] font-semibold mb-1">Notice Title</label>
                  <input
                    type="text"
                    name="notice_title"
                    value={formData.notice_title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Notice Description */}
                <div className="mb-4">
                  <label className="block text-[#001A3B] font-semibold mb-1">Notice Description</label>
                  <ReactQuill
                    value={formData.notice_description}
                    onChange={handleDescriptionChange}
                    className="bg-white rounded-lg"
                    style={{ height: "200px" }}
                  />
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label className="block text-[#001A3B] font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Lawyer Name */}
                <div className="mb-4">
                  <label className="block text-[#001A3B] font-semibold mb-1">Lawyer Name</label>
                  <input
                    type="text"
                    name="lawyer_name"
                    value={formData.lawyer_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-[#001A3B] font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full mt-6 py-2 rounded-lg font-semibold text-lg transition ${isFormValid
                      ? "bg-[#004B80] text-white hover:bg-[#00365D]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
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
