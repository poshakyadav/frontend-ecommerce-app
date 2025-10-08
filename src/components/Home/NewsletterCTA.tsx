// src/components/Home/NewsletterCTA.tsx

import React, { useState } from 'react';

const NewsletterCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    setMessage(''); // Clear previous messages
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      // In a real application, replace this with an actual API call to your backend
      // Example: await api.post('/newsletter/subscribe', { email });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      setMessage('Subscription failed. Please try again later.');
    }
  };

  return (
    <section className="hm-newsletter bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 px-4 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Connected!</h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Join our newsletter for exclusive offers, new product alerts, and more.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full sm:w-80 p-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          aria-label="Email for newsletter"
        />
        <button
          onClick={handleSubscribe}
          className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105"
        >
          Subscribe
        </button>
      </div>
      {message && (
        <p className={`mt-4 text-lg ${message.includes('Thank you') ? 'text-green-200' : 'text-red-200'}`}>
          {message}
        </p>
      )}
    </section>
  );
};

export default NewsletterCTA;