import { jwtDecode } from 'jwt-decode';
import JwtDecodeUserType from '../models/JwtDecodeUserType';
import Image from '../components/Image';
import { FileUpload, Instagram, PlaceOutlined } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useAvatar } from '../context/AvatarContext';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Rating } from '@mui/material';
import { useEffect, useState } from 'react';
import { User } from '../models/UsersModel';
import ProfileJob from '../components/ProfileJob';
import { Job } from '../models/JobType';
import getAccountAge from '../utils/AccountAge';

const MyProfile: React.FC = () => {
  const { avatarUrl, updateAvatar } = useAvatar();
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode<JwtDecodeUserType>(token) : null;
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (selectedFile: File) => {
    if (!selectedFile) {
      Swal.fire('Error', 'Please select an image first!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await fetch(`http://localhost:3000/upload-avatar/${user?.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload avatar');

      updateAvatar();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Swal.fire('Error', 'Failed to upload avatar', 'error');
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${user?.id}`);
        if (!response.ok) throw new Error('failed to fetch the user');

        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUser();
    console.log(userData);
  }, []);
  if (loading) return <p>Loading user...</p>;
  if (error) return <p>Error: {error}</p>;

  const openUpdateAvatar = async () => {
    const { value: file } = await Swal.fire({
      title: 'Select Image',
      input: 'file',
      inputAttributes: {
        accept: 'image/*',
        'aria-label': 'Upload your profile picture',
      },
      customClass: {
        confirmButton:
          'bg-primary font-thin text-text py-2 rounded-md mt-2 mb hover:bg-selected transition hover:text-white',
        cancelButton: 'bg-white text-text py-2 rounded-md mt-2 mb transition font-thin',
        title: 'font-thin text-primary',
        inputLabel: 'text-primary text-sm font-medium mb-2',
        popup: 'p-6 rounded-lg shadow-lg bg-white',
        input: 'w-full p-4 rounded-md',
      },
      showCancelButton: true,
      cancelButtonText: 'Cancel',
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;

        const { isConfirmed } = await Swal.fire({
          title: 'Preview',
          text: 'Your uploaded picture',
          imageUrl: imageUrl,
          imageAlt: 'The uploaded picture',
          showCancelButton: true,
          confirmButtonText: 'Upload',
          cancelButtonText: 'Cancel',
          customClass: {
            confirmButton:
              'bg-primary font-thin text-text py-2 rounded-md mt-2 mb hover:bg-selected transition hover:text-white',
            cancelButton: 'bg-white text-text py-2 rounded-md mt-2 mb transition font-thin',
            title: 'font-thin text-primary',
            popup: 'p-4',
          },
        });

        if (isConfirmed) {
          await handleUpload(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="lg:h-screen lg:w-screen bg-background">
      <div className="lg:w-screen flex justify-center lg:justify-start py-10 pl-2 lg:pl-14">
        <div
          className="w-32 h-32 rounded-full group overflow-hidden cursor-pointer relative"
          onClick={openUpdateAvatar}
        >
          {avatarUrl ? (
            <>
              <Image
                source={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover group-hover:opacity-30 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FileUpload className="text-white text-6xl" />
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-full bg-secondary flex items-center justify-center text-gray-500">
                No Avatar
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FileUpload className="text-white text-xl" />
              </div>
            </>
          )}
        </div>
        <div className="lg:mx-10 mx-4 grid grid-col-1 items-center lg:w-80">
          <h2 className="lg:text-5xl text-xl font-bold text-primary">{userData!.firstName}</h2>
          <div className="flex justify-between">
            <div className="flex">
              <PlaceOutlined className="text-primary" />
              <h2>
                {userData!.country} {userData!.county} {userData!.city}{' '}
              </h2>
            </div>
            <div>
              <Instagram onClick={openUpdateAvatar} className="text-primary cursor-pointer" />
              <LinkedInIcon onClick={openUpdateAvatar} className="text-primary cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background flex justify-center items-center py-10">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12">
          {/* Left Card - About Me */}
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full md:w-[50%] min-h-[250px] flex flex-col justify-center text-wrap">
            <h2 className="text-xl font-thin text-primary uppercase">About</h2>
            <p className="text-text mt-4 text-lg lg:w-full w-30">{userData!.description}</p>
          </div>

          {/* Right Card - Experience & Rating */}
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full md:w-[50%] min-h-[250px] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-text">
              <span className="text-primary">{getAccountAge(userData!.createdAt)}</span> on DoSo
            </h2>
            <Rating
              name="rating"
              value={userData?.rating}
              precision={0.5}
              readOnly
              className="mt-3 text-primary text-2xl"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#0C969C',
                },
                '& .MuiRating-iconEmpty': {
                  color: '#031716',
                },
              }}
            />
            <p className="text-md text-text mt-2">
              <span className="text-text font-semibold text-lg">4/5</span> out of 12 reviews
            </p>
          </div>
        </div>
      </div>
      <div className="bg-background flex justify-center items-center py-10">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-4/5 md:w-[90%] min-h-[250px] mx-10 ">
          <h2 className="text-xl font-thin text-primary uppercase">Jobs</h2>
          <ProfileJob content={userData!.jobs as unknown as Job[]} />
        </div>
      </div>
      <div className="bg-background flex justify-center flex-wrap items-center py-10 gap-12 flex-col md:flex-row lg:flex-row">
        <div className="bg-white rounded-2xl shadow-lg p-10 lg:w-1/5 w-4/5 md:w-2/5">
          <h2 className="text-2xl text-text mb-4">Currently working with...</h2>
          <div className="inline-flex  bg-selected bg-opacity-45 items-center space-x-2  text-text pr-10 rounded-full">
            <img src={avatarUrl} alt="Employer" className="w-12 h-12 rounded-full object-cover" />
            <span className="text-sm text-text font-medium">Employer name</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-10 w-5/6 lg:w-4/6">
          <h2 className="text-2xl text-text mb-4">Work History</h2>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
