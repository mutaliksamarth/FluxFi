'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const  {data:session}  = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    phone: '',
    password: ''
  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInputs = () => {
    if (!credentials.phone.match(/^[0-9]{10}$/)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  const handleSignIn = async () => {
    setError('');

    if (!validateInputs()) {
      return;
    }

    console.log(session);

    try {
      setIsLoading(true);
      const response = await signIn('credentials', {
        phone: credentials.phone,
        password: credentials.password,
        redirect: false
      });

      if (response?.error) {
        setError('Invalid phone number or password');
        return;
      }

      if (response?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
              Welcome 
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="Enter your phone number"
                value={credentials.phone}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 dark:disabled:bg-purple-800 transition-colors duration-200"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}