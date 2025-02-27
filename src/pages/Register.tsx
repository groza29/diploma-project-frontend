import React, { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Steps from '../components/Steps';
import TextWithLinksProps from '../components/TextsWithLinks';
import PasswordValidations from '../components/PasswordValidations';
import SearchDropdown from '../components/SearchDropdown';
import { OptionType } from '../models/OptionType';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Image from '../components/Image';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countries, setCountries] = useState<OptionType[]>([]);
  const [country, setCountry] = useState<OptionType | null>(null);
  const [states, setStates] = useState<OptionType[]>([]);
  const [state, setState] = useState<OptionType | null>(null);
  const [cities, setCities] = useState<OptionType[]>([]);
  const [city, setCity] = useState<OptionType | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  // Password validation state
  const [passwordValidations, setPasswordValidations] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
    mustMatch: false,
  });

  // Real-time validation logic
  useEffect(() => {
    setPasswordValidations({
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      isLongEnough: password.length >= 8,
      mustMatch: password === confirmPassword,
    });
  }, [password, confirmPassword]);

  const GEO_NAMES_USERNAME = 'groza29';

  // Fetch countries from restcountries.com
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

  // Fetch states/regions when a country is selected
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

  // Fetch cities when a state is selected
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

  const handleSubmit = async () => {
    if (
      !name ||
      !surname ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !country ||
      !state ||
      !city
    ) {
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

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const userData = {
      firstName: name,
      lastName: surname,
      email,
      password,
      phoneNumber,
      country: country.label,
      county: state.label,
      city: city.label,
    };

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      Swal.fire({
        icon: 'success',
        title: 'Register Successful!',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
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

  return (
    <div className="flex h-screen">
      {/* Left Section - Image */}
      <div className="hidden lg:w-4/6 lg:block">
        <Image source="/images/register4.jpg" />
      </div>

      {/* Right Section - Form */}
      <div className="lg:w-2/6 w-full flex items-center justify-center bg-background">
        <div className="w-96">
          {step === 1 && (
            <>
              {/* Step 1: Name & Email */}
              <InputField
                label="Last Name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <InputField
                label="First Name"
                type="text"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />

              <InputField
                label="Email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextWithLinksProps
                textPrimary="Already have an account?"
                textSecondary="Log in here!"
                route="/login"
              />

              <Steps step={step} />

              <div className="flex items-center justify-center">
                <Button onClick={() => setStep(2)} text="Next →" nav={false} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              {/* Step 2: Password */}

              <InputField
                label="Password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPasswordToggle
              />

              <InputField
                label="Confirm Password"
                type="password"
                placeholder="Re-Enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showPasswordToggle
              />

              {/* Password Strength Validation */}
              <div className="mt-4 text-sm">
                <div className="flex  justify-between mx-4">
                  <PasswordValidations
                    text="one lowercase letter"
                    status={passwordValidations.hasLowercase}
                  />

                  <PasswordValidations
                    text="one uppercase letter"
                    status={passwordValidations.hasUppercase}
                  />
                </div>
                <div className="flex justify-between mx-4 my-4">
                  <PasswordValidations
                    text="one special character"
                    status={passwordValidations.hasSpecialChar}
                  />
                  <PasswordValidations
                    text="8 characters minimum"
                    status={passwordValidations.isLongEnough}
                  />
                </div>
                <div className="flex justify-between mx-4 my-4">
                  <PasswordValidations text="one number" status={passwordValidations.hasNumber} />
                  <PasswordValidations
                    text="passwords must match"
                    status={passwordValidations.mustMatch}
                  />
                </div>
                <Steps step={step} />
              </div>

              {/* Back & Register Buttons */}
              <div className="flex justify-between mt-6">
                <Button text="← Back" nav={true} onClick={() => setStep(1)} />
                <Button text="Next →" nav={false} onClick={() => setStep(3)} />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              {/* Step 3: Phone Number + Country County and City */}
              <InputField
                label="Phone Number"
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {/* Country Dropdown */}
              <SearchDropdown
                options={countries}
                label="Country"
                selectedOption={country}
                setSelectedOption={(value) => {
                  setCountry(value);
                  setState(null);
                  setCity(null);
                }}
              />

              {/* State/Region Dropdown */}
              <SearchDropdown
                options={states}
                label="State/Region"
                selectedOption={state}
                setSelectedOption={(value) => {
                  setState(value);
                  setCity(null);
                }}
              />

              {/* City Dropdown */}
              <SearchDropdown
                options={cities}
                label="City"
                selectedOption={city}
                setSelectedOption={setCity}
              />

              <Steps step={3} />
              <div className="flex justify-between mt-6">
                <Button nav={true} onClick={() => setStep(2)} text="← Back" />
                <Button text="Sign in" type="submit" onClick={handleSubmit} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
