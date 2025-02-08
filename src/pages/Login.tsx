import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'access-control-allow-origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome!',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Redirect or perform other actions after successful login
    } catch (err: any) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message || 'Something went wrong!',
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
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Email',
      input: 'email',
      inputPlaceholder: 'Your email',
      showCancelButton: true,
      confirmButtonText: 'Reset Password',
      width: '25%',
      customClass: {
        confirmButton:
          'bg-primary text-text py-2 rounded-md mt-2 mb hover:bg-selected transition hover:text-white font-thin',
        cancelButton: 'bg-white text-text py-2 rounded-md mt-2 mb  transition font-thin',
        title: 'text-left font-thin text-md',
        input: 'w-4/5 placeholder-selected placeholder-opacity-45 focus:outline-none ',
      },
    });
    if (email) {
      Swal.fire(`Entered email: ${email}`);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - Login Form */}
      <div className="w-2/5 flex items-center justify-center bg-background">
        <div className="w-96 p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-m font-thin text-text mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-4 py-4 border border-border text-base text-text focus:outline-none focus:ring-2 focus:selected placeholder-selected placeholder-opacity-45"
              />
            </div>
            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-m font-thin text-text mb-2">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-4 py-4 border border-border text-base text-text focus:outline-none focus:ring-2 focus:selected placeholder-selected placeholder-opacity-45"
              />
              {/* Sign Up Link */}
              <p className="mt-6 text-sm font-thin text-text">Don't have an account? </p>
              <a
                href="/register"
                className="font-semibold  text-sm text-selected hover:text-selected text-opacity-60 "
              >
                Sign up here!
              </a>
            </div>
            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-primary font-thin text-text py-2 rounded-md mt-4 mb hover:bg-selected transition hover:text-white"
            >
              Sign In
            </button>
            <div>
              <a
                onClick={handleForgotPassword}
                href="#"
                className="text-sm text-selected hover:text-selected mt-9 text-opacity-60 underline"
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-3/5">
        <img src="/images/login1.jpg" className="w-full h-full object-cover shadow-lg" />
      </div>
    </div>
  );
};

export default Login;
