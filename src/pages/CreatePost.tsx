import React, { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import Swal from 'sweetalert2';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import PhotoUploader from '../components/PhotoUploader';
import Button from '../components/Button';
import { OptionType } from '../models/OptionType';
import SearchDropdown from '../components/SearchDropdown';
import { useNavigate } from 'react-router-dom';
import getUserID from '../utils/User_Id';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [jobsData, setJobData] = useState<OptionType[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<OptionType[]>([]);
  const navigate = useNavigate();

  const formatDate = (timestamp: number) => new Date(timestamp).toISOString().split('T')[0];
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:3000/jobs');
        const data = await response.json();
        const sortedJobs = data
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((job: any) => ({
            label: job.name,
            value: job.id,
          }));
        setJobData(sortedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);
  console.log(jobsData);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    const newTimestamp = new Date(dateStr).getTime();
    if (newTimestamp >= Date.now()) {
      setTimestamp(newTimestamp);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opsss',
        text: 'You can not choose an old date!',
        draggable: true,
        iconColor: '#0C969C',
        customClass: {
          confirmButton:
            'bg-primary font-thin text-text py-2 rounded-md mt-2 mb hover:bg-selected transition hover:text-white',
          title: 'font-thin',
        },
      });
    }
  };

  const handleCreatePost = async () => {
    const token = localStorage.getItem('token');
    const userId = token ? getUserID(token) : null;
    if (!title || !selectedJobs || !description) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    if (!userId) {
      Swal.fire('Not authenticated');
      return;
    }
    const jobs = selectedJobs.map((job: OptionType) => job.value);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', description);
    formData.append('actionDate', timestamp.toString());
    formData.append('user_id', userId);
    formData.append('jobs', JSON.stringify(jobs));
    files.forEach((file) => formData.append('files', file));

    try {
      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create post');
      setTitle('');
      setSelectedJobs([]);
      setTimestamp(Date.now());
      setDescription('');
      setFiles([]);
      Swal.fire({ icon: 'success', title: 'Post created successfully' });
      navigate('/my-posts');
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Oops!', text: err.message });
    }
  };

  return (
    <div className="w-screen lg:h-max h-auto bg-background ">
      <div className="flex lg:flex-row flex-col md:items-center">
        <div className="lg:w-2/4 w-3/4 p-8 flex flex-col xs:items-center ">
          <div className="lg:w-2/4 w-3/4 min-w-48 ">
            <InputField
              label={'Title'}
              type={'text'}
              placeholder={'Title'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="pt-4 w-4/4">
            <SearchDropdown
              options={jobsData}
              selectedOption={selectedJobs}
              setSelectedOption={setSelectedJobs}
              label={'Jobs'}
              multiple={true}
            />
          </div>
        </div>
        <div className="lg:w-2/4 w-3/4 lg:p-8 p-5">
          <div className="lg:w-2/4 w-3/4 min-w-48 flex justify-center items-center">
            <InputField
              label={'Date of the Job'}
              type={'date'}
              placeholder={'Title'}
              value={formatDate(timestamp)}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

      {/* Markdown Editor Section */}
      <div className="flex w-full lg:flex-row flex-col items-center">
        <div className="lg:w-1/2 px-8 pb-14">
          <label className="block text-m font-thin text-text mb-2">Description</label>
          <div data-color-mode="light" className="bg-white rounded-md shadow-md">
            <MDEditor
              value={description}
              onChange={(val) => setDescription(val || '')}
              height={500}
            />
          </div>
        </div>

        <div className="lg:w-1/2">
          <PhotoUploader onFilesSelected={(files: File[]) => setFiles(files)} />
        </div>
      </div>

      <div className="w-full flex items-center justify-center pb-8">
        <Button text={'Create Post'} onClick={handleCreatePost} />
      </div>
    </div>
  );
};

export default CreatePost;
