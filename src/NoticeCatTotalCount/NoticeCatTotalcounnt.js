import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ArrowRight } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NoticeCatTotalcount = () => {
    const [data, setData] = useState([]);
    const [totalNotices, setTotalNotices] = useState(0);
    const [toDateNotices, setToDateNotices] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);

    const fetchData = (date) => {
        // Fetch data from API
        fetch('https://api.epublicnotices.in/notices')
            .then(response => response.json())
            .then(data => {
                // Convert selected date to ISO format (e.g., "2025-01-30")
                const selectedDateISO = date.toISOString().split('T')[0];

                // Filter data for the selected date
                const filteredData = data.filter(notice => {
                    const noticeDate = new Date(notice.date).toISOString().split('T')[0];
                    return noticeDate === selectedDateISO;
                });

                // Calculate total notices and to-date notices
                setTotalNotices(data.length); // Total notices in the entire dataset
                setToDateNotices(filteredData.length); // Notices for the selected date

                // Process data to get counts per newspaper for the selected date
                const counts = filteredData.reduce((acc, notice) => {
                    acc[notice.newspaper_name] = (acc[notice.newspaper_name] || 0) + 1;
                    return acc;
                }, {});

                // Transform data for the chart
                const chartData = Object.keys(counts).map(key => ({
                    name: key,
                    count: counts[key]
                }));

                setData(chartData);
            });
    };

    const [categories, setCategories] = useState([
        { name: "Legal Notice", notes: 400 },
        { name: "Planning Applications", notes: 480 },
        { name: "Government Notice", notes: 460 },
        { name: "Financial Notice", notes: 480 },
        { name: "Environmental Notice", notes: 480 },
    ]);

    return (
        <>
            <div className="grid grid-cols-5 gap-4 mt-10">
                {/* Total Notices and To Date Section */}
                <div className="col-span-3 bg-white p-6 rounded-[26.667px] border border-[rgba(0,75,128,0.30)] shadow-md">
                    <div className="flex justify-between mb-6">
                        <div>
                            {/* "text-[20px] font-bold font-dm-sans text-[#1B2559] leading-[42.667px] tracking-[-0.533px]" */}
                            <h2 className="text-lg font-semibold font-dm-sans text-[#1B2559]">Notice Data</h2>
                            <p className="text-2xl font-bold text-[#1B2559]">{toDateNotices}</p>
                        </div>
                        <div>
                            {/* Date Picker */}
                            <div className="mb-6 ">
                                <label className="block text-sm font-medium font-dm-sans text-[#1B2559]">Select Date</label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="mt-1 block w-[120px] p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Graph Section */}
                    <BarChart
                        width={500}
                        height={200}
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" hide={true} /> {/* Hide XAxis labels */}
                        <YAxis />
                        <Tooltip
                            content={({ payload }) => {
                                if (payload && payload.length > 0) {
                                    return (
                                        <div className="bg-white p-2 border border-gray-300 rounded shadow">
                                            <p>{payload[0].payload.name}</p> {/* Show newspaper name on hover */}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="#004B80" />
                    </BarChart>
                </div>

                {/* Category Section */}
                <div className="p-6 bg-white rounded-[26.667px] border border-[rgba(0,75,128,0.30)] shadow-md w-[320px] ml-10">
                    <h2 className="text-[20px] font-bold font-dm-sans text-[#1B2559] leading-[42.667px] tracking-[-0.533px] ">Notices by Category</h2>

                    {categories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg mb-2 border-l-4 border-blue-600">
                            <span className="text-gray-700 text-sm">{category.name}</span>
                            <span className="text-gray-900 font-semibold">{category.notes}</span>
                        </div>
                    ))}

                    <div className="mt-4 flex items-center text-blue-600 font-medium hover:underline cursor-pointer">
                        View all Categories <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default NoticeCatTotalcount;