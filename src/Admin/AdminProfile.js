import React from 'react';
import workInProgressImage from '../assests/workinprogress.png'; 

const AdminProfile = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md text-center">
        <img
          src={workInProgressImage}
          alt="Work in Progress"
          style={{ height: '500px', width: '500px', margin: '0 auto' }}
        />
      </div>
    </div>
  );
};

export default AdminProfile;
