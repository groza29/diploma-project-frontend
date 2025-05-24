import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import Image from '../Image';
import { useUser } from '../../context/UserContext';
import { PostType } from '../../pages/MyPosts';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { InfoOutlined } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

const UserHome: React.FC = () => {
  const token = localStorage.getItem('token');

  const navigator = useNavigate();
  const user = useUser();
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3000/posts', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        const data = await res.json();
        const posts = Array.isArray(data.posts) ? data.posts : data;

        posts.sort((a: any, b: any) => Number(b.createdAt) - Number(a.createdAt));

        setPosts(posts);
      } catch (err) {
        console.error('Error loading posts:', err);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="w-full h-screen">
      <section className="relative h-2/5 w-full flex items-center justify-center">
        <Image source="/images/login1.jpg" alt="Background" className="opacity-30" />
        <div className="justify-center items-center absolute lg:top-20 top-30">
          <h1 className="lg:text-6xl text-3xl font-bold text-center text-text-secondary">
            Welcome back,&nbsp;
            <span className="lg:text-7xl text-4xl text-selected mr-4">
              {user.user?.lastName} {user.user?.firstName}
            </span>
          </h1>

          <div className="flex justify-center gap-6 items-center pt-4">
            <Button
              text="See Posts"
              nav={true}
              className="bg-button"
              onClick={() => navigator('/posts')}
            />
            <Button text="Create a post" onClick={() => navigator('/create-a-post')} />
          </div>
        </div>
      </section>
      <section className="w-full h-3/5 flex lg:flex-row flex-col">
        <div className="lg:w-1/2 w-full bg-white rounded-lg shadow-md p-6 overflow-auto">
          <h2 className="text-xl font-bold text-teal-700">News Feed</h2>
          <p className="text-sm text-gray-500 mb-4">See the latest posts</p>
          {posts.map((post, i) => (
            <div key={i} className="flex items-center p-4 mb-4 border rounded-md">
              <div className="w-16 h-16 bg-gray-200 rounded-md mr-4">
                <img
                  src={post.imagesUrls?.[0] || '/images/undraw_photos_09tf.svg'}
                  alt={`Post image ${i + 1}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-primary">{post.title}</h3>
                <p className="text-sm text-text-secondary">{post.body}</p>
                <p className="text-sm text-text-secondary">
                  Action Date: {new Date(Number(post.actionDate)).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex lg:w-1/2 lg:h-auto h-2/5 flex-col w-full">
          <div className="flex flex-col w-1/2 pl-4 pt-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              Score
              <Tooltip
                title="Score is based on your feedback and rating across accepted, completed applications. The maximum score is 10000 and the lowest is 1000."
                arrow
              >
                <span>
                  <InfoOutlined className="cursor-help" />
                </span>
              </Tooltip>
            </h2>
            <p className="text-sm text-text-secondary mb-4">See your account’s score</p>
          </div>
          <div className="flex flex-col items-center h-2/3">
            <CircularProgressbar
              value={user.user?.score || 0}
              maxValue={10000}
              text={`${user.user?.score ?? 0}`}
              styles={buildStyles({
                textColor: '#0C969C',
                pathColor: '#0C969C',
                trailColor: '#eee',
              })}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserHome;
