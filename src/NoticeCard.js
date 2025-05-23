import React from 'react';
import { Link } from 'react-router-dom';

const NoticeCard = ({ id, title, description, newspaper_name }) => {
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white dark:border-[#EAECF0]">
      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-[#001A3B]">
        {newspaper_name}
      </h5>
      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-[#001A3B]">
        {title}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-[#001A3B99]">
        {description}
      </p>
      <div className="flex justify-between">
        <Link
          to={`/notices/${id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#004B80] rounded-lg hover:bg-[#004B80] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-[#004B80] dark:hover:bg-[#004B80] dark:focus:ring-blue-800"
        >
          Read more
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
        {/* <Link
          to={`/edit-notice/${id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
        >
          Edit Notice
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link> */}
      </div>
    </div>
  );
};

export default NoticeCard;
