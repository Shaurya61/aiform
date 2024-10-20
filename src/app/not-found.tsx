"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="text-center p-8">
        {/* Page animation with Framer Motion */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="text-6xl font-bold text-indigo-600"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 text-xl text-gray-700"
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8"
        >
          <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-500 transition-colors duration-300">
             
              Back to Home
            
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Custom404;
