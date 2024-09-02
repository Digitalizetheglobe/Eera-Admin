import React from 'react';

function EnquiryDetails() {
    const dummyData = [
        {
          name: 'Amit Sharma',
          email: 'amit.sharma@example.com',
          mobile: '9876543210',
          address: '12 MG Road, Mumbai, MH 400001',
          status: 'Active'
        },
        {
          name: 'Priya Singh',
          email: 'priya.singh@example.com',
          mobile: '9123456789',
          address: '34 Park Street, Kolkata, WB 700016',
          status: 'Inactive'
        },
        {
          name: 'Rahul Verma',
          email: 'rahul.verma@example.com',
          mobile: '9823456780',
          address: '56 Sector 18, Noida, UP 201301',
          status: 'Pending'
        },
      ];
      

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Enquiry Details</h2>
      <table className="min-w-full bg-white border border-gray-200 mt-10">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Mobile Number</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((entry, index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-4 border-b">{entry.name}</td>
              <td className="py-2 px-4 border-b">{entry.email}</td>
              <td className="py-2 px-4 border-b">{entry.mobile}</td>
              <td className="py-2 px-4 border-b">{entry.address}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className={`px-4 py-2 rounded ${
                    entry.status === 'Active' ? 'bg-green-500 text-white' :
                    entry.status === 'Inactive' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}
                >
                  {entry.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EnquiryDetails;
