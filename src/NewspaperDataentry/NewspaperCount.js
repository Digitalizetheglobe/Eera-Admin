import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewspaperCount() {
    const [formData, setFormData] = useState({
        newspaper_name: '',
        available_notice_count: '',
        upload_notices_end_of_day: '',
        date: '',
        remark: '',
        dataentry_operator_name: '',
    });

    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 3;

    const [editData, setEditData] = useState(null); // For editing
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await axios.get('https://api.epublicnotices.in/api/newspaper/newspaper-data-entry');
            const sortedEntries = response.data.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            ); // Sort by date (latest first)
            setEntries(sortedEntries);
            setFilteredEntries(sortedEntries);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/newspaper/newspaper-data-entry', formData);
            toast.success('Data entry added successfully!');
            fetchEntries();
            setFormData({
                newspaper_name: '',
                available_notice_count: '',
                upload_notices_end_of_day: '',
                date: '',
                remark: '',
                dataentry_operator_name: '',
            });
        } catch (error) {
            toast.error('Failed to add entry. Please try again.');
            console.error('Error submitting data:', error);
        }
    };

    const openEditModal = (entry) => {
        setEditData(entry);
        setIsModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`https://api.epublicnotices.in/api/newspaper/newspaper-data-entry/${editData.id}`, editData);
            toast.success('Entry updated successfully!');
            fetchEntries();
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to update entry. Please try again.');
            console.error('Error updating data:', error);
        }
    };

    const handlePageChange = (direction) => {
        setCurrentPage((prev) => prev + direction);
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setFormData((prev) => ({
            ...prev,
            date: selectedDate,
        }));
        
        const filteredData = selectedDate
            ? entries.filter(entry => entry.date.slice(0, 10) === selectedDate)
            : entries;

        setFilteredEntries(filteredData);
        setCurrentPage(1); // Reset to the first page when date changes
    };

    const currentEntries = filteredEntries.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col mt-20 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Newspaper Data Entry</h1>

                    {/* Data Entry Form */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">
                        <div>
                            <label className="block text-gray-700">Newspaper Name</label>
                            <input
                                type="text"
                                name="newspaper_name"
                                value={formData.newspaper_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter newspaper name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Available Notice Count</label>
                            <input
                                type="number"
                                name="available_notice_count"
                                value={formData.available_notice_count}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter available notice count"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Upload Notices End of Day</label>
                            <input
                                type="number"
                                name="upload_notices_end_of_day"
                                value={formData.upload_notices_end_of_day}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter upload notices count"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Remark</label>
                            <input
                                type="text"
                                name="remark"
                                value={formData.remark}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter remarks"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Operator Name</label>
                            <input
                                type="text"
                                name="dataentry_operator_name"
                                value={formData.dataentry_operator_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Enter operator name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#004B80] text-white px-4 py-2 rounded hover:bg-[#00365D] items-center"
                        >
                            Submit
                        </button>
                    </form>

                    {/* Date Filter */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Date</h2>
                        <input
                            type="date"
                            onChange={handleDateChange}
                            value={formData.date}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Data Table */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Entries</h2>
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="min-w-full bg-white border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border px-2 py-2">#</th>
                                        <th className="border px-4 py-2">Newspaper Name</th>
                                        <th className="border px-4 py-2">Available Notice Count</th>
                                        <th className="border px-4 py-2">Upload Notices End of Day</th>
                                        <th className="border px-4 py-2">Date</th>
                                        <th className="border px-4 py-2">Remark</th>
                                        <th className="border px-4 py-2">Operator Name</th>
                                        <th className="border px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEntries.map((entry, index) => (
                                        <tr key={entry.id} className="hover:bg-gray-100">
                                            <td className="border px-4 py-2">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                                            <td className="border px-4 py-2">{entry.newspaper_name || 'N/A'}</td>
                                            <td className="border px-4 py-2">{entry.available_notice_count ?? 'N/A'}</td>
                                            <td className="border px-4 py-2">{entry.upload_notices_end_of_day ?? 'N/A'}</td>
                                            <td className="border px-4 py-2">{entry.date ? entry.date.slice(0, 10) : 'N/A'}</td>
                                            <td className="border px-4 py-2">{entry.remark || 'N/A'}</td>
                                            <td className="border px-4 py-2">{entry.dataentry_operator_name || 'N/A'}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    onClick={() => openEditModal(entry)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded-lg"
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4 px-4 mb-5">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(-1)}
                                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage}</span>
                                <button
                                    disabled={currentPage * entriesPerPage >= entries.length}
                                    onClick={() => handlePageChange(1)}
                                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Edit Entry</h3>
                                <form className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700">Newspaper Name</label>
                                        <input
                                            type="text"
                                            name="newspaper_name"
                                            value={editData.newspaper_name}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Available Notice Count</label>
                                        <input
                                            type="number"
                                            name="available_notice_count"
                                            value={editData.available_notice_count}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Upload Notices End of Day</label>
                                        <input
                                            type="number"
                                            name="upload_notices_end_of_day"
                                            value={editData.upload_notices_end_of_day}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={editData.date.slice(0, 10)}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Remark</label>
                                        <input
                                            type="text"
                                            name="remark"
                                            value={editData.remark}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Operator Name</label>
                                        <input
                                            type="text"
                                            name="dataentry_operator_name"
                                            value={editData.dataentry_operator_name}
                                            onChange={handleEditChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer />
        </>
    );
}

export default NewspaperCount;
