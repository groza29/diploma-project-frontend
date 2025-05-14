import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { Logout, People } from '@mui/icons-material';
import useLogout from '../../hooks/Logout';

const UserMenu = ({ user, avatarUrl }: { user: any; avatarUrl: string }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const logout = useLogout();
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="flex items-center justify-end ml-4 gap-3 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Avatar src={avatarUrl} alt="User Avatar" className="w-10 h-10" />
        <div className="flex flex-col">
          <span className="text-teal-600 font-semibold">{user?.firstName || 'Hello'}</span>
          <span className="text-gray-600 text-sm">
            {user?.lastName || 'hello'} {user?.firstName || 'hello'}
          </span>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 h-32 bg-background rounded-lg shadow-lg z-70 flex flex-col">
          <Button
            className="mt-0"
            onClick={() => {
              navigate('/my-profile');
              setMenuOpen(false);
            }}
            text="My Profile"
            nav={true}
            icon={<People />}
          />
          <Button onClick={logout} text="Log out" nav={true} icon={<Logout />} />
        </div>
      )}
    </div>
  );
};

export default UserMenu;
