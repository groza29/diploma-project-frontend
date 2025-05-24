import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PostForm from '../components/PostForm';
import { OptionType } from '../models/OptionType';
import getUserID from '../utils/User_Id';

const EditPost: React.FC = () => {
  const token = localStorage.getItem('token');

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState<any>(null);
  const [jobOptions, setJobOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/posts/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        const data = await res.json();

        const jobsRes = await fetch('http://localhost:3000/jobs', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        const jobs = await jobsRes.json();
        const formattedJobs = jobs.map((job: any) => ({
          label: job.name,
          value: job.id,
        }));
        setJobOptions(formattedJobs);

        const matchedJobs: OptionType[] = formattedJobs.filter((job: OptionType) =>
          data.jobs.includes(job.value)
        );

        setPostData({
          title: data.title,
          description: data.body,
          date: parseInt(data.actionDate),
          jobs: matchedJobs,
          imagesUrls: data.imagesUrls,
          country: data.country,
          state: data.state,
          city: data.city,
          price: data.price,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading post', error);
        Swal.fire('Error', 'Failed to load post data', 'error');
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async ({
    title,
    description,
    date,
    jobs,
    files,
    imagesUrls,
    country,
    state,
    city,
    price,
  }: {
    title: string;
    description: string;
    date: number;
    jobs: OptionType[];
    files: File[];
    imagesUrls: string[];
    country: OptionType;
    state: OptionType;
    city: OptionType;
    price: string;
  }) => {
    const token = localStorage.getItem('token');
    const userId = token ? getUserID(token) : null;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', description);
    formData.append('actionDate', date.toString());
    formData.append('user_id', userId!);
    formData.append('jobs', JSON.stringify(jobs.map((j) => j.value)));
    formData.append('country', country!.label);
    formData.append('state', state!.label);
    formData.append('city', city!.label);
    formData.append('price', price);
    imagesUrls.forEach((url) => {
      formData.append('imagesUrls', url);
    });
    files.forEach((file) => formData.append('files', file));

    console.log(formData);
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!res.ok) throw new Error('Failed to update post');

      Swal.fire('Success', 'Post updated!', 'success');
      navigate('/my-posts');
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) throw new Error('Failed to delete the post');

      Swal.fire('Success', 'Post Deleted!', 'success');
      navigate('/my-posts');
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };
  if (loading || !postData) return <p className="text-center mt-10">Loading post data...</p>;

  return (
    <PostForm
      mode="edit"
      initialTitle={postData.title}
      initialDescription={postData.description}
      initialDate={postData.date}
      initialJobs={postData.jobs}
      onSubmit={handleUpdate}
      handleDelete={handleDelete}
      imagesUrls={postData.imagesUrls}
      initialCountry={postData.country}
      initialState={postData.state}
      initialCity={postData.city}
      initialPrice={postData.price}
    />
  );
};

export default EditPost;
