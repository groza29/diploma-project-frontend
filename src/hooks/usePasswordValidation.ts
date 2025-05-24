import { useEffect, useState } from 'react';

export interface PasswordValidation {
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isLongEnough: boolean;
  mustMatch: boolean;
}

export const usePasswordValidation = (password: string, confirmPassword: string) => {
  const [validations, setValidations] = useState<PasswordValidation>({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
    mustMatch: false,
  });

  useEffect(() => {
    setValidations({
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      isLongEnough: password.length >= 8,
      mustMatch: password === confirmPassword,
    });
  }, [password, confirmPassword]);

  return validations;
};
