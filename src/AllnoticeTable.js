import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoticeCard from './NoticeCard';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar1/Navbar1';
import { useNavigate } from 'react-router-dom';

function AllnoticeTable() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Default to current date in YYYY-MM-DD format
  });
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.epublicnotices.in/notices`)
      .then((response) => {
        const sortedNotices = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotices(sortedNotices);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notices:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredNotices = notices.filter((notice) => {
    const noticeDate = new Date(notice.date).toISOString().split('T')[0]; // Format notice date to YYYY-MM-DD
    const matchesDate = selectedDate ? noticeDate === selectedDate : true;
    const matchesSearch =
      (notice.notice_title?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
      (notice.notice_description?.toLowerCase() ?? '').includes(searchQuery.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const handleCardClick = (id) => {
    navigate(`/notices/${id}`); // Redirect to a new page with the notice ID
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto mt-8 px-4">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontSize: '30px' }}>
            ALL-NOTICES
          </h2>
          <div className="flex flex-wrap items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <label htmlFor="date-picker" className="text-gray-600 font-medium">
                Select Date:
              </label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4 sm:mt-0 text-lg text-gray-700">
              <span className="font-semibold">Notice Count:</span> {filteredNotices.length}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleCardClick(notice.id)}
                  className="cursor-pointer"
                >
                  <NoticeCard
                    id={notice.id}
                    title={notice.notice_title}
                    description={(notice.notice_description ?? '').slice(0, 100) + '...'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllnoticeTable;
