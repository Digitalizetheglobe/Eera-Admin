import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import { FaSearch, FaMoon, FaBell, FaTh } from "react-icons/fa"; // You can replace these with any icons you prefer
import button from "../assests/icons/Button.png";
import button1 from "../assests/icons/Button (1).png";
import button2 from "../assests/icons/Button (2).png";
import button3 from "../assests/icons/Button (3).png";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md">
      {/* Left Side: Upload New Notices and Scan English Notices */}
      <div className="flex items-center space-x-4">
        {/* <Link
          to="/upload"
          className="flex items-center space-x-2 text-black hover:text-gray-600"
        >
          <img src={button1} className="w-8 h-8" />
          <img src={button3} className="w-8 h-8" />
          <span className="text-gray-400">Upload New Notices</span>
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-black">Scan English Notices</span> */}
      </div>

      {/* Right Side: Search Bar and Icons */}
      <div className="flex items-center space-x-6">
        {/* Search */}
        {/* <div className="bg-gray-200 flex items-center border rounded-full p-2">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none px-4"
          />
          <FaSearch />
        </div> */}

        {/* Theme Toggle Icon */}
        <button className="p-2">
        <img src={button2} className="w-8 h-8" />
        </button>

        {/* Notifications Icon */}
        <button className="p-2">
        <img src={button} className="w-8 h-8" />
        </button>

        {/* User Profile or Menu */}
        <button className="p-2">
        <img src={button1} className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
