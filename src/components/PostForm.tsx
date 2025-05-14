// components/PostForm.tsx
import React, { useEffect, useState } from 'react';
import InputField from './InputField';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import PhotoUploader from './PhotoUploader';
import Button from './Button';
import SearchDropdown from './SearchDropdown';
import { OptionType } from '../models/OptionType';
import Swal from 'sweetalert2';
import { CreateNewFolder, Delete, Update } from '@mui/icons-material';
import ImageGallery from './ImageGallery';

interface PostFormProps {
  mode: 'create' | 'edit';
  initialTitle?: string;
  initialDescription?: string;
  initialDate?: number;
  initialJobs?: OptionType[];
  imagesUrls?: string[];
  onSubmit: (form: {
    title: string;
    description: string;
    date: number;
    jobs: OptionType[];
    files: File[];
    imagesUrls: string[];
  }) => void;
  handleDelete?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({
  mode,
  initialTitle = '',
  initialDescription = '',
  initialDate = Date.now(),
  initialJobs = [],
  onSubmit,
  handleDelete,
  imagesUrls = [],
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [timestamp, setTimestamp] = useState(initialDate);
  const [selectedJobs, setSelectedJobs] = useState<OptionType[]>(initialJobs);
  const [files, setFiles] = useState<File[]>([]);
  const [jobsData, setJobData] = useState<OptionType[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>(imagesUrls);

  const formatDate = (timestamp: number) => new Date(timestamp).toISOString().split('T')[0];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:3000/jobs');
        const data = await res.json();
        const jobs = data.map((job: any) => ({
          label: job.name,
          value: job.id,
        }));
        setJobData(jobs);
      } catch (error) {
        console.error('Error fetching jobs', error);
      }
    };
    fetchJobs();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimestamp = new Date(e.target.value).getTime();
    if (newTimestamp >= Date.now()) {
      setTimestamp(newTimestamp);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalide Date',
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

  const handleSubmit = () => {
    if (!title || !description || selectedJobs.length === 0) {
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

    onSubmit({
      title,
      description,
      date: timestamp,
      jobs: selectedJobs,
      files,
      imagesUrls: currentImages,
    });
  };
  const handleDeleteImage = (index: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0C969C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedImages = [...currentImages];
        updatedImages.splice(index, 1);
        setCurrentImages(updatedImages);

        Swal.fire({
          title: 'Deleted!',
          text: 'The image has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };
  const handleMoveToFirst = (index: number) => {
    if (index === 0) return;

    const updatedImages = [...currentImages];
    const imageToMove = updatedImages[index];
    updatedImages.splice(index, 1);
    updatedImages.unshift(imageToMove);

    setCurrentImages(updatedImages);
  };

  return (
    <div className="w-screen lg:h-max h-auto bg-background ">
      <div className="flex lg:flex-row flex-col md:items-center">
        <div className="lg:w-2/4 w-3/4 p-8 flex flex-col xs:items-center ">
          <div className="lg:w-2/4 w-3/4 min-w-48 ">
            <InputField
              label="Title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="pt-4 w-4/4">
            <SearchDropdown
              options={jobsData}
              selectedOption={selectedJobs}
              setSelectedOption={setSelectedJobs}
              label="Jobs"
              multiple
            />
          </div>
        </div>
        <div className="lg:w-2/4 w-3/4 lg:p-8 p-5">
          <div className="lg:w-2/4 w-3/4 min-w-48 flex justify-center items-center">
            <InputField
              label="Date of the Job"
              type="date"
              placeholder="Date"
              value={formatDate(timestamp)}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

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
      {mode === 'edit' && (
        <>
          <div className="mb-8 mx-8 border p-4 rounded-2xl ">
            <ImageGallery
              imagesUrls={currentImages}
              onDeleteImage={handleDeleteImage}
              onMoveToFirst={handleMoveToFirst}
            />
          </div>
        </>
      )}

      <div className="w-full flex items-center justify-center pb-8">
        {mode === 'edit' ? (
          <div className="flex flex-col lg:flex-row justify-between w-3/4">
            <Button
              text="Delete Post"
              icon={<Delete />}
              className="bg-red bg-opacity-75"
              onClick={handleDelete}
            />
            <Button text={'Update Post'} icon={<Update />} onClick={handleSubmit} />
          </div>
        ) : (
          <Button text={'Create Post'} icon={<CreateNewFolder />} onClick={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default PostForm;
