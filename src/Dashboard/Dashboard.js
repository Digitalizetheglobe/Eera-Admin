import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Sidebar from "../Sidebar/Sidebar";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [notices, setNotices] = useState([]);
  const [languageCounts, setLanguageCounts] = useState({
    English: 0,
    Marathi: 0,
    Hindi: 0,
    Other: 0,
  });

  useEffect(() => {
    // Fetch notices from the API
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://api.epublicnotices.in/notices");
        const data = response.data;

        // Set notices
        setNotices(data);

        // Calculate language counts
        const counts = { English: 0, Marathi: 0, Hindi: 0, Other: 0 };
        data.forEach((notice) => {
          if (/^[A-Za-z0-9\s,.'"!?;:-]+$/.test(notice.notice_title)) {
            counts.English += 1;
          } else if (/[ऀ-ॿ]/.test(notice.notice_title)) {
            counts.Hindi += 1;
          } else if (/[अ-ह]/.test(notice.notice_title)) {
            counts.Marathi += 1;
          } else {
            counts.Other += 1;
          }
        });
        
        setLanguageCounts(counts);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const chartData = {
    labels: ["English", "Hindi", "Marathi", "Other"],
    datasets: [
      {
        label: "Notices by Language",
        data: [
          languageCounts.English,
          languageCounts.Hindi,
          languageCounts.Marathi,
          languageCounts.Other,
        ],
        backgroundColor: ["#A5B4FC", "#FDBA74", "#A7F3D0", "#BFDBFE"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col mt-20 px-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Total Notices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-lg shadow-md bg-[#C9F6F9]">
            <div className="font-semibold text-xl">Total Notices</div>
            <div className="text-3xl font-bold mt-4">{notices.length}</div>
            <div className="text-green-500 flex items-center mt-4">Updating...</div>
          </div>
        </div>

        {/* Language Distribution Chart */}
        <div className="p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-bold mb-4">Notice by Language</h2>
          <div className="relative h-[170px]">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
