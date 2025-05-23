import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import getUserID from '../utils/User_Id';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { PostType } from './MyPosts';
import { Add, Search } from '@mui/icons-material';
import ApplicationCard from '../components/ApplicationCard';

export interface Application {
  id: string;
  user_id: string;
  post_id: string;
  feedback?: string;
  status: boolean;
  accepted: string;
  createdAt: number;
  rating?: number;
}
export interface ApplicationWithPosts extends Omit<Application, 'post_id'> {
  post: PostType;
}

const MyApplications = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [applications, setApplications] = useState<ApplicationWithPosts[]>([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 3;
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Not authenticated');
      return;
    }
    const id = getUserID(token);
    setUserId(id);
  }, []);
  useEffect(() => {
    if (!userId) return;

    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:3000/applications/user/${userId}`);
        const data = await response.json();
        console.log(data);

        let applicationsArray: any[] = [];

        if (Array.isArray(data.applications)) {
          applicationsArray = data.applications;
        } else if (Array.isArray(data)) {
          applicationsArray = data;
        }

        const sortedApplications = applicationsArray.sort((a, b) => b.actionDate - a.actionDate);
        setApplications(sortedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [userId]);

  if (!applications) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full text-center bg-background px-4">
        <img src="/images/undraw_no-data_ig65.svg" alt="No posts" className="w-48 h-48 mb-6" />
        <p className="text-text text-lg font-light mb-6">
          You currently don’t have any applications.
        </p>
        <Button text="Find something" onClick={() => navigate('/posts')} icon={<Search />} />
      </div>
    );
  }
  return (
    <div className="w-screen min-h-screen bg-background px-4">
      <div className=" w-full flex items-center mb-6 p-4">
        <div className="w-1/2 flex items-center">
          <h2 className="text-2xl font-thin text-text">My Applications</h2>
        </div>
        <div className="w-1/2 flex items-center justify-end">
          <Button text={'Add new application'} icon={<Add />} onClick={() => navigate('/posts')} />
        </div>
      </div>
      {currentApplications.map((app) => (
        <ApplicationCard
          key={app.id}
          applicationId={app.id}
          post={app.post}
          feedback={app.feedback}
          rating={app.rating}
          createdAt={app.createdAt}
          accepted={app.accepted}
          status={app.status}
        />
      ))}
      <div className="flex justify-center items-center gap-6 mt-4">
        <Button
          text="Previous"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        <span className="text-sm text-text-secondary pt-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          text="Next"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
};

export default MyApplications;
