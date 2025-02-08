import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Validation
  const passwordValidations = {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
    isLongEnough: password.length >= 8,
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - Image */}
      <div className="w-4/6">
        <img
          src="/images/register4.jpg"
          className="w-full h-full object-cover shadow-lg"
          alt="Register"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-2/6 flex items-center justify-center bg-background">
        <div className="w-96">
          {step === 1 ? (
            <>
              {/* Step 1: Name & Email */}
              <label className="block text-text mb-2">Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md bg-white px-4 py-4 border border-border text-base text-text focus:outline-none focus:ring-2 focus:selected placeholder-selected placeholder-opacity-45"
              />

              <label className="block text-text mt-4 mb-2">Surname</label>
              <input
                type="text"
                placeholder="First Name"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="block w-full rounded-md bg-white px-4 py-4 border border-border text-base text-text focus:outline-none focus:ring-2 focus:selected placeholder-selected placeholder-opacity-45"
              />

              <label className="block text-text mt-4 mb-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-4 py-4 border border-border text-base text-text focus:outline-none focus:ring-2 focus:selected placeholder-selected placeholder-opacity-45"
              />

              <p className="text-sm text-selected text-opacity-45 mt-2">
                Already have an account?{' '}
              </p>
              <a
                href="/login"
                className="text-sm font-semibold text-selected text-opacity-45 mt-2 text-selected hover:underline"
              >
                Log in here!
              </a>
              <div className="flex items-center justify-center">
                <p className="text-5xl font-bold text-selected text-opacity-45">.</p>
                <p className="text-5xl font-bold text-selected text-opacity-20">.</p>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setStep(2)}
                  className="bg-background text-button py-2 rounded-md mt-4  transition"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Password */}
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                Create Password
              </h2>

              <label className="block text-text mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Value"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-selected"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <label className="block text-text mt-4 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Value"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-selected"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Strength Validation */}
              <div className="mt-4 text-sm">
                <p className={passwordValidations.hasLowercase ? 'text-green-600' : 'text-red-600'}>
                  ✔ one lowercase letter
                </p>
                <p className={passwordValidations.hasUppercase ? 'text-green-600' : 'text-red-600'}>
                  ✔ one uppercase letter
                </p>
                <p
                  className={passwordValidations.hasSpecialChar ? 'text-green-600' : 'text-red-600'}
                >
                  ✔ one special character
                </p>
                <p className={passwordValidations.isLongEnough ? 'text-green-600' : 'text-red-600'}>
                  ✔ 8 characters minimum
                </p>
                <p className={passwordValidations.hasNumber ? 'text-green-600' : 'text-red-600'}>
                  ✖ one number
                </p>
              </div>

              {/* Back & Register Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="bg-background text-button py-2 px-4 rounded-md hover:bg-gray-500 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
