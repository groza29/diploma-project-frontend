import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { FiMenu } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem('token'); // Check if user is logged in

  return token ? (
    <>
      <nav className="bg-gray-200 px-6 py-4 shadow-md w-full flex justify-between items-center">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-4">
          <FiMenu className="text-2xl cursor-pointer lg:hidden" />
          <Link to="/" className="text-xl font-semibold flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          </Link>
        </div>

        {/* Middle Section - Navigation */}
        <ul className="hidden lg:flex gap-6 text-gray-800 font-medium">
          {['Home', 'Posts', 'Community', 'My Profile', 'My Posts', 'Create a Post'].map(
            (item, index) => (
              <li key={index}>
                <Link
                  to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-3 py-2 rounded-md ${
                    location.pathname.includes(item.toLowerCase().replace(/\s+/g, '-'))
                      ? 'bg-teal-600 text-white'
                      : 'hover:text-teal-600'
                  }`}
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Right Section - Profile */}
        <div className="flex items-center gap-3">
          <Avatar src="/profile.jpg" alt="User Avatar" className="w-10 h-10 cursor-pointer" />
          <div className="flex flex-col">
            <span className="text-teal-600 font-semibold">USERNAME</span>
            <span className="text-gray-600 text-sm">Full name</span>
          </div>
        </div>
      </nav>
    </>
  ) : (
    <>
      <nav className="bg-gray-200 px-6 py-4 shadow-md w-full flex justify-between items-center">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-4">
          <FiMenu className="text-2xl cursor-pointer lg:hidden" />
          <Link to="/" className="text-xl font-semibold flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          </Link>
        </div>

        {/* Middle Section - Navigation */}
        <ul className="hidden lg:flex gap-6 text-gray-800 font-medium">
          {['Home', 'Posts', 'Community', 'My Profile', 'My Posts', 'Create a Post'].map(
            (item, index) => (
              <li key={index}>
                <Link
                  to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-3 py-2 rounded-md ${
                    location.pathname.includes(item.toLowerCase().replace(/\s+/g, '-'))
                      ? 'bg-teal-600 text-white'
                      : 'hover:text-teal-600'
                  }`}
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Right Section - Profile */}
        {/* <div className="flex items-center gap-3">
          <Avatar src="/profile.jpg" alt="User Avatar" className="w-10 h-10 cursor-pointer" />
          <div className="flex flex-col">
            <span className="text-teal-600 font-semibold">USERNAME</span>
            <span className="text-gray-600 text-sm">Full name</span>
          </div>
        </div> */}
      </nav>
    </>
  );
};

export default Navbar;
