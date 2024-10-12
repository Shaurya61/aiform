"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Form = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    feedback: '',
    rating: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button and change text

    try {
      // Send data to API
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to thank you page if successful
        router.push('/thank-you');
      } else {
        // Handle errors (optional)
        console.error('Error submitting the form');
        setIsSubmitting(false); // Enable the button again if there's an error
      }
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false); // Enable the button again in case of network issues
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div
        className="max-w-lg w-full mx-auto bg-white shadow-xl rounded-xl p-8 space-y-6 transform transition-transform hover:shadow-2xl hover:-translate-y-2"
      >
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">We Value Your Feedback</h2>

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
            <label htmlFor="rating" className="block text-sm font-medium text-gray-600">
              Rating
            </label>
            <select
              id="rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              {[
                { value: 1, label: "1 - Very Bad" },
                { value: 2, label: "2 - Bad" },
                { value: 3, label: "3 - Neutral" },
                { value: 4, label: "4 - Good" },
                { value: 5, label: "5 - Excellent" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-medium py-3 rounded-lg shadow-md transform transition duration-300 ease-in-out ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 hover:scale-105'}`}
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'} {/* Change text while submitting */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
