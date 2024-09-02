
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
// import tele from './telegram.json';
import { Link } from 'react-router-dom';
import DailyNotices from './DailyNotices';
// import MultipleAreaCharts from './ChartData/MultipleAreaCharts';
// import MultipleBarCharts from '../ChartData/MultipleAreaCharts';

function EmployeeDashboard() {
    const [noticesCount, setNoticesCount] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:8000/notices')
            .then(response => {
                setNoticesCount(response.data.length);
            })
            .catch(error => {
                console.error('Error fetching notices data:', error);
            });
    }, []);

    return (
        <>
            <div className="bg-gray-50 p-8 min-h-[200px] flex items-center justify-center font-[sans-serif] text-[#333]">
                <div className="bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.2)] grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-24 gap-12 rounded-3xl px-20 py-10 border border-yellow-500">
                    <div className="text-center">
                        <h3 className="text-4xl font-extrabold">{noticesCount} <span className="text-blue-600">+</span></h3>
                        <p className="text-gray-500 font-semibold mt-3">Notices Publish Till Date</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-4xl font-extrabold">10 <span className="text-blue-600">+</span></h3>
                        <p className="text-gray-500 font-semibold mt-3">Employee Todays Ssan Report</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-4xl font-extrabold">0 </h3>
                        <p className="text-gray-500 font-semibold mt-3">Objection Raised</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-4xl font-extrabold">3 <span className="text-blue-600">+</span></h3>
                        <p className="text-gray-500 font-semibold mt-3">All Categeory</p>
                    </div>
                </div>
            </div>

<DailyNotices/>

            <div className="bg-white font-[sans-serif] flex max-lg:flex-col px-4 my-8 gap-12 max-w-[1400px] mx-auto" style={{marginBottom:'200px'}}>
                <div>
                    <h4 className="text-gray-800 text-4xl font-extrabold mb-6">Transforming Public Notices into Accessible Digital Records </ h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Welcome to the EERA Public Notice Application, a cutting-edge platform designed to digitize and streamline the dissemination of public notices.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-md:max-w-lg mx-auto">
                    <div className="text-left bg-blue-50 rounded-lg shadow p-6 border border-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-blue-600 w-12 inline-block bg-white p-3 rounded-full" viewBox="0 0 32 32">
                            <path d="M28.068 12h-.128a.934.934 0 0 1-.864-.6.924.924 0 0 1 .2-1.01l.091-.091a2.938 2.938 0 0 0 0-4.147l-1.511-1.51a2.935 2.935 0 0 0-4.146 0l-.091.091A.956.956 0 0 1 20 4.061v-.129A2.935 2.935 0 0 0 17.068 1h-2.136A2.935 2.935 0 0 0 12 3.932v.129a.956.956 0 0 1-1.614.668l-.086-.091a2.935 2.935 0 0 0-4.146 0l-1.516 1.51a2.938 2.938 0 0 0 0 4.147l.091.091a.935.935 0 0 1 .185 1.035.924.924 0 0 1-.854.579h-.128A2.935 2.935 0 0 0 1 14.932v2.136A2.935 2.935 0 0 0 3.932 20h.128a.934.934 0 0 1 .864.6.924.924 0 0 1-.2 1.01l-.091.091a2.938 2.938 0 0 0 0 4.147l1.51 1.509a2.934 2.934 0 0 0 4.147 0l.091-.091a.936.936 0 0 1 1.035-.185.922.922 0 0 1 .579.853v.129A2.935 2.935 0 0 0 14.932 31h2.136A2.935 2.935 0 0 0 20 28.068v-.129a.956.956 0 0 1 1.614-.668l.091.091a2.935 2.935 0 0 0 4.146 0l1.511-1.509a2.938 2.938 0 0 0 0-4.147l-.091-.091a.935.935 0 0 1-.185-1.035.924.924 0 0 1 .854-.58h.128A2.935 2.935 0 0 0 31 17.068v-2.136A2.935 2.935 0 0 0 28.068 12ZM29 17.068a.933.933 0 0 1-.932.932h-.128a2.956 2.956 0 0 0-2.083 5.028l.09.091a.934.934 0 0 1 0 1.319l-1.511 1.509a.932.932 0 0 1-1.318 0l-.09-.091A2.957 2.957 0 0 0 18 27.939v.129a.933.933 0 0 1-.932.932h-2.136a.933.933 0 0 1-.932-.932v-.129a2.951 2.951 0 0 0-5.028-2.082l-.091.091a.934.934 0 0 1-1.318 0l-1.51-1.509a.934.934 0 0 1 0-1.319l.091-.091A2.956 2.956 0 0 0 4.06 18h-.128A.933.933 0 0 1 3 17.068v-2.136A.933.933 0 0 1 3.932 14h.128a2.956 2.956 0 0 0 2.083-5.028l-.09-.091a.933.933 0 0 1 0-1.318l1.51-1.511a.932.932 0 0 1 1.318 0l.09.091A2.957 2.957 0 0 0 14 4.061v-.129A.933.933 0 0 1 14.932 3h2.136a.933.933 0 0 1 .932.932v.129a2.956 2.956 0 0 0 5.028 2.082l.091-.091a.932.932 0 0 1 1.318 0l1.51 1.511a.933.933 0 0 1 0 1.318l-.091.091A2.956 2.956 0 0 0 27.94 14h.128a.933.933 0 0 1 .932.932Z" data-original="#000000" />
                            <path d="M16 9a7 7 0 1 0 7 7 7.008 7.008 0 0 0-7-7Zm0 12a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5Z" data-original="#000000" />
                        </svg>
                        <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">Go to Manual Add</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Manually input public notice details with our user-friendly form for precise and complete entries.</p>
                        <Link to="/manualadd">
                            <button type="button" className="text-gray-800 border border-gray-300 px-4 py-2 rounded-lg font-bold flex items-center text-sm mt-6 hover:bg-white">
                                Add Now <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" class="rotate-90 ml-1.5"><path fill="#333" d="M12.006 1a1 1 0 0 1 .838.463l7 11a1 1 0 0 1-.985 1.527l-3.364-.48a.434.434 0 0 0-.495.43V20c0 1.645-1.355 3-3 3s-3-1.355-3-3v-6.06a.434.434 0 0 0-.495-.43l-3.364.48a1 1 0 0 1-.985-1.527l7-11a1 1 0 0 1 .85-.463z" data-original="#000000" paint-order="fill markers stroke"></path></svg>
                            </button>
                        </Link>
                    </div>

                    <div className="text-left bg-blue-50 rounded-lg shadow p-6 border border-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 inline-block bg-white p-3 rounded-full" viewBox="0 0 682.667 682.667">
                            <defs>
                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                    <path d="M0 512h512V0H0Z" data-original="#000000" />
                                </clipPath>
                            </defs>
                            <g fill="none" className="stroke-blue-600" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="40" clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                <path d="M256 492 60 410.623v-98.925C60 183.674 137.469 68.38 256 20c118.53 48.38 196 163.674 196 291.698v98.925z" data-original="#000000" />
                                <path d="M178 271.894 233.894 216 334 316.105" data-original="#000000" />
                            </g>
                        </svg>
                        <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">  Go to OCR</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Upload notices and let our OCR technology automatically scan and convert them into digital text, saving time and reducing errors.</p>
                        <Link to="/ocrpage">
                            <button type="button" className="text-gray-800 border border-gray-300 px-4 py-2 rounded-lg font-bold flex items-center text-sm mt-6 hover:bg-white">
                                Add Now <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" class="rotate-90 ml-1.5"><path fill="#333" d="M12.006 1a1 1 0 0 1 .838.463l7 11a1 1 0 0 1-.985 1.527l-3.364-.48a.434.434 0 0 0-.495.43V20c0 1.645-1.355 3-3 3s-3-1.355-3-3v-6.06a.434.434 0 0 0-.495-.43l-3.364.48a1 1 0 0 1-.985-1.527l7-11a1 1 0 0 1 .85-.463z" data-original="#000000" paint-order="fill markers stroke"></path></svg>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            {/* <MultipleBarCharts /> */}




        </>
    );
}

export default EmployeeDashboard;
