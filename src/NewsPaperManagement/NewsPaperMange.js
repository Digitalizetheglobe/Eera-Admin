import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';

const NewsPaperMange = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedNewspaper, setSelectedNewspaper] = useState('');
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [cityStats, setCityStats] = useState({});
  const [totalCount, setTotalCount] = useState(0);

  const newspaperList = [
    "SAKAL", "LOKMAT", "LOKSATTA", "MAHARASHTRA TIMES", "KESARI", "PRABHAT",
    "PUNYA NAGARI", "TIMES OF INDIA", "PUDHARI", "SANDHYAANAD", "AJ KA ANANAD",
    "SAMANA", "SAKALTIMES", "NAVAKAL", "TARUN BHARAT", "DINKAR", "BHASKAR",
    "DESHDUT", "PRAHAR", "THE HINDU", "DAINIK JAGRAN", "NAVBHARAT TIMES",
    "PUNE MIRROR", "MID DAY", "MAHANAGARI", "TELEGRAPH", "DECCAN HERALD",
    "DIVYA BHASKAR", "MUMBAI MIRROR", "ECONOMIC TIMES", "INDIAN EXPRESS",
    "NATIONAL HERALD", "HINDUSTAN", "VIR ARJUN", "BANDE MATARAM", "QUAMI AWAJ",
    "INDIAN POST", "NORTHERN INDIA PATRIKA", "DAILY TELEGRAM", "PUNJAB KESARI",
    "NAVODAY", "DNA", "ARUNACHAL FRONT", "MIRROR", "THE FREE SPACE JOURNAL",
    "STAR OF MYSORE", "GUJRAT SAMACHAR", "GUJARAT MITRA", "KASHMIR TIMES", "ORISSA POST"
  ];

  const fetchNotices = () => {
    setLoading(true);
    axios
      .get('https://api.epublicnotices.in/notices')
      .then((response) => {
        setNotices(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notices:', error);
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    const filtered = notices.filter((notice) => {
      const noticeDate = new Date(notice.date).toISOString().split('T')[0];
      const matchesStartDate = startDate ? noticeDate >= startDate : true;
      const matchesEndDate = endDate ? noticeDate <= endDate : true;
      const matchesNewspaper = selectedNewspaper ? notice.newspaper_name === selectedNewspaper : true;
      return matchesStartDate && matchesEndDate && matchesNewspaper;
    });

    setFilteredNotices(filtered);
    setTotalCount(filtered.length);

    const cityCounts = filtered.reduce((acc, notice) => {
      acc[notice.location] = (acc[notice.location] || 0) + 1;
      return acc;
    }, {});

    setCityStats(cityCounts);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Newspaper Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="newspaper-name" className="block text-sm font-medium text-gray-700">
                Newspaper Name
              </label>
              <select
                id="newspaper-name"
                value={selectedNewspaper}
                onChange={(e) => setSelectedNewspaper(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Newspaper</option>
                {newspaperList.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#004B80] text-white px-4 py-2 rounded hover:bg-[#00365D] mt-5"
          >
            Submit
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg border mb-8">
              <h2 className="text-xl font-bold text-gray-700">Summary</h2>
              <p className="text-gray-700 mt-2">
                <span className="font-medium">Total Notices:</span> {totalCount}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Newspaper:</span> {selectedNewspaper || "All"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Date Range:</span> {startDate || "N/A"} - {endDate || "N/A"}
              </p>
            </div>

            {Object.keys(cityStats).length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Notice Count by City</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg border">
                  <ul className="space-y-2">
                    {Object.entries(cityStats).map(([city, count]) => (
                      <li key={city} className="text-gray-800">
                        <span className="font-medium">{city}:</span> {count} notices
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPaperMange;
