import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar1/Navbar1";
import upload from "./assests/icons/Upload icon.png";
import { toast } from "react-toastify";

function ManualAdd() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    place: "",
    advocateName: "",
    date: "",
    advocate: null,
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("notice_title", formData.title);
    data.append("notice_description", formData.description);
    data.append("address", formData.address);
    data.append("location", formData.place);
    data.append("lawyer_name", formData.advocateName);
    data.append("date", formData.date);
    data.append("attached_file", formData.advocate);

    console.log("Form data being sent:", Object.fromEntries(data.entries())); // Log request data

    try {
      const response = await axios.post("http://api.epublicnotices.in/notices", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        console.log("API Response:", response.data);
        toast.success("Notice added successfully!"); // Success toast
        // Reset the form if needed
        setFormData({
          title: "",
          description: "",
          address: "",
          place: "",
          advocateName: "",
          date: "",
          advocate: null,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add notice. Please try again."); // Error toast
    }
  };


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col mt-12">

        <div className="p-6">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-semibold items-center">Manually Add Your Notice</h1>
          </div>

          <div className="flex justify-center items-center">
            <div className="bg-[#F7F8F9] p-6 rounded-lg shadow-md w-full max-w-2xl">
              <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center"></h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="">
                  {/* Form Inputs Section */}
                  <div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="mb-4">
                        <label className="block text-[#001A3B] font-semibold mb-1">
                          Notice Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}

                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-[#001A3B] font-semibold mb-1">
                          Notice Owner
                        </label>
                        <input
                          type="text"
                          name="advocateName"
                          value={formData.advocateName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="mb-4">
                        <label className="block text-[#001A3B] font-semibold mb-1">
                          Location
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
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
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
