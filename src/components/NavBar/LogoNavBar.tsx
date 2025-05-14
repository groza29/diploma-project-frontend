import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ItemsNavBar from './ItemsNavBar';

const LogoNavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  const items: string[] = token
    ? ['Home', 'Posts', 'Community', 'My Profile', 'My Posts', 'Create a Post']
    : ['Home', 'Posts', 'Community'];

  return (
    <div className="relative">
      {/* Top bar */}
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          {menuOpen ? (
            <CloseIcon className="text-2xl cursor-pointer" onClick={() => setMenuOpen(false)} />
          ) : (
            <MenuIcon className="text-2xl cursor-pointer" onClick={() => setMenuOpen(true)} />
          )}
        </div>

        <Link to="/" className="text-xl font-semibold flex items-center gap-2">
          <img src="/images/doSo.svg" alt="Logo" className="lg:w-auto lg:h-16 h-32 w-32" />
        </Link>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 p-4 lg:hidden">
          <ItemsNavBar items={items} />
        </div>
      )}
    </div>
  );
};

export default LogoNavBar;
