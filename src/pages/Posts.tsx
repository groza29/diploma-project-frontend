import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  ArrowUpward,
  Delete,
  Edit,
  Search,
} from '@mui/icons-material';
import { PostType } from './MyPosts';
import SearchInput from '../components/SearchInput';
import Button from '../components/Button';
import FilterDisplay from '../components/FilterDisplay';
import { OptionType } from '../models/OptionType';
import TuneIcon from '@mui/icons-material/Tune';
import { Dialog, IconButton, Paper, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InputField from '../components/InputField';
import DropdownSelect from '../components/DropdownSelect';
import SearchDropdown from '../components/SearchDropdown';
import { useUser } from '../context/UserContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ReactMarkdown from 'react-markdown';
import Carousel from 'react-material-ui-carousel';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Posts: React.FC = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  let admin: any = null;
  if (token) {
    try {
      admin = jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
    }
  }
  const isAdmin = admin.role === 'admin';
  console.log(isAdmin);

  const GEO_NAMES_USERNAME = 'groza29';
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const [posts, setPosts] = useState<PostType[]>([]);
  const { user } = useUser();
  const sliderRef = useRef<Slider | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [statusSearched, setStatusSearched] = useState<boolean>(false);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [open, setOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState<OptionType | undefined>();
  const [country, setCountry] = useState<OptionType | null>(null);
  const [state, setState] = useState<OptionType | null>(null);
  const [city, setCity] = useState<OptionType | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [jobsData, setJobData] = useState<OptionType[]>([]);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [states, setStates] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const [allPosts, setAllPosts] = useState<PostType[]>([]);

  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3000/posts');
        const data = await res.json();
        const posts = Array.isArray(data.posts) ? data.posts : data;
        setAllPosts(posts);
      } catch (err) {
        console.error('Error loading posts:', err);
      }
    };
    fetchPosts();
  }, []);
  const handleReset = () => {
    setTitle('');
    setSelectedJob(undefined);
    setCountry(null);
    setState(null);
    setCity(null);
  };
  const handleApply = async () => {
    setOpen(false);
    setStatusSearched(true);

    try {
      const res = await fetch('http://localhost:3000/posts');
      const data = await res.json();
      const posts: PostType[] = Array.isArray(data.posts) ? data.posts : data;
      const othersPosts = posts.filter((post) => post.user_id != user?.id);
      const filtered = othersPosts.filter((post: PostType) => {
        const actionTime = Number(post.actionDate);

        const matchesTitle = title === '' || post.title.toLowerCase().includes(title.toLowerCase());
        const matchesJob = !selectedJob || (post.jobs && post.jobs.includes(selectedJob.value));
        const matchesCountry = !country || post.country === country.label;
        const matchesCounty =
          !state || (post.county && normalize(post.county) === normalize(state.label));

        const matchesCity = !city || (post.city && normalize(post.city) === normalize(city.label));

        const matchesStartDate = !startDate || actionTime >= startDate.setHours(0, 0, 0, 0);
        const matchesEndDate = !endDate || actionTime <= endDate.setHours(23, 59, 59, 999);

        return (
          matchesTitle &&
          matchesJob &&
          matchesCountry &&
          matchesCounty &&
          matchesCity &&
          matchesStartDate &&
          matchesEndDate
        );
      });

      setPosts(filtered);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

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
    if (filtersChanged) {
      handleApply();
      setFiltersChanged(false);
    }
  }, [filtersChanged]);

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

  const settings = {
    infinite: true,
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    speed: 500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: '0px',
        },
      },
    ],
  };
  const applyToPost = async (postId: string) => {
    if (!user) {
      alert('You must be logged in to apply.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_id: user.id,
        }),
      });

      const resultText = await res.text();
      if (!res.ok) {
        console.error('Server error:', res.status, resultText);
        throw new Error('Failed to apply');
      }

      alert('Application submitted!');
      setApplyDialogOpen(false);
    } catch (err) {
      alert('Already applied.');
    }
  };

  return (
    <div>
      <div ref={searchRef} className="h-screen w-full bg-background">
        <div className="w-full max-w-6xl mx-auto py-10 px-4 bg-background h-3/5">
          <Slider ref={sliderRef} {...settings}>
            {allPosts.map((post, idx) => (
              <div
                key={idx}
                className="px-2 hover:cursor-pointer"
                onClick={() => {
                  setSelectedPost(post);
                  setApplyDialogOpen(true);
                }}
              >
                <img
                  src={post.imagesUrls?.[0] || '/icons/image-placeholder.svg'}
                  alt={`post-${idx}`}
                  className="rounded-[2rem] w-full h-[300px] object-cover shadow-md"
                />
              </div>
            ))}
          </Slider>

          <div className="flex justify-center items-center gap-10 mt-6">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="text-primary hover:text-selected transition"
            >
              <ArrowBackIosNew fontSize="large" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="text-primary hover:text-selected transition"
            >
              <ArrowForwardIos fontSize="large" />
            </button>
          </div>
        </div>
        <div className="flex w-screen items-center justify-center">
          <div className="flex flex-col w-full items-center justify-center">
            <SearchInput
              placeholder="Search by title ..."
              icon={Search}
              value={title}
              onChange={setTitle}
            />
            <Button
              text={'Search'}
              icon={<Search />}
              onClick={() => {
                handleApply();
                setStatusSearched(true);
                setTimeout(() => {
                  resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }}
            />
          </div>
        </div>
      </div>
      {statusSearched && (
        <div ref={resultsRef} className="h-screen w-full bg-background  pb-4">
          <div className="flex items-center gap-4 flex-wrap p-4">
            <div className="flex items-center border rounded-full px-4 py-2 bg-white shadow-sm w-full max-w-md">
              <input
                type="text"
                placeholder="Title Searched"
                className="flex-grow bg-transparent focus:outline-none"
                value={title || ''}
                readOnly
              />
              <TuneIcon onClick={() => setOpen(true)} className="cursor-pointer" />
            </div>

            <div className="flex gap-2 flex-wrap">
              {country && (
                <FilterDisplay
                  text={country.label}
                  onClick={() => {
                    setCountry(null);
                    setFiltersChanged(true);
                  }}
                />
              )}
              {state && (
                <FilterDisplay
                  text={state.label}
                  onClick={() => {
                    setState(null);
                    setFiltersChanged(true);
                  }}
                />
              )}
              {city && (
                <FilterDisplay
                  text={city.label}
                  onClick={() => {
                    setCity(null);
                    setFiltersChanged(true);
                  }}
                />
              )}
              {selectedJob && (
                <FilterDisplay
                  text={selectedJob.label}
                  onClick={() => {
                    setSelectedJob(undefined);
                    setFiltersChanged(true);
                  }}
                />
              )}
              {title && (
                <FilterDisplay
                  text={title}
                  onClick={() => {
                    setTitle('');
                    setFiltersChanged(true);
                  }}
                />
              )}
              {startDate && (
                <FilterDisplay
                  text={`From: ${startDate.toLocaleDateString()}`}
                  onClick={() => {
                    setStartDate(null);
                    setFiltersChanged(true);
                  }}
                />
              )}
              {endDate && (
                <FilterDisplay
                  text={`To: ${endDate.toLocaleDateString()}`}
                  onClick={() => {
                    setEndDate(null);
                    setFiltersChanged(true);
                  }}
                />
              )}
            </div>
          </div>
          <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Filter Posts</h2>
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className="space-y-4">
                <InputField
                  label={'Title'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type={'text'}
                  placeholder={''}
                />

                <div className="flex gap-2 lg:flex-row flex-col justify-center items-center">
                  <DropdownSelect
                    options={jobsData}
                    value={selectedJob}
                    onChange={setSelectedJob}
                    job={true}
                  />
                </div>
                <div className="flex lg:flex-row flex-col gap-2 ">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div>
                      <DatePicker<Date>
                        label="Start Date"
                        value={startDate}
                        minDate={new Date()}
                        onChange={(newValue: Date | null) => {
                          if (endDate && newValue && newValue > endDate) {
                            return;
                          }
                          setStartDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                    <DatePicker<Date>
                      label="End Date"
                      value={endDate}
                      minDate={new Date()}
                      onChange={(newValue: Date | null) => {
                        if (startDate && newValue && newValue < startDate) {
                          return;
                        }
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>

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

              <div className="flex justify-between mt-6 px-1">
                <Button text={'Reset'} nav={true} onClick={handleReset} />
                <Button text={'Search'} icon={<Search />} onClick={handleApply} />{' '}
              </div>
            </div>
          </Dialog>

          {posts.length === 0 ? (
            <p className="text-text">No posts found with these filters.</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-text px-4 font-thin mb-4">
                Posts matching your search...
              </h2>

              <div className="flex flex-col items-center gap-4 h-2/3 w-full bg-bg">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex lg:flex-row flex-col bg-white border rounded-xl p-4 shadow-sm h-2/5 w-3/4 gap-2"
                  >
                    <div className="lg:w-1/4">
                      {Array.isArray(post.imagesUrls) && post.imagesUrls.length > 0 && (
                        <Carousel
                          autoPlay={false}
                          indicators={post.imagesUrls.length > 1}
                          navButtonsAlwaysVisible={post.imagesUrls.length > 1}
                          animation="slide"
                          duration={300}
                          className="h-full"
                          navButtonsProps={{
                            style: {
                              backgroundColor: 'rgba(0,0,0,0.4)',
                              borderRadius: 8,
                            },
                          }}
                        >
                          {post.imagesUrls.map((src, index) => (
                            <Paper
                              key={index}
                              elevation={0}
                              style={{ height: '100%', overflow: 'hidden', borderRadius: 8 }}
                            >
                              <img
                                src={src}
                                alt={`Post image ${index + 1}`}
                                className="w-full h-28 object-cover rounded-md"
                              />
                            </Paper>
                          ))}
                        </Carousel>
                      )}
                    </div>

                    <div className=" w-2/4 flex flex-col justify-between">
                      <div className="flex flex-col gap-0 h-1/3">
                        <h3 className="text-xl font-semibold text-text">{post.title}</h3>{' '}
                        <ReactMarkdown>{post.body}</ReactMarkdown>
                      </div>

                      <div className="flex gap-4 text-sm text-text-secondary h-2/3 items-center">
                        {post.country && <span>Country: {post.country}</span>}
                        {post.county && <span>County: {post.county}</span>}
                        {post.city && <span>City: {post.city}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end w-1/4">
                      <p className="text-sm text-text-secondary">
                        Date:
                        {post.actionDate
                          ? new Date(Number(post.actionDate)).toLocaleDateString()
                          : 'N/A'}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Price: {post.price || 'FREE'} LEI
                      </p>
                      {isAdmin ? (
                        <div>
                          <Button
                            text={'Edit'}
                            className="w-full flex justify-center"
                            icon={<Edit />}
                            onClick={() => navigate(`/edit-post/${post.id}`)}
                          />
                        </div>
                      ) : (
                        <Button
                          text={'Apply'}
                          className="w-1/3"
                          icon={<ArrowForwardIos />}
                          onClick={() => {
                            setSelectedPost(post);
                            setApplyDialogOpen(true);
                          }}
                        />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(post.jobs) &&
                        post.jobs.map((jobId) => (
                          <span
                            key={jobId}
                            className="bg-primary text-white px-2 py-1 rounded text-xs"
                          >
                            Job ID: {jobId}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="w-full justify-center mt-10 pt-6">
                <div className="flex justify-center items-center gap-4 rounded-lg px-6 py-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="text-sm text-text-secondary">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
              <div
                className="w-full flex justify-end pr-4"
                onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ArrowUpward className="text-primary" />
              </div>
            </>
          )}
        </div>
      )}
      <Dialog
        open={applyDialogOpen}
        onClose={() => setApplyDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Post Details</h2>
            <IconButton onClick={() => setApplyDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          {selectedPost && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Title: {selectedPost.title}</h3>
              <ReactMarkdown>{selectedPost.body}</ReactMarkdown>

              <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                <span>Country: {selectedPost.country}</span>
                <span>County: {selectedPost.county}</span>
                <span>City: {selectedPost.city}</span>
                <span>
                  Date:{' '}
                  {selectedPost.actionDate
                    ? new Date(Number(selectedPost.actionDate)).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>

              {Array.isArray(selectedPost.imagesUrls) && selectedPost.imagesUrls.length > 0 && (
                <Carousel
                  autoPlay={false}
                  indicators={selectedPost.imagesUrls.length > 1}
                  navButtonsAlwaysVisible={selectedPost.imagesUrls.length > 1}
                  animation="slide"
                  duration={300}
                  className="h-full"
                  navButtonsProps={{
                    style: {
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      borderRadius: 8,
                    },
                  }}
                >
                  {selectedPost.imagesUrls.map((src, index) => (
                    <Paper key={index} elevation={0} style={{ borderRadius: 8 }}>
                      <img
                        src={src}
                        alt={`Image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </Paper>
                  ))}
                </Carousel>
              )}

              <div className="flex justify-center pt-4">
                {!isAdmin && (
                  <Button
                    text="Apply"
                    icon={<ArrowForwardIos />}
                    onClick={() => selectedPost && applyToPost(selectedPost.id)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Posts;
