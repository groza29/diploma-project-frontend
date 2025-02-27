import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import InputField from '../components/InputField';
import Button from '../components/Button';
import TextWithLinksProps from '../components/TextsWithLinks';
import Links from '../components/Links';
import { useNavigate } from 'react-router-dom';
import Image from '../components/Image';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

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
      localStorage.setItem('token', `${data.token}`);
      navigate('/');

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome!',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err: any) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error || 'Something went wrong!',
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
    <div className="flex h-screen flex-wrap">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-background">
        <div className="w-96 p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <InputField
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Input */}
            <InputField
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
            />

            {/* Sign Up Link */}
            <TextWithLinksProps
              textPrimary="Don't have an account?"
              textSecondary="Sign up here!"
              route="/register"
            />
            <Button text="Sign in" type="submit" className="w-full" />
            {/* Forgot Password */}
            <Links text="Forgot password?" route="#" onClick={handleForgotPassword} />
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block lg:w-3/5">
        <Image source="/images/login1.jpg" />
      </div>
    </div>
  );
};

export default Login;
