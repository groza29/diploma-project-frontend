import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import JwtDecodeUserType from '../models/JwtDecodeUserType';

interface AvatarContextType {
  avatarUrl: string;
  updateAvatar: () => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode<JwtDecodeUserType>(token) : null;
  const [avatarUrl, setAvatarUrl] = useState('');

  const updateAvatar = () => {
    if (user) {
      setAvatarUrl(`http://localhost:3000/avatar/${user.id}?t=${new Date().getTime()}`);
    }
  };

  useEffect(() => {
    if (user) {
      updateAvatar();
    }
  }, []);

  return (
    <AvatarContext.Provider value={{ avatarUrl, updateAvatar }}>{children}</AvatarContext.Provider>
  );
};

export const useAvatar = (): AvatarContextType => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};
