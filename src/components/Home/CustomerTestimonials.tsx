// src/components/Home/CustomerTestimonials.tsx

import React from 'react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "The quality of products is outstanding, and the customer service is superb! Highly recommend this store.",
    author: "Jane Doe",
    location: "Mumbai, India",
  },
  {
    id: 2,
    quote: "I've found unique items here that I couldn't find anywhere else. Fast shipping and great prices!",
    author: "John Smith",
    location: "Bengaluru, India",
  },
  {
    id: 3,
    quote: "An excellent shopping experience from start to finish. My new favorite online store!",
    author: "Alice Johnson",
    location: "Delhi, India",
  },
];

const CustomerTestimonials: React.FC = () => (
  <section className="hm-testimonials bg-gray-100 py-16 px-4">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-lg italic text-gray-700 mb-6">"{testimonial.quote}"</p>
            <p className="font-semibold text-indigo-600">- {testimonial.author}</p>
            <p className="text-sm text-gray-500">{testimonial.location}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CustomerTestimonials;