import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import Image from '../Image';
import { useEffect, useState } from 'react';
import { PostType } from '../../pages/MyPosts';
import { Application } from '../../pages/MyApplications';

const AdminHome: React.FC = () => {
  const navigator = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchPosts = async () => {
    const res = await fetch('http://localhost:3000/posts');
    const data = await res.json();
    setPosts(data);
  };
  const fetchApplications = async () => {
    const res = await fetch('http://localhost:3000/applications');
    const data = await res.json();
    setApplications(data);
  };

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/applications');
    const data = await res.json();
    setUsers(data);
  };

  const fetchJobs = async () => {
    const res = await fetch('http://localhost:3000/jobs');
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchPosts();
    fetchApplications();
    fetchUsers();
    fetchJobs();
  }, []);
  return (
    <div className="h-screen w-full bg-background">
      <section className="relative h-2/5 w-full flex items-center justify-center">
        <Image source="/images/login1.jpg" alt="Background" className="opacity-30" />
        <div className="justify-center items-center absolute lg:top-20 top-30">
          <h1 className="lg:text-6xl text-3xl font-bold text-center text-text-secondary">
            Welcome back,&nbsp;
            <span className="lg:text-7xl text-4xl text-selected mr-4">Admin</span>
          </h1>

          <div className="flex justify-center gap-6 items-center pt-4">
            <Button text="Posts" onClick={() => navigator('/posts')} />
            <Button text="Users" onClick={() => navigator('/comunity')} />
            <Button text="Applications" onClick={() => navigator('/applications')} />
            <Button text="Jobs" onClick={() => navigator('/jobs')} />
          </div>
        </div>
      </section>
      <section className="h-3/5 flex items-center justify-between px-8">
        <div
          className="w-1/5 h-1/2 flex flex-col border bg-white border shadow-lg rounded-xl cursor-pointer"
          onClick={() => navigator('/posts')}
        >
          <div className=" h-1/4 w-full py-4 flex items-center justify-center">
            <h3 className="text-4xl text-selected mt-4 font-bold">Posts</h3>
          </div>
          <div className="h-1/2 w-full flex items-center justify-center">
            <h4 className="flex flex-col items-center mt-6 text-3xl text-text">
              Total posts <span className="text-4xl text-primary pt-4 pb-0">{posts.length}</span>
            </h4>
          </div>
        </div>
        <div
          className="w-1/5 h-1/2 flex flex-col border bg-white border shadow-lg rounded-xl cursor-pointer"
          onClick={() => navigator('/comunity')}
        >
          <div className=" h-1/4 w-full py-4 flex items-center justify-center">
            <h3 className="text-4xl text-selected mt-4 font-bold">Users</h3>
          </div>
          <div className="h-1/2 w-full flex items-center justify-center">
            <h4 className="flex flex-col items-center mt-6 text-3xl text-text">
              Total users <span className="text-4xl text-primary pt-4 pb-0">{users.length}</span>
            </h4>
          </div>
        </div>
        <div
          className="w-1/5 h-1/2 flex flex-col border bg-white border shadow-lg rounded-xl cursor-pointer"
          onClick={() => navigator('/applications')}
        >
          <div className=" h-1/4 w-full py-4 flex items-center justify-center">
            <h3 className="text-4xl text-selected mt-4 font-bold">Applications</h3>
          </div>
          <div className="h-1/2 w-full flex items-center justify-center">
            <h4 className="flex flex-col items-center mt-6 text-3xl text-text">
              Total Applications{' '}
              <span className="text-4xl text-primary pt-4 pb-0">{applications.length}</span>
            </h4>
          </div>
        </div>
        <div
          className="w-1/5 h-1/2 flex flex-col border bg-white border shadow-lg rounded-xl cursor-pointer"
          onClick={() => navigator('/jobs')}
        >
          <div className=" h-1/4 w-full py-4 flex items-center justify-center">
            <h3 className="text-4xl text-selected mt-4 font-bold">Jobs</h3>
          </div>
          <div className="h-1/2 w-full flex items-center justify-center">
            <h4 className="flex flex-col items-center mt-6 text-3xl text-text">
              Total jobs <span className="text-4xl text-primary pt-4 pb-0">{jobs.length}</span>
            </h4>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AdminHome;
