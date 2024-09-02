import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const DailyNotices = () => {
    const [notices, setNotices] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('http://localhost:8000/notices');
                const today = moment().format('YYYY-MM-DD');
                const todaysNotices = response.data.filter(notice => 
                    moment(notice.date).format('YYYY-MM-DD') === today
                );
                setNotices(todaysNotices);
            } catch (error) {
                setError("Failed to fetch notices. Please try again.");
            }
        };

        fetchNotices();
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Today's Notices</h2>

            {error && <p className="text-red-500">{error}</p>}

            {notices.length > 0 ? (
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="py-3 px-6 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map((notice) => (
                            <tr key={notice.id}>
                                <td className="py-4 px-6 border-b border-gray-200">{notice.title}</td>
                                <td className="py-4 px-6 border-b border-gray-200">{moment(notice.date).format('YYYY-MM-DD')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">No notices uploaded today.</p>
            )}
        </div>
    );
};

export default DailyNotices;
