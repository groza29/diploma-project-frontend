import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import getUserID from '../utils/User_Id';
import Swal from 'sweetalert2';
import PostCard from '../components/PostCard';

const MyPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);

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
        const response = await fetch(`http://localhost:3000/posts/user/${userId}`);
        const data = await response.json();
        const sortedPosts = data.sort((a: any, b: any) => b.createdAt - a.createdAt);
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleCreatePost = () => {
    navigate('/create-a-post');
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full text-center bg-background px-4">
        <img src="/images/undraw_no-data_ig65.svg" alt="No posts" className="w-48 h-48 mb-6" />
        <p className="text-text text-lg font-light mb-6">You currently don’t have any posts.</p>
        <Button text="Create a post" onClick={handleCreatePost} />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-background px-8 py-10">
      <h2 className="text-2xl font-thin mb-6 text-text">My posts</h2>
      <div className="flex flex-col gap-4">
        {posts.map((post: any) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            body={post.body}
            photoUrl={post.photos?.[0]}
            onSeeMore={() => navigate(`/post/${post.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
