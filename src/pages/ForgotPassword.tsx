import React, { useState } from 'react';
import InputField from '../components/InputField';
import PasswordValidations from '../components/PasswordValidations';
import Button from '../components/Button';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const validations = usePasswordValidation(password, confirmPassword);
  const navigate = useNavigate();
  const id = useParams();
  const handleSubmit = async () => {
    if (!validations.mustMatch || !validations.isLongEnough) {
      Swal.fire('Error', 'Please ensure the password is valid and both fields match.', 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/password/${id.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password }),
      });

      if (!response.ok) throw new Error('Password reset failed');
      navigate('/login');
      Swal.fire('Success', 'Password updated successfully!', 'success');
    } catch (err) {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary flex justify-center">
          Reset Your Password
        </h2>

        <InputField
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
        />

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPasswordToggle
        />

        <div className="my-4 text-sm">
          <div className="flex justify-between">
            <PasswordValidations text="One lowercase letter" status={validations.hasLowercase} />
            <PasswordValidations text="One uppercase letter" status={validations.hasUppercase} />
          </div>
          <div className="flex justify-between mt-2">
            <PasswordValidations text="One special character" status={validations.hasSpecialChar} />
            <PasswordValidations text="At least 8 characters" status={validations.isLongEnough} />
          </div>
          <div className="flex justify-between mt-2">
            <PasswordValidations text="One number" status={validations.hasNumber} />
            <PasswordValidations text="Passwords match" status={validations.mustMatch} />
          </div>
        </div>

        <Button text="Update Password" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default ForgotPassword;
