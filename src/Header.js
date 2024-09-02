import React from 'react';
import logo from '../src/assests/eera.png';

const Header = () => {
  return (
    <header className='shadow-md bg-white font-[sans-serif] tracking-wide relative z-50 sticky top-0'>
      <section className='flex items-center flex-wrap lg:justify-center gap-4 py-3 sm:px-10 px-4 border-gray-200 border-b min-h-[75px]'>
        <div className='left-10 absolute z-50 bg-gray-100 flex px-4 py-3 rounded max-lg:hidden'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="20px" className="cursor-pointer fill-gray-400 mr-6 rotate-90 inline-block">
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
          <input type='text' placeholder='Search...' className="outline-none bg-transparent w-full text-sm" />
        </div>
        <a href="javascript:void(0)" className="shrink-0 mx-auto">
          <img src={logo} alt="logo" className="w-16 h-16 rounded-full mx-auto" />
        </a>
        <div className="lg:absolute lg:right-10 flex items-center ml-auto space-x-8">
          <div className="inline-block cursor-pointer border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" className="hover:fill-[#007bff]">
              <circle cx="10" cy="7" r="6" data-original="#000000" />
              <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000" />
            </svg>
          </div>
        </div>
      </section>
      <div>
        <div id="collapseMenu" className='max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-40 max-lg:before:inset-0 max-lg:before:z-50'>
          <button id="toggleClose" className='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-black" viewBox="0 0 320.591 320.591">
              <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.76L268.437 8.583c11.771-11.773 30.974-11.773 42.759 0 11.774 11.787 11.774 30.917 0 42.76L51.59 311.294a30.351 30.351 0 0 1-21.199 7.289z"></path>
              <path d="M290.2 318.583c-7.829 0-15.657-2.98-21.56-8.895L8.832 60.793c-11.773-11.843-11.773-30.972 0-42.76 11.774-11.773 30.987-11.773 42.76 0L311.4 266.927c11.774 11.844 11.774 30.973 0 42.76-5.897 5.914-13.726 8.896-21.6 8.896z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
