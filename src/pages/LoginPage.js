import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import loginImage from '../images/christian-buehner-Fd6osyVbtG4-unsplash.jpg';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/login', { email, password });
      const { token } = response.data;
      login(token);
      localStorage.setItem('userEmail', email);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      toast.error('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded p-4 md:p-8">
        <div className="md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
          <img
            src={loginImage}
            alt="christian-buehner-Fd6osyVbtG4-unsplash"
            className="w-full h-auto"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <form
            onSubmit={handleLogin}
            className="px-4 md:px-8 pt-6 pb-4 mb-4 md:mb-0"
          >
            <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">&copy;2024 Januszex. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
