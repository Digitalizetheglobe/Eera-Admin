import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

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
        <div className="w-[220px] h-[310px] rounded-[26.667px] border border-opacity-30 border-[#004B80] bg-white p-5 flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-center">Webapp Uploads</h3>
            <div className="flex flex-col items-center">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-2" width="220" viewBox="0 0 351 258" fill="none">
                        <path d="M7.9654 73.3901C-1.6616 83.8965 -14.4976 74.8493 -19.7122 69.0125L-51 237.239L361.156 256C363.763 179.496 365.609 23.6101 352.131 12.1032C335.284 -2.28045 326.86 24.6107 323.852 32.7406C320.843 40.8705 310.614 47.1243 302.191 44.6228C293.767 42.1213 275.716 73.3901 263.081 80.8946C250.446 88.3991 232.997 47.1243 225.175 40.2452C217.353 33.3661 210.734 48.375 207.726 47.1243C204.717 45.8735 192.082 6.47482 183.057 7.10019C174.031 7.72557 166.209 44.6228 159.591 40.2452C152.972 35.8676 145.752 69.0125 123.489 90.9006C101.227 112.789 92.2017 7.72559 80.1679 2.72258C68.1342 -2.28043 64.524 19.6077 52.4903 40.2452C40.4565 60.8826 35.0414 45.2482 31.4312 40.2452C27.8211 35.2422 19.9992 60.2572 7.9654 73.3901Z"
                            fill="url(#paint0_linear_17_5321)" stroke="url(#paint1_linear_17_5321)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="paint0_linear_17_5321" x1="156.582" y1="-22.3897" x2="156.582" y2="205.345" gradientUnits="userSpaceOnUse">
                                <stop offset="0.00899963" stopColor="#004B80" stopOpacity="0.1" />
                                <stop offset="1" stopColor="#E9E3FF" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_17_5321" x1="156" y1="2" x2="156" y2="256" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#015EA1" />
                                <stop offset="1" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                {/* Dynamic Count */}
                <p className="text-4xl font-bold">{uploadCount}</p>
            </div>
            <div className="flex justify-center mt-2">
                <button className="text-[#015EA1] underline text-sm font-medium">Show Webapp Request Notices &rarr;</button>
            </div>
        </div>
    );
};




const NoticesUploaded = () => (
    <div className="w-full h-[310px] rounded-[26.667px] border border-opacity-30 border-[#004B80] bg-white p-5">
        <h3 className="text-lg font-semibold">Notices Uploaded</h3>

    </div>
);


// ✅ Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-md p-3 rounded-lg border border-gray-300">
                <p className="text-sm font-semibold text-gray-700">{payload[0].payload.newspaper}</p>
                <p className="text-sm text-gray-500">Notices: <strong>{payload[0].value}</strong></p>
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
        <div className="w-full h-[310px] rounded-[26.437px] border border-opacity-30 border-[#004B80] bg-white p-5">
            <h3 className="text-lg font-semibold mb-3">Notices Per Newspaper</h3>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
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



