import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import getUserID from '../utils/User_Id';
import Swal from 'sweetalert2';
import PostCard from '../components/PostCard';
import { Add } from '@mui/icons-material';

export interface PostType {
  id: string;
  title: string;
  body: string;
  user_id: string;
  actionDate: Date;
  status: boolean;
  jobs?: string[];
  createdAt: number;
  imagesUrls?: string[];
  country?: string;
  county?: string;
  city?: string;
  price?: string;
}

const MyPosts: React.FC = () => {
  const token = localStorage.getItem('token');

  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const indexOfLastApp = currentPage * postsPerPage;
  const indexOfFirstApp = indexOfLastApp - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(posts.length / postsPerPage);

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

    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/user/${userId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        const data = await response.json();

        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else if (Array.isArray(data)) {
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [userId]);
  console.log(posts);
  const handleCreatePost = () => {
    navigate('/create-a-post');
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full text-center bg-background px-4">
        <img src="/images/undraw_no-data_ig65.svg" alt="No posts" className="w-48 h-48 mb-6" />
        <p className="text-text text-lg font-light mb-6">You currently don’t have any posts.</p>
        <Button text="Create a post" onClick={handleCreatePost} icon={<Add />} />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-background px-8 py-10">
      <div className=" w-full flex items-center mb-6">
        <div className="w-1/2 flex items-center">
          <h2 className="text-2xl font-thin text-text">My posts</h2>
        </div>
        <div className="w-1/2 flex items-center justify-end">
          <Button text={'Create a new Post'} icon={<Add />} onClick={handleCreatePost} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {currentPosts.map((post: any) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            body={post.body}
            images={post.imagesUrls}
            status={post.status}
            actionDate={post.actionDate}
            price={post.price}
            onEdit={() => navigate(`/edit-post/${post.id}`)}
          />
        ))}
      </div>
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

export default MyPosts;
