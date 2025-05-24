import React from 'react';
import PostForm from '../components/PostForm';
import Swal from 'sweetalert2';
import getUserID from '../utils/User_Id';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();

  const handleSubmit = async ({
    title,
    description,
    date,
    jobs,
    files,
    country,
    state,
    city,
    price,
  }: any) => {
    const token = localStorage.getItem('token');
    const userId = token ? getUserID(token) : null;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', description);
    formData.append('actionDate', date.toString());
    formData.append('user_id', userId!);
    formData.append(
      'jobs',
      jobs.map((job: any) => job.value)
    );
    files.forEach((file: File) => formData.append('files', file));
    formData.append('country', country.label);
    formData.append('county', state.label);
    formData.append('city', city.label);
    formData.append('price', price);

    try {
      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!res.ok) throw new Error('Failed to create post');
      Swal.fire('Success', 'Post created successfully!', 'success');
      navigate('/my-posts');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return <PostForm mode="create" onSubmit={handleSubmit} />;
};

export default CreatePost;
