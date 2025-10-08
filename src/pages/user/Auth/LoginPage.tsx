import React, { useState } from 'react';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth'; // Import useAuth hook


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from the hook


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await api.post('/auth/login', { username, password });
      const { access_token } = resp.data as any;
      await login(access_token); // Use the login function to set token and fetch user
      // localStorage.setItem('access_token', access_token);
      toast.success('Login successful! Redirecting...');
      // navigate('/');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-3xl font-medium mb-4 text-center">Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <button type="submit" className="w-full px-5 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
      </form>
    </div>
    </div>
    <ToastContainer position="top-center" />
    </>
  );
};

export default LoginPage;