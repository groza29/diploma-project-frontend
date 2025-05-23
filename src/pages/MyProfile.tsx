import { jwtDecode } from 'jwt-decode';
import JwtDecodeUserType from '../models/JwtDecodeUserType';
import Image from '../components/Image';
import {
  Add,
  Delete,
  Edit,
  FileUpload,
  Instagram,
  LocalPhone,
  PlaceOutlined,
  Save,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useAvatar } from '../context/AvatarContext';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Rating } from '@mui/material';
import { useEffect, useState } from 'react';
import { User } from '../models/UsersModel';
import ProfileJob from '../components/ProfileJob';
import { Job } from '../models/JobType';
import getAccountAge from '../utils/AccountAge';
import Button from '../components/Button';
import InputField from '../components/InputField';
import SearchDropdown from '../components/SearchDropdown';
import { OptionType } from '../models/OptionType';
import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationWithPosts } from './MyApplications';

const MyProfile: React.FC = () => {
  const { avatarUrl, updateAvatar } = useAvatar();
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();

  const user = token ? jwtDecode<JwtDecodeUserType>(token) : null;
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedInstagram, setEditedInstagram] = useState('');
  const [editedLinkedin, setEditedLinkedin] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [isEditJobs, setIsEditJob] = useState(false);
  const [jobsData, setJobData] = useState<OptionType[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<OptionType[]>([]);
  const [applicaions, setApplications] = useState<ApplicationWithPosts[]>([]);
  let admin: any = null;
  if (token) {
    try {
      admin = jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
    }
  }
  const isAdmin = admin.role === 'admin';
  console.log(isAdmin);
  const isMyProfile = !id || id === user?.id || isAdmin;

  useEffect(() => {
    const fetchJobsAndPrepareSelected = async () => {
      try {
        const response = await fetch('http://localhost:3000/jobs');
        const data = await response.json();
        if (userData?.jobs) {
          const sortedJobs = data
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .map((job: any) => ({
              label: job.name,
              value: job.id,
            }));
          setJobData(sortedJobs);
        } else {
          const sortedJobs = data
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .map((job: any) => ({
              label: job.name,
              value: job.id,
            }));
          setJobData(sortedJobs);
        }

        if (userData?.jobs && isMyProfile && isEditJobs) {
          const mappedSelectedJobs = userData.jobs.map((job: any) => ({
            label: job.name,
            value: job.id,
          }));
          setSelectedJobs(mappedSelectedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    // Only run when isEditJobs changes
    if (isEditJobs) {
      fetchJobsAndPrepareSelected();
    }
  }, [isEditJobs, userData, isMyProfile]);

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
  const fetchUser = async () => {
    try {
      const userIdToFetch = id || user?.id;
      const response = await fetch(`http://localhost:3000/users/${userIdToFetch}`);
      if (!response.ok) throw new Error('failed to fetch the user');

      const data = await response.json();
      setUserData(data);
      setEditedDescription(data.description);
      setEditedInstagram(data.instagram);
      setEditedLinkedin(data.linkedin);
      setEditedPhone(data.phoneNumber);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      const userIdToFetch = id || user?.id;

      const res = await fetch(`http://localhost:3000/users/${userIdToFetch}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete the post');

      Swal.fire('Success', 'Post Deleted!', 'success');
      navigate('/comunity');
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };
  const fetchApplications = async () => {
    try {
      const userIdToFetch = id || user?.id;
      const response = await fetch(`http://localhost:3000/applications/user/${userIdToFetch}`);
      const data = await response.json();
      console.log(data);

      let applicationsArray: any[] = [];

      if (Array.isArray(data.applications)) {
        applicationsArray = data.applications;
      } else if (Array.isArray(data)) {
        applicationsArray = data;
      }

      const sortedApplications = applicationsArray.sort((a, b) => b.actionDate - a.actionDate);
      const filteredApplications = sortedApplications.filter(
        (app) => app.status === false && app.accepted === 'Accepted' && app.feedback && app.rating
      );
      setApplications(filteredApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchApplications();
  }, [id]);
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
        {isMyProfile ? (
          <div
            className="w-32 h-32 rounded-full group overflow-hidden cursor-pointer relative"
            onClick={openUpdateAvatar}
          >
            {avatarUrl ? (
              <>
                <Image
                  source={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover group-hover:opacity-30 shadow-md transition-opacity duration-300"
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
        ) : (
          <div className="w-32 h-32 rounded-full group overflow-hidden shadow-md cursor-pointer relative">
            {avatarUrl ? (
              <>
                <Image
                  source={`http://localhost:3000/avatar/${id}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </>
            ) : (
              <>
                <div className="w-full h-full bg-secondary flex items-center justify-center text-gray-500">
                  No Avatar
                </div>
              </>
            )}
          </div>
        )}

        <div className="lg:mx-10 mx-4 grid grid-col-1 items-center lg:w-90">
          <div className="flex gap-2 lg:mb-2">
            <h2 className="lg:text-5xl text-xl font-bold text-primary">{userData!.lastName}</h2>
            <h2 className="lg:text-5xl text-xl font-bold text-primary">{userData!.firstName}</h2>
          </div>
          <div className="w-full flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="w-full flex gap-1">
                <PlaceOutlined className="text-primary" />
                <h2>
                  {userData!.country} {userData!.county} {userData!.city}{' '}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <LocalPhone className="text-primary cursor-pointer" />
                {isEditingDescription ? (
                  <InputField
                    label={''}
                    type={'text'}
                    placeholder="phone number"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                  />
                ) : (
                  <h2>{userData!.phoneNumber}</h2>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className=" w-full flex justify-center items-center gap-2">
                <Instagram
                  onClick={() =>
                    userData?.instagram
                      ? window.open(userData.instagram, '_blank')
                      : Swal.fire('Error', 'There is no link added', 'error')
                  }
                  className="text-primary cursor-pointer"
                />
                {isEditingDescription && (
                  <InputField
                    label={''}
                    type={'text'}
                    placeholder={'Instagram link'}
                    value={editedInstagram}
                    onChange={(e) => setEditedInstagram(e.target.value)}
                  />
                )}
              </div>
              <div className="flex justify-center items-center">
                <LinkedInIcon
                  onClick={() =>
                    userData?.linkedin
                      ? window.open(userData.linkedin, '_blank')
                      : Swal.fire('Error', 'There is no link added', 'error')
                  }
                  className="text-primary cursor-pointer"
                />
                {isEditingDescription && (
                  <InputField
                    label={''}
                    type={'text'}
                    placeholder={'LinkedIn link'}
                    value={editedLinkedin}
                    onChange={(e) => setEditedLinkedin(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background flex justify-center items-center py-10">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12">
          {/* Left Card - About Me */}
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full md:w-[50%] min-h-[250px] flex flex-col justify-center text-wrap">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-thin text-primary uppercase">About</h2>
              {isMyProfile && (
                <Button
                  text={isEditingDescription ? 'Save' : 'Edit'}
                  icon={isEditingDescription ? <Save /> : <Edit />}
                  className="bg-white mb-4"
                  onClick={async () => {
                    if (isEditingDescription) {
                      try {
                        const response = await fetch(`http://localhost:3000/users/${user?.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            description: editedDescription,
                            instagram: editedInstagram,
                            linkedin: editedLinkedin,
                            phoneNumber: editedPhone,
                          }),
                        });
                        if (!response.ok) throw new Error('Failed to update description');
                        setUserData((prev) =>
                          prev
                            ? {
                                ...prev,
                                description: editedDescription,
                                instagram: editedInstagram,
                                linkedin: editedLinkedin,
                                phoneNumber: editedPhone,
                              }
                            : prev
                        );
                        Swal.fire('Updated!', 'Description updated successfully.', 'success');
                      } catch (err) {
                        Swal.fire('Error', 'Could not update description', 'error');
                      }
                    }
                    setIsEditingDescription(!isEditingDescription);
                  }}
                />
              )}
            </div>
            {isEditingDescription ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="text-text mt-4 text-lg lg:w-full w-30 border border-gray-300 rounded-md p-2"
                rows={Math.max(3, editedDescription.length) / 50}
              />
            ) : (
              <p className="text-text mt-4 text-lg lg:w-full w-30">{userData!.description}</p>
            )}{' '}
          </div>

          {/* Right Card - Experience & Rating */}
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full md:w-[50%] min-h-[250px] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-text">
              <span className="text-primary">
                {getAccountAge(userData!.createdAt)} <span className="text-text">On</span>
                <img alt="dosoLogo" src="./images/doso.svg" className="p-2" />
              </span>
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
          </div>
        </div>
      </div>
      <div className="bg-background flex justify-center items-center py-10">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-4/5 md:w-[90%] min-h-[250px] mx-10 ">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-thin text-primary uppercase">Jobs</h2>
            {isMyProfile && (
              <Button
                text={isEditJobs ? 'Save' : 'Edit'}
                icon={isEditJobs ? <Save /> : <Edit />}
                className="bg-white mb-4"
                onClick={async () => {
                  if (isEditJobs) {
                    try {
                      const response = await fetch(`http://localhost:3000/users/${user?.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          jobs: selectedJobs.map((job) => job.value),
                        }),
                      });
                      if (!response.ok) throw new Error('Failed to update description');
                      setUserData((prev) =>
                        prev
                          ? {
                              ...prev,
                              jobs: selectedJobs.map((job) => job.value),
                            }
                          : prev
                      );
                      Swal.fire('Updated!', 'Jobs updated successfully.', 'success');
                      fetchUser();
                    } catch (err) {
                      Swal.fire('Error', 'Could not update jobs', 'error');
                    }
                  }
                  setIsEditJob(!isEditJobs);
                }}
              />
            )}
          </div>
          {!userData!.jobs ? (
            <div className="flex items-center justify-center flex-col">
              {' '}
              {isMyProfile && isEditJobs && (
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-thin">No jobs..</h1>

                  <Button
                    text={'Add a new Job'}
                    icon={<Add />}
                    className="mb-4"
                    onClick={() => setIsEditJob(true)}
                  />
                </div>
              )}
              {isMyProfile && !isEditJobs && (
                <div className=" w-full flex flex-col">
                  <SearchDropdown
                    options={jobsData}
                    selectedOption={selectedJobs}
                    setSelectedOption={setSelectedJobs}
                    label={''}
                    multiple={true}
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              {' '}
              {isMyProfile && isEditJobs && (
                <div className=" w-full flex flex-col">
                  <SearchDropdown
                    options={jobsData}
                    selectedOption={selectedJobs}
                    setSelectedOption={setSelectedJobs}
                    label={''}
                    multiple={true}
                  />
                </div>
              )}
              {!isEditJobs && <ProfileJob content={userData!.jobs as unknown as Job[]} />}
            </div>
          )}
        </div>
      </div>
      <div className="bg-background flex justify-center flex-wrap items-center py-10 gap-12 flex-col md:flex-row lg:flex-row">
        <div className="bg-white rounded-2xl shadow-lg p-10 lg:w-1/5 w-4/5 md:w-2/5">
          <h2 className="text-2xl text-text mb-4">Last Job</h2>
          {applicaions.length > 0 && applicaions[0]?.post && (
            <div className="inline-flex bg-selected bg-opacity-45 items-center space-x-2 text-text pr-10 rounded-full">
              <img
                src={applicaions[0].post.imagesUrls?.[0] || '/images/undraw_photos_09tf.svg'}
                alt="Employer"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-sm text-text font-medium">{applicaions[0].post.title}</span>
              <p className="text-sm text-text font-thin">{applicaions[0].post.body}</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-10 w-5/6 lg:w-4/6 h-1/4">
          <h2 className="text-2xl text-text mb-4">Work Feedback</h2>
          <div>
            {applicaions.map((app) => (
              <div className="flex flex-row w-full items-center">
                <div className="w-2/3 flex items-center">
                  <h3>{app.feedback}</h3>
                </div>
                <div className="w-1/3 flex items-center justify-end">
                  <Rating
                    value={app.rating}
                    precision={0.5}
                    readOnly
                    className="text-primary text-2xl"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#0C969C',
                      },
                      '& .MuiRating-iconEmpty': {
                        color: '#031716',
                      },
                    }}
                  />{' '}
                </div>
              </div>
            ))}
          </div>
        </div>
        {isAdmin && (
          <Button
            text={'Delete User'}
            icon={<Delete />}
            className="bg-red"
            onClick={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default MyProfile;
