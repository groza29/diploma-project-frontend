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
  initialCountry?: string;
  initialState?: string;
  initialCity?: string;
  onSubmit: (form: {
    title: string;
    description: string;
    date: number;
    jobs: OptionType[];
    files: File[];
    imagesUrls: string[];
    country: OptionType;
    state: OptionType;
    city: OptionType;
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
  initialCountry,
  initialState,
  initialCity,
}) => {
  const GEO_NAMES_USERNAME = 'groza29';

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [timestamp, setTimestamp] = useState(initialDate);
  const [selectedJobs, setSelectedJobs] = useState<OptionType[]>(initialJobs);
  const [files, setFiles] = useState<File[]>([]);
  const [jobsData, setJobData] = useState<OptionType[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>(imagesUrls);
  const [country, setCountry] = useState<OptionType | null>(null);
  const [state, setState] = useState<OptionType | null>(null);
  const [city, setCity] = useState<OptionType | null>(null);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [states, setStates] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);

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
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const sortedCountries = data
          .sort((a: any, b: any) => a.name.common.localeCompare(b.name.common))
          .map((country: any) => ({
            label: country.name.common,
            value: country.cca2,
          }));
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);
  useEffect(() => {
    if (initialCountry && countries.length > 0) {
      const match = countries.find((c) => c.label === initialCountry);
      if (match) {
        setCountry(match);
      }
    }
  }, [initialCountry, countries]);

  useEffect(() => {
    if (country) {
      const fetchStates = async () => {
        try {
          console.log(`Fetching geonameId for country: ${country.label}`);

          // fetch `geonameId` for the country
          const countryResponse = await fetch(
            `http://api.geonames.org/searchJSON?name_equals=${country.label}&featureCode=PCLI&maxRows=1&username=${GEO_NAMES_USERNAME}`
          );
          const countryData = await countryResponse.json();

          if (!countryData.geonames || countryData.geonames.length === 0) {
            throw new Error('No geonameId found for this country.');
          }

          const countryGeonameId = countryData.geonames[0].geonameId;
          console.log(`Correct geonameId for ${country.label}: ${countryGeonameId}`);

          // fetch administrative divisions (states/provinces)
          const stateResponse = await fetch(
            `http://api.geonames.org/childrenJSON?geonameId=${countryGeonameId}&username=${GEO_NAMES_USERNAME}`
          );
          const stateData = await stateResponse.json();

          if (stateData.geonames) {
            setStates(
              stateData.geonames.map((state: any) => ({
                label: state.name,
                value: state.geonameId,
              }))
            );
          } else {
            setStates([]);
          }
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      };

      fetchStates();
    } else {
      setStates([]);
      setState(null);
    }
  }, [country]);
  useEffect(() => {
    if (initialState && states.length > 0) {
      const match = states.find((c) => c.label === initialState);
      if (match) {
        setState(match);
      }
    }
  }, [initialState, states]);

  useEffect(() => {
    if (state) {
      const fetchCities = async () => {
        try {
          console.log(`Fetching cities for state geonameId: ${state.value}`);

          const response = await fetch(
            `http://api.geonames.org/childrenJSON?geonameId=${state.value}&username=${GEO_NAMES_USERNAME}`
          );
          const data = await response.json();

          if (data.geonames) {
            setCities(
              data.geonames.map((city: any) => ({
                label: city.name,
                value: city.geonameId,
              }))
            );
          } else {
            setCities([]);
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };

      fetchCities();
    } else {
      setCities([]);
      setCity(null);
    }
  }, [state]);
  useEffect(() => {
    if (initialCity && cities.length > 0) {
      const match = cities.find((c) => c.label === initialCity);
      if (match) {
        setCity(match);
      }
    }
  }, [initialCity, cities]);

  const handleSubmit = () => {
    if (!title || !description || selectedJobs.length === 0 || !country || !state || !city) {
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
      country: country,
      state: state,
      city: city,
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
        <div className="lg:w-2/4 flex flex-col w-3/4 lg:p-8 p-5 gap-4">
          <div className="lg:w-3/4 w-4/4 min-w-48 flex lg:flex-row flex-col justify-center items-center gap-4">
            <InputField
              label="Date of the Job"
              type="date"
              placeholder="Date"
              value={formatDate(timestamp)}
              onChange={handleDateChange}
            />
            <SearchDropdown
              options={countries}
              label="Country"
              selectedOption={country}
              setSelectedOption={(value) => {
                setCountry(value);
                setState(null);
                setCity(null);
              }}
              style={true}
            />
          </div>
          <div className="lg:w-3/4 w-4/4 min-w-48 flex lg:flex-row flex-col justify-center items-center gap-4">
            <SearchDropdown
              options={states}
              label="County"
              selectedOption={state}
              setSelectedOption={(value) => {
                setState(value);
                setCity(null);
              }}
              style={true}
            />

            <SearchDropdown
              options={cities}
              label="City"
              selectedOption={city}
              setSelectedOption={setCity}
              style={true}
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
