import React, { useEffect, useState } from 'react';
import { getReviewsByStatus, moderateReview, adminDeleteReview } from '../../../services/productService';
import type { ProductReviewDTO } from '../../../services/types';
import { ToastContainer, toast } from 'react-toastify';

const ReviewModerationPage: React.FC = () => {
  const [reviews, setReviews] = useState<ProductReviewDTO[]>([]);
  const [status, setStatus] = useState('PENDING');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByStatus(status, page, 10);
        setReviews(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [status, page]);

  const handleModerate = async (reviewId: number, newStatus: string) => {
    try {
      const updatedReview = await moderateReview(reviewId, newStatus);
      setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));
      toast.success('Review status updated');
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await adminDeleteReview(reviewId);
        setReviews(reviews.filter(r => r.id !== reviewId));
        toast.success('Review deleted successfully');
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Review Moderation</h1>
      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Review
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.id}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.username}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.rating}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.reviewText}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.status}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {review.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleModerate(review.id, 'APPROVED')}
                        className="text-green-500 hover:underline mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerate(review.id, 'REJECTED')}
                        className="text-red-500 hover:underline mr-2"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default ReviewModerationPage;