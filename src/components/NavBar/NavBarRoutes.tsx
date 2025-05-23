import React from 'react';
import GuestNavBar from './GuestNavBar';
import UserNavBar from './UserNavBar';
import AdminNavBar from './AdminNavBar';
import { jwtDecode } from 'jwt-decode';

const NavbarRoutes: React.FC = () => {
  const token = localStorage.getItem('token');
  let user: any = null;

  if (token) {
    try {
      user = jwtDecode(token);
      console.log(user);
    } catch (error) {
      console.error('Invalid token', error);
    }
  }

  return token && user ? (
    <>{user.role === 'admin' ? <AdminNavBar /> : <UserNavBar />}</>
  ) : (
    <GuestNavBar />
  );
};

export default NavbarRoutes;
