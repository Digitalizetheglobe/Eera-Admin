import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoticeCard from './NoticeCard';

function AllnoticeTable() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [noticesPerPage] = useState(10); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/notices?page=${currentPage}&limit=${noticesPerPage}`)
      .then(response => {
        const sortedNotices = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotices(sortedNotices);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching notices:', error);
        setLoading(false);
      });
  }, [currentPage, noticesPerPage]);

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredNotices = notices.filter(notice =>
    notice.notice_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notice.notice_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8" style={{backgroundColor:'#FDFFE2'}}>
      <h2 className="text-2xl font-bold mb-4" style={{ fontSize: '30px' }}>ALL NOTICES</h2><br/>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search notices..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: noticesPerPage }).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredNotices.map((notice) => (
              <NoticeCard 
                key={notice.id} 
                id={notice.id}
                title={notice.notice_title} 
                description={notice.notice_description.slice(0, 100) + '...'}
              />
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={handleNextPage} 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllnoticeTable;
