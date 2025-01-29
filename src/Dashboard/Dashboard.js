import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import icon from '../assests/Group 41.png';
import icon2 from '../assests/Icon (6).png';
import icon3 from '../assests/Icon (7).png';
import icon4 from '../assests/grop41.png';
import NoticeCatTotalcounnt from "../NoticeCatTotalCount/NoticeCatTotalcounnt";
import WebappCount from "../WebappCount/WebappCount";

const Dashboard = () => {
  const [noticesToday, setNoticesToday] = useState(0);
  const [newspaperTypes, setNewspaperTypes] = useState(0);
  const [totalNotices, setTotalNotices] = useState(0);
  const [adminName, setAdminName] = useState("User"); // Default to "User" if not found

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Notices Data
        const noticesResponse = await axios.get("https://api.epublicnotices.in/notices");
        const notices = noticesResponse.data;

        // 1️⃣ Notices Added Today
        const today = new Date().toISOString().split("T")[0];
        setNoticesToday(notices.filter(notice => notice.date.includes(today)).length);

        // 2️⃣ Unique Newspapers Count
        const uniqueNewspapers = [...new Set(notices.map(notice => notice.newspaper))];
        setNewspaperTypes(uniqueNewspapers.length);

        // 3️⃣ Total Notices Count
        setTotalNotices(notices.length);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          console.error("No token found");
          return;
        }
    
        const adminResponse = await axios.get("https://api.epublicnotices.in/admin/admin-info", {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
        });
    
        // Correctly extract full_name from response
        setAdminName(adminResponse.data.admin.full_name || "User");
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };
    
    fetchDashboardData();
    fetchAdminInfo();
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-[#F7F8F9]">
        <Sidebar />
        <div className="flex-1 flex flex-col px-8">
          {/* Cards Section */}
          <div className="max-w-7xl px-5 my-8 bg-[#F7F8F9]">
            <h2 className="text-[#707EAE] font-dm-sans text-[18.667px] font-bold leading-[32px] tracking-[-0.373px]">
              Hi {adminName} ,
            </h2>
            <h1 className="text-[#2B3674] font-dm-sans text-[45.333px] font-bold leading-[56px] tracking-[-0.907px] mb-8">
              Welcome to EERA!
            </h1>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Notices Added Today */}
              <div className="flex items-center p-4 border border-[#004B804D] bg-white rounded-md">
                <img src={icon} className="w-12 h-12" />
                <div className="ml-4">
                  <div className="text-[#A3AED0] text-sm">Notices Added Today</div>
                  <div className="text-2xl font-bold text-[#1B2559]">{noticesToday}</div>
                </div>
              </div>

              {/* Newspaper Types */}
              <div className="flex items-center p-4 border border-[#004B804D] bg-white rounded-md">
                <img src={icon2} className="w-12 h-12" />
                <div className="ml-4">
                  <div className="text-[#A3AED0] text-sm">Newspaper Count</div>
                  <div className="text-2xl font-bold text-[#1B2559]">{newspaperTypes}</div>
                </div>
              </div>

              {/* Active Users (Static for now) */}
              <div className="flex items-center p-4 border border-[#004B804D] bg-white rounded-md">
                <img src={icon3} className="w-12 h-12" />
                <div className="ml-4">
                  <div className="text-[#A3AED0] text-sm">Active Users</div>
                  <div className="text-2xl font-bold text-[#1B2559]">20</div>
                </div>
              </div>

              {/* Total Notices */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0077CC] to-[#004B80] text-white rounded-lg shadow-md">
                <div>
                  <div className="text-lg font-bold">Total Notices</div>
                  <div className="text-2xl font-bold">{totalNotices}</div>
                </div>
                <img src={icon4} className="w-12 h-12 text-white" />
              </div>
            </div>

            <NoticeCatTotalcounnt />
            <WebappCount />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
