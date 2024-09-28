import React from 'react';
import profileimg from '../assests/profileimg.jpg';

const AdminProfile = () => {
  return (
    <div className="flex flex-col md:flex-row w-full h-auto p-6 bg-gray-100">
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row max-w-6xl">
        <div className=" md:border-r border-gray-200 p-4 md:p-6 md:w-1/3">
          <img 
            src={profileimg} 
            alt="Profile" 
            className="w-24 h-24 rounded-full mx-auto mb-4" 
          />
          <h2 className="text-xl font-semibold text-center mb-2">Ludmila Sidorshina</h2>
          <p className="text-center text-gray-500 mb-4">ludmilasidorshina@gmail.com</p>
          <div className="flex justify-between items-center text-center mb-4">
            <div>
              <span className="block text-xl font-bold">5</span>
              <span className="text-gray-500">Past</span>
            </div>
            <div className="h-10 w-px bg-gray-500 mx-4"></div>
            <div>
              <span className="block text-xl font-bold">2</span>
              <span className="text-gray-500">Upcoming</span>
            </div>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Log Out
          </button>
        </div>
        <div className="w-full md:w-2/3 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm text-gray-500">Gender</h3>
              <p className="font-medium">Female</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Birthday</h3>
              <p className="font-medium">Oct. 25, 1992</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Phone number</h3>
              <p className="font-medium">(063) 222-3333</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Address</h3>
              <p className="font-medium">Sonyachna str. 226B</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">City</h3>
              <p className="font-medium">Kharkiv</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">ZIP Code</h3>
              <p className="font-medium">61129</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Registration date</h3>
              <p className="font-medium">Oct. 25, 1998</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Member status</h3>
              <p className="font-medium">Active member</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3 p-6 rounded-lg bg-gray-200 mt-6 md:mt-0 md:ml-4">
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>This patient needs to get full amount of tests</li>
            <li>Tincidunt tincidunt fermentum odio pulvinar eget mauris lorem ipsum</li>
            <li>Attention to fermentum odio pulvinar</li>
            <li>Allergic reaction to penicillin</li>
          </ul>
          <button className="mt-4 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600">
            Save 
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
