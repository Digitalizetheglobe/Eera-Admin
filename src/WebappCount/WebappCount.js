import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import frame from '../../src/assests/Frame 1618872322.png';

const WebappUploads = () => {
    const [uploadCount, setUploadCount] = useState(0);

    useEffect(() => {
        fetch("https://api.epublicnotices.in/api/request-upload-notice")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && Array.isArray(data.data)) {
                    setUploadCount(data.data.length); // Extracting count from 'data' array
                } else {
                    console.error("Unexpected API response:", data);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="w-[220px] h-[290px] rounded-[26.667px] border border-opacity-30 border-[#004B80] bg-white p-5 flex flex-col justify-between">
            <h3 className="text-[20px] font-bold font-dm-sans text-[#1B2559] leading-[42.667px] tracking-[-0.533px]">Webapp Uploads</h3>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <div className="relative w-[216px]">
                        <img
                            src={frame}
                            alt="Your Image"
                            className="mt-2 w-[260px]"
                        />
                    </div>
                    {/* Dynamic Count */}
                    <p className="text-4xl font-bold">{uploadCount}</p>
                </div>
            </div>
            <div className="flex justify-center">
                <button className="text-[#015EA1] underline text-sm font-medium">Show Webapp Request Notices &rarr;</button>
            </div>
        </div>
    );
};




const NoticesUploaded = () => {
    const notices = [
        {
            from: "Abhishak",
            count: "+100",
            time: "Today"
        },
        {
            to: "Vaishnavi",
            count: "+110",
            time: "Today"
        },
       
    ];

    return (
        <div className="w-full h-[290px] rounded-[26.667px] border border-opacity-30 border-[#004B80] bg-white p-5">
            <h3 className="text-[20px] font-bold font-dm-sans text-[#1B2559] leading-[42.667px] tracking-[-0.533px]">
                Notices Uploaded
            </h3>

            <div className="mt-4 space-y-4">
                {notices.map((notice, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div>
                            {notice.from && (
                                <p className="text-[#1B2559] text-sm">
                                <span className="font-semibold">{notice.from}</span>
                                </p>
                            )}
                            {notice.to && (
                                <p className="text-[#1B2559] text-sm">
                                 <span className="font-semibold">{notice.to}</span>
                                </p>
                            )}
                            <p className="text-[#A3AED0] text-xs">{notice.time}</p>
                        </div>
                        <p className="text-[#1B2559] text-lg font-bold">{notice.count}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-center text-[#004B80] font-medium hover:underline cursor-pointer">
                View all
            </div>
        </div>
    );
};



// ✅ Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-md p-3 rounded-lg border border-gray-300">
                <p className="text-sm font-semibold text-gray-700">{payload[0].payload.newspaper}</p>
                <p className="text-[20px] font-bold font-dm-sans text-[#1B2559] leading-[42.667px] tracking-[-0.533px]">Notices: <strong>{payload[0].value}</strong></p>
            </div>
        );
    }
    return null;
};
const VisitorInsights = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetch("https://api.epublicnotices.in/notices")
            .then((res) => res.json())
            .then((data) => {
                if (!Array.isArray(data)) {
                    console.error("API response is not an array:", data);
                    return;
                }

                const newspaperCounts = {};

                // ✅ Count notices per newspaper
                data.forEach((notice, index) => {
                    const newspaper = notice.newspaper_name?.trim() || "Unknown";

                    if (!newspaperCounts[newspaper]) {
                        newspaperCounts[newspaper] = { id: index, newspaper, count: 0 };
                    }
                    newspaperCounts[newspaper].count++;
                });

                // ✅ Convert object to array & sort by count
                const sortedData = Object.values(newspaperCounts).sort((a, b) => b.count - a.count);

                console.log("Processed Chart Data:", sortedData);
                setChartData(sortedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="w-full h-[290px] rounded-[26.437px] border border-opacity-30 border-[#004B80] bg-white p-5">
            <h3 className="text-[20px] font-bold font-dm-sans text-[#1B2559] leading-[42.667px] tracking-[-0.533px]">Notices Per Newspaper</h3>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={230}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        {/* ❌ Removed X-Axis labels but kept data */}
                        <XAxis dataKey="id" tick={false} />
                        <YAxis />
                        {/* ✅ Added Custom Tooltip */}
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#007BFF" strokeWidth={2} dot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-500">No data available</p>
            )}
        </div>
    );
};


function WebappCount() {
    return (
        <div className="grid grid-cols-5 gap-4 mt-5">
            {/* Webapp Uploads - 1 Column */}
            <div className="col-span-1"><WebappUploads /></div>

            {/* Notices Uploaded - 2 Columns */}
            <div className="col-span-2 ml-12"><NoticesUploaded /></div>

            {/* Visitor Insights - 2 Columns */}
            <div className="col-span-2"><VisitorInsights /></div>
        </div>
    );
}

export default WebappCount;



