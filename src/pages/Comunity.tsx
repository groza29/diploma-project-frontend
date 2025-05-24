import React, { useEffect, useRef, useState } from 'react';

import { ArrowUpward, Search } from '@mui/icons-material';
import { OptionType } from '../models/OptionType';
import SearchInput from '../components/SearchInput';
import DropdownSelect from '../components/DropdownSelect';
import Button from '../components/Button';
import SearchDropdown from '../components/SearchDropdown';
import { useUser } from '../context/UserContext';
import TuneIcon from '@mui/icons-material/Tune';
import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InputField from '../components/InputField';
import FilterDisplay from '../components/FilterDisplay';
import { useNavigate } from 'react-router-dom';

const Community: React.FC = () => {
  const GEO_NAMES_USERNAME = 'groza29';
  const { user } = useUser();
  const token = localStorage.getItem('token');

  const [users, setUsers] = useState<any[]>([]);

  const navigate = useNavigate();

  const resultsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [selectedJob, setSelectedJob] = useState<OptionType | undefined>();
  const [name, setName] = useState('');
  const [country, setCountry] = useState<OptionType | null>(null);
  const [state, setState] = useState<OptionType | null>(null);
  const [city, setCity] = useState<OptionType | null>(null);
  const [rating, setRating] = useState<OptionType | null>();

  const [jobsData, setJobData] = useState<OptionType[]>([]);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [states, setStates] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);

  const [statusSearched, setStatusSearched] = useState<boolean>(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  const [open, setOpen] = useState(false);
  const ratingOptions = [
    { label: 'All Ratings', value: '' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' },
    { label: '5', value: '5' },
  ];
  {
    /* Pagination */
  }
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:3000/jobs', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
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
    if (countries.length > 0 && user?.country) {
      const defaultCountry = countries.find((c) => c.label === user.country);
      if (defaultCountry) {
        setCountry(defaultCountry);
      }
    }
  }, [countries, user?.country]);
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
    if (states.length > 0 && user?.county) {
      const defaultState = states.find((s) => s.label === user.county);
      if (defaultState) {
        setState(defaultState);
      }
    }
  }, [states, user?.county]);

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
    if (cities.length > 0 && user?.city) {
      const defaultCity = cities.find((c) => c.label === user.city);
      if (defaultCity) {
        setCity(defaultCity);
      }
    }
  }, [cities, user?.city]);
  const handleReset = () => {
    setName('');
    setSelectedJob(undefined);
    setRating(null);
    setCountry(null);
    setState(null);
    setCity(null);
  };

  const handleApply = async () => {
    setOpen(false);
    setStatusSearched(true);

    try {
      const res = await fetch('http://localhost:3000/users', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      const data = await res.json();

      const filtered = data.filter((user: any) => {
        const matchesName =
          name === '' ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(name.toLowerCase());
        const matchesJob =
          !selectedJob || user.jobs.some((job: any) => job.id === selectedJob.value);
        const matchesRating = !rating || user.rating >= parseFloat(rating.value as string);
        const matchesCountry = !country || user.country === country.label;
        const matchesState = !state || user.county === state.label;
        const matchesCity = !city || user.city === city.label;

        return (
          matchesName &&
          matchesJob &&
          matchesRating &&
          matchesCountry &&
          matchesState &&
          matchesCity
        );
      });

      setUsers(filtered);
      setOpen(false);
      setStatusSearched(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    console.log(filtersChanged);
    if (filtersChanged) {
      handleApply();
      setFiltersChanged(false);
    }
  }, [filtersChanged]);
  return (
    <div>
      <div className="w-full h-screen bg-background">
        <div
          ref={searchRef}
          className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-75"
            style={{ backgroundImage: 'url("/images/register4.jpg")' }}
          ></div>

          {/* Foreground content */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <div className="flex flex-col gap-6 px-6 py-10 w-full max-w-4xl">
              {/* Search Inputs */}
              <div className="flex lg:flex-row flex-col w-full gap-6 items-center">
                <SearchInput
                  placeholder="Search by name ..."
                  icon={Search}
                  value={name}
                  onChange={setName}
                />
                <DropdownSelect
                  options={jobsData}
                  value={selectedJob}
                  onChange={setSelectedJob}
                  job={true}
                />
              </div>

              {/* Job Dropdown */}
              <div className="w-full flex lg:flex-row flex-col items-center justify-center gap-2">
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

                {/* State/Region Dropdown */}
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

                {/* City Dropdown */}
                <SearchDropdown
                  options={cities}
                  label="City"
                  selectedOption={city}
                  setSelectedOption={setCity}
                  style={true}
                />
              </div>

              {/* Search Button */}
              <div className="w-full flex items-center justify-center">
                <Button text="Search" onClick={handleApply} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {statusSearched && (
        <div ref={resultsRef} className="w-full h-screen px-4 py-2 bg-background">
          <>
            <div className="flex items-center gap-4 flex-wrap p-4">
              <div className="flex items-center border rounded-full px-4 py-2 bg-white shadow-sm w-full max-w-md">
                <input
                  type="text"
                  placeholder="Name Searched"
                  className="flex-grow bg-transparent focus:outline-none"
                  value={name || ''}
                  readOnly
                />
                <TuneIcon onClick={() => setOpen(true)} className="cursor-pointer" />
              </div>

              <>
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
                {name && (
                  <FilterDisplay
                    text={name}
                    onClick={() => {
                      setName('');
                      setFiltersChanged(true);
                    }}
                  />
                )}
                {rating && (
                  <FilterDisplay
                    text={rating.label}
                    onClick={() => {
                      setRating(null);
                      setFiltersChanged(true);
                    }}
                  />
                )}
              </>
            </div>
            {/* Dialog code */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Filter People</h2>
                  <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </div>

                <div className="space-y-4">
                  <InputField
                    label={'Name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

                    <DropdownSelect options={ratingOptions} value={rating} onChange={setRating} />
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
                  <Button text={'Apply now'} onClick={handleApply} />
                </div>
              </div>
            </Dialog>
          </>

          {users.length === 0 ? (
            <p className="text-text">No users found with these filters.</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-text px-4 font-thin mb-4">
                People matching your search...
              </h2>
              <div className="flex flex-col items-center gap-4  h-2/3 w-4/4 bg-bg">
                {currentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm w-3/4"
                  >
                    <div className="flex gap-4">
                      <img
                        src={user.avatarUrl}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            './images/undraw_professional-woman-avatar_ivds.svg';
                        }}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-20 h-20 rounded-full object-cover bg-gray-300"
                      />
                      <div>
                        <h3 className="lg:text-lg text-sm font-semibold text-text">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="lg:text-sm text-xs text-text-secondary">
                          Rating: {user.rating}
                        </p>
                        <p className="lg:text-sm text-xs text-text-secondary">
                          {user.city}, {user.county}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        text={'Go To Profile'}
                        onClick={() => navigate(`/profile/${user.id}`)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="w-full flex justify-center mt-8">
                <div className="flex justify-center items-center gap-4  rounded-lg px-4 py-2">
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
            </>
          )}

          <div
            className="w-full flex justify-end pr-4"
            onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            <ArrowUpward className="text-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
