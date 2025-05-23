"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BackgroundDecoration from '@/components/ui/loginbackground-decoration';

const Form = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    feedback: '',
    rating: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/thank-you');
      } else {
        console.error('Error submitting the form');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <BackgroundDecoration />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <motion.div
          className="bg-white shadow-2xl rounded-2xl p-8 space-y-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">We Value Your Feedback</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-600">Your Name</label>
              <input
                type="text"
                id="customerName"
                placeholder="John Doe"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-600">Your Feedback</label>
              <textarea
                id="feedback"
                placeholder="Share your thoughts..."
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-600">Rating</label>
              <select
                id="rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {`${value} - ${['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'][value - 1]}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white font-medium py-3 rounded-lg shadow-md transform transition duration-300 ease-in-out ${
                isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 hover:scale-105'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Form;
