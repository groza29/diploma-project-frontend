import React, { useEffect, useRef, useState } from 'react';

import { ArrowUpward, Search } from '@mui/icons-material';
import { OptionType } from '../models/OptionType';
import SearchInput from '../components/SearchInput';
import DropdownSelect from '../components/DropdownSelect';
import Button from '../components/Button';
import SearchWithFilters from '../components/SearchWithFilters/SearchWithFilters';
import SearchDropdown from '../components/SearchDropdown';
import { useUser } from '../context/UserContext';

const Community: React.FC = () => {
  const GEO_NAMES_USERNAME = 'groza29';
  const { user } = useUser();

  const resultsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [selectedJob, setSelectedJob] = useState<OptionType | undefined>();
  const [name, setName] = useState('');
  const [country, setCountry] = useState<OptionType | null>(null);
  const [state, setState] = useState<OptionType | null>(null);
  const [city, setCity] = useState<OptionType | null>(null);

  const [jobsData, setJobData] = useState<OptionType[]>([]);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [states, setStates] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);

  const [statusSearched, setStatusSearched] = useState<boolean>(false);

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

  return (
    <div>
      <div className="w-full h-screen bg-background">
        {/* Background Image Section */}
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
                <DropdownSelect options={jobsData} value={selectedJob} onChange={setSelectedJob} />
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
                <Button
                  text="Search"
                  onClick={() => {
                    // Perform your search/filter logic here...

                    // Scroll to results
                    setStatusSearched(true);
                    setTimeout(() => {
                      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 500); // wait 500ms before scrolling
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {statusSearched && (
        <div ref={resultsRef} className="w-full h-screen px-4 py-8 bg-background">
          <SearchWithFilters
            type={'user'}
            countryOptions={countries}
            countrySelected={country}
            countyOptions={states}
            countySelected={state}
            cityOptions={cities}
            citySelected={city}
            jobsOptions={jobsData}
            jobSelected={selectedJob}
            nameSearched={name}
            ratingOptions={[
              { label: 'All Ratings', value: '' },
              { label: '1+', value: '1' },
              { label: '2+', value: '2' },
              { label: '3+', value: '3' },
              { label: '4+', value: '4' },
              { label: '5', value: '5' },
            ]}
          />

          <h2 className="text-lg font-semibold text-text mb-4">People matching your search...</h2>
          {/* this works */}
          {/* <div onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })}>
        <ArrowUpward />
      </div> */}
        </div>
      )}
    </div>
  );
};

export default Community;
