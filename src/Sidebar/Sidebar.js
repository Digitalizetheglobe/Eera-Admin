import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaServicestack, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa'; // Importing icons from react-icons
import logo from '../assests/WhatsApp Image 2024-10-09 at 4.07.14 PM (1) 2.svg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className="flex min-h-screen fixed relative">
      {/* Hamburger Menu */}
      <button
        className="md:hidden p-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 6.75h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-40 w-64 h-full bg-gray-800 text-white transform p-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform`}
      >
        <a href="javascript:void(0)" className="text-center mb-8">
          <img
            src={logo}
            alt="logo"
            className="w-28 inline"
          />
        </a>

        <ul className="space-y-4 p-4 mt-8">
          <li>
            <Link to="/" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaHome className="mr-4" /> {/* Home Icon */}
              Home
            </Link>
          </li>
          <li>
            <Link to="/upload-notices" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaInfoCircle className="mr-4" /> {/* About Icon */}
            Upload Notice
            </Link>
          </li>
          <li>
            <Link to="/about" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaInfoCircle className="mr-4" /> {/* About Icon */}
              About
            </Link>
          </li>
          <li>
            <Link to="/services" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaServicestack className="mr-4" /> {/* Services Icon */}
              Services
            </Link>
          </li>
          <li>
            <Link to="/contact" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaPhoneAlt className="mr-4" /> {/* Contact Icon */}
              Contact
            </Link>
          </li>
        </ul>

        {/* Divider */}
        <hr className="my-4 border-gray-600 " />

{/* Logout section placed at the bottom */}
 <div className="mt-auto">
    <ul className="space-y-4 p-4">
      <li>
        <Link
          to="/logout"
          className="flex items-center p-2 hover:bg-gray-700 rounded text-red-500"
        >
          <FaSignOutAlt className="mr-4" /> {/* Logout Icon */}
          Logout
        </Link>
      </li>
    </ul>
  </div>
      </div>

      {/* Overlay for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
