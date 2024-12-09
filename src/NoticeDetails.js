import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      navigate('/notices');
    } catch (error) {
      console.error('Error updating notice', error);
      setError('Failed to update notice');
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
        <div className="container mx-auto">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6 bg-white shadow-lg p-6 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">Notice Title</label>
                <input
                  type="text"
                  name="notice_title"
                  value={formData.notice_title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="notice_description"
                  value={formData.notice_description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lawyer Name</label>
                <input
                  type="text"
                  name="lawyer_name"
                  value={formData.lawyer_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                  Update Notice
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
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
              <p className="text-gray-700 mb-4">
                <strong>Contact: </strong>
                <a href="mailto:contact@epublicnotices.in" className="text-blue-500 underline">
                  contact@epublicnotices.in
                </a>
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600"
              >
                Edit Notice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeDetails;
