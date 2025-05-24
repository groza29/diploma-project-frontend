import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import JwtDecodeUserType from '../models/JwtDecodeUserType';
import { User } from '../models/UsersModel';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtDecodeUserType>(token);
        const userId = decoded.id;

        fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
          })
          .catch((err) => {
            console.error('Error fetching user:', err);
            setUser(null);
          });
      } catch (err) {
        console.error('Invalid token:', err);
        setUser(null);
      }
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
