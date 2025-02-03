import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa'; // Importing necessary icon
import logo from '../assests/WhatsApp Image 2024-10-09 at 4.07.14 PM (1) 2.svg';
import dashboard from '../assests/icons/grid-01.png';
import wallect from '../assests/icons/wallet-01.png';
import user from '../assests/icons/users-left.png';
import scan from '../assests/icons/scan.png';
import folder from '../assests/icons/folder.png';
import pen from '../assests/icons/pen-tool-plus.png';
import group1 from '../assests/Group 1.png';
import group2 from '../assests/Group 2.png';
import group3 from '../assests/Group 3.png'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    setModalOpen(true); // Open the modal
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect after logout
  };

  return (
    <div className="flex min-h-screen fixed relative">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-40 w-30 h-full bg-gray-800 text-white transform p-6 ${isOpen ? "translate-x-0" : "-translate-x-full"
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
            <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={dashboard} className="mr-4" />
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/scannotice" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={scan} className="mr-4" />
              Scan Your Notices
            </Link>
          </li>

          <li>
            <Link to="/manualadd" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={pen} className="mr-4" />
              Manual Notice Entry
            </Link>
          </li>

          <li>
            <Link to="/all-notice" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={folder} className="mr-4" />
              Notice Management
            </Link>
          </li>
          <li>
            <Link to="/NewsPaperMange" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={folder} className="mr-4" />
              News Paper Management
            </Link>
          </li>
          <li>
            <Link to="/requestpost" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={folder} className="mr-4" />
              Post Notice Management
            </Link>
          </li>
          {/* <li>
            <Link to="/active-user" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={folder} className="mr-4" />
              Active User Management
            </Link>
          </li> */}
          <li>
            <Link to="/NewspaperCount" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <img src={folder} width={30} className="mr-4" />
              Daily Newspaper Count
            </Link>
          </li>
        </ul>

        <hr className="my-4 border-gray-600" />
        <div className="mt-auto">
          <ul className="space-y-4 p-4">
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 hover:bg-gray-700 rounded text-red-500"
              >
                <FaSignOutAlt className="mr-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-10">
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                      <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        Confirm Logout
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to log out? You will need to log in again to access your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={confirmLogout}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Sidebar;
