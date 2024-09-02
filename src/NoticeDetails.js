import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NoticeDetails = ({ notices }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    notice_title: '',
    notice_description: '',
    date: '',
    lawyer_name: '',
    location: ''
  });

  useEffect(() => {
    const fetchedNotice = notices.find(notice => notice.id === parseInt(id));
    if (fetchedNotice) {
      setNotice(fetchedNotice);
      setFormData(fetchedNotice);
    } else {
      // Handle the case where the notice is not found
    }
  }, [id, notices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/notices/${id}`, formData);
      setNotice(formData);
      setIsEditing(false);
      navigate('/notices'); // Redirect after update
    } catch (error) {
      console.error("Error updating notice", error);
    }
  };

  if (!notice) {
    return <div>Notice not found</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Notice Title</label>
            <input
              type="text"
              name="notice_title"
              value={formData.notice_title}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="notice_description"
              value={formData.notice_description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm"
          >
            Update Notice
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">{notice.notice_title}</h2>
          <p className="text-gray-700 mb-4">{notice.notice_description}</p>
          <p className="text-gray-700 mb-4"><strong>Date:</strong> {new Date(notice.date).toLocaleDateString()}</p>
          <p className="text-gray-700 mb-4"><strong>Lawyer Name:</strong> {notice.lawyer_name}</p>
          <p className="text-gray-700 mb-4"><strong>Location:</strong> {notice.location}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-sm"
          >
            Edit Notice
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticeDetails;
