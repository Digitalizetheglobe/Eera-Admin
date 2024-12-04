import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaServicestack, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa'; // Importing icons from react-icons
import logo from '../assests/WhatsApp Image 2024-10-09 at 4.07.14 PM (1) 2.svg';
import dashboard from '../assests/icons/grid-01.png'
import wallect from '../assests/icons/wallet-01.png'
import user from '../assests/icons/users-left.png'
import scan from '../assests/icons/scan.png'
import folder from '../assests/icons/folder.png'
import pen from '../assests/icons/pen-tool-plus.png'

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
        className={`fixed md:static top-0 left-0 z-40 w-65 h-full bg-gray-800 text-white transform p-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform`}
      >
        <a
          href="javascript:void(0)"
          className="flex justify-center items-center mb-8"
        >
          <img
            src={logo}
            alt="logo"
            className="w-28 inline"
          />
        </a>

        <ul className="space-y-4 p-4 mt-8">
          <li>
            <Link to="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={dashboard} className="mr-4" /> {/* Home Icon */}
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="flex items-center p-2 rounded text-gray-400">
              Upload New Notices
            </Link>
          </li>
          <li>
            <Link to="/scan-notices1" className="flex items-center p-2 hover:bg-gray-700 rounded ml-5">
              <img src={scan} className="mr-4" /> {/* Home Icon */}
              Scan English Notices
            </Link>
          </li>
          <li>
            <Link to="/mar-hin-ocr" className="flex items-center p-2 hover:bg-gray-700 rounded ml-5">
              <img src={scan} className="mr-4" /> {/* About Icon */}
              Scan Hindi/Marathi Notices
            </Link>
          </li>
          <li>
            <Link to="/manualadd" className="flex items-center p-2 hover:bg-gray-700 rounded ml-5">
              <img src={pen} className="mr-4" /> {/* About Icon */}
              Manual notice entry
            </Link>
          </li>
          {/* <li>
            <Link to="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={user} className="mr-4" /> 
              Employee Management
            </Link>
          </li>
          <li>
            <Link to="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={user} className="mr-4" /> 
              User Management
            </Link>
          </li>
          <li>
            <Link to="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={user} className="mr-4" /> 
              Profile setting
            </Link>
          </li> */}
          <li>
            <Link to="/all-notice" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={folder} className="mr-4" /> 
              Notice Management
            </Link>
          </li>
          {/* <li>
            <Link to="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={wallect} className="mr-4" /> 
              Subscription management
            </Link>
          </li> */}
        </ul>

        {/* Divider */}
        <hr className="my-4 border-gray-600" />

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

