// src/components/Home/BlogSnippet.tsx

import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Tips for Choosing the Perfect Gadget",
    summary: "Confused about your next tech purchase? Our guide helps you make the right choice...",
    imageUrl: "https://via.placeholder.com/400x250/C0C0C0/000000?text=Tech+Tips",
    link: "/blog/gadget-tips",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Sustainable Fashion",
    summary: "Learn how to build a wardrobe that's good for you and the planet...",
    imageUrl: "https://via.placeholder.com/400x250/C0C0C0/000000?text=Fashion+Guide",
    link: "/blog/sustainable-fashion",
  },
  {
    id: 3,
    title: "Home Decor Trends for 2025",
    summary: "Discover the latest styles and ideas to refresh your living space this year...",
    imageUrl: "https://via.placeholder.com/400x250/C0C0C0/000000?text=Home+Decor",
    link: "/blog/home-decor-trends",
  },
];

const BlogSnippet: React.FC = () => (
  <section className="hm-blog-snippet container mx-auto px-4 py-16">
    <h2 className="text-3xl font-bold text-center mb-12">From Our Blog</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogPosts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <img src={post.imageUrl} alt={post.title} className="w-full h-52 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{post.summary}</p>
            <Link
              to={post.link}
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
            >
              Read More &rarr;
            </Link>
          </div>
        </div>
      ))}
    </div>
    <div className="text-center mt-12">
      <Link
        to="/blog" // Link to your full blog page
        className="inline-block bg-gray-800 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-700 transition duration-300"
      >
        View All Blog Posts
      </Link>
    </div>
  </section>
);

export default BlogSnippet;