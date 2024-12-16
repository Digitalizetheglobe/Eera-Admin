import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar/Sidebar';

const NoticeDetails = ({ notices }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    notice_title: '',
    notice_description: '',
    date: '',
    lawyer_name: '',
    location: '',
    newspaper_name: '',
  });

  useEffect(() => {
    const fetchedNotice = notices.find((notice) => notice.id === parseInt(id));
    if (fetchedNotice) {
      setNotice(fetchedNotice);
      setFormData(fetchedNotice);
    } else {
      setError('Notice not found');
    }
    setIsLoading(false);
  }, [id, notices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://api.epublicnotices.in/notices/${id}`, formData);
      setNotice(formData);
      setIsEditing(false);
      toast.success('Notice updated successfully!');
    } catch (error) {
      console.error('Error updating notice', error);
      setError('Failed to update notice');
      toast.error('Failed to update notice!');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://api.epublicnotices.in/notices/${id}`);
      console.log('Notice deleted successfully');
      toast.success('Notice deleted successfully!');
      navigate('/all-notice')
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice!');
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-6">
        <ToastContainer />
        <div className="container mx-auto">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6 bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Edit Notice</h2>
              <div>
                <label className="block mb-2 font-bold">Title</label>
                <input
                  type="text"
                  name="notice_title"
                  value={formData.notice_title}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Description</label>
                <textarea
                  name="notice_description"
                  value={formData.notice_description}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Lawyer Name</label>
                <input
                  type="text"
                  name="lawyer_name"
                  value={formData.lawyer_name}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Newspaper Name</label>
                <input
                  type="text"
                  name="newspaper_name"
                  value={formData.newspaper_name}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-[#004B80] text-white px-4 py-2 rounded hover:bg-[#00365D]"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-3xl font-bold mb-4 text-blue-700">{notice.notice_title}</h2>
              <p className="text-gray-700 mb-4">{notice.notice_description}</p>
              <p className="text-gray-700 mb-4">
                <strong>Date: </strong> {new Date(notice.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Lawyer Name: </strong> {notice.lawyer_name}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Location: </strong> {notice.location}
              </p>
              <img
                src={`http://api.epublicnotices.in/noticesimage/${notice.notices_images}`}
                alt="Notice"
                className="mb-4 w-full h-auto object-cover rounded-lg shadow-lg"
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#004B80] text-white px-4 py-2 rounded hover:bg-[#00365D]"
                >
                  Edit Notice
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Notice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeDetails;
