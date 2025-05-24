import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import getUserID from '../utils/User_Id';

const AvatarUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const id = getUserID(token);
    setUserId(id);
  }, []);

  // Fetch existing avatar URL
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`http://localhost:3000/avatar/${userId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        const data = await response.json();
        setAvatarUrl(data.avatarUrl);
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };

    fetchAvatar();
  }, [userId]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Upload the selected avatar
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await fetch(`http://localhost:3000/upload-avatar/${userId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) throw new Error('Failed to upload avatar');

      const data = await response.json();
      setAvatarUrl(data.avatarUrl); // Update avatar preview
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* Avatar Preview */}
      <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Avatar
          </div>
        )}
      </div>

      {/* File Input */}
      <input type="file" accept="image/*" onChange={handleFileChange} className="p-2" />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
      >
        Upload Avatar
      </button>
    </div>
  );
};

export default AvatarUpload;
