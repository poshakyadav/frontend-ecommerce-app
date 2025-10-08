import React, { useState } from 'react';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', phone: '', password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    

    try {
      // Append role manually
    const registerPayload = {
      ...form,
      role: 'USER',
    };
      const resp = await api.post('/auth/register', registerPayload);
      const { access_token } = resp.data as any;
      localStorage.setItem('access_token', access_token);
      toast.success('Registration successful! Redirecting...');
      // navigate('/');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className='text-3xl font-medium mb-4 text-center'>Register</h2>
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-6 mb-6 md:grid-cols-1">
        
        {['firstName','lastName','username','email','phone','password'].map(field => (
          <input
            key={field}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(form as any)[field]}
            onChange={handleChange}
            required
            className="bg-gray-50 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="submit">Register</button>
        </div>
      </form>
      </div>
    </div>
    </div>
    <ToastContainer position="top-center" />
    </>
  );
};

export default RegisterPage;