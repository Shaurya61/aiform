"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion for animations

const ThankYou = () => {
  const router = useRouter();

  // Automatically redirect to home after a few seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 20000); // Redirect after 20 seconds
    return () => clearTimeout(timer); // Clean up timer
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-xl text-center space-y-6 max-w-lg"
      >
        <h1 className="text-4xl font-bold text-indigo-700">Thank You!</h1>
        <p className="text-lg text-gray-600">
          Your feedback has been successfully submitted. We value your input and will use it to improve our services.
        </p>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mt-4"
        >
          <button
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-transform duration-300 ease-in-out transform hover:scale-105"
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
        </motion.div>

        <p className="text-sm text-gray-500">You will be redirected to the homepage in a few seconds.</p>
      </motion.div>
    </div>
  );
};

export default ThankYou;
