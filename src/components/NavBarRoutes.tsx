import React from 'react';
import GuestNavBar from './GuestNavBar';
import UserNavBar from './UserNavBar';
import { jwtDecode } from 'jwt-decode';
const NavbarRoutes: React.FC = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const user = jwtDecode(token!);
    console.log(user);
  }
  return token ? (
    <>
      <UserNavBar />
    </>
  ) : (
    <>
      <GuestNavBar />
    </>
  );
};

export default NavbarRoutes;
