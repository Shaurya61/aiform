"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ThankYou = () => {
  const router = useRouter();

  // Automatically redirect to home after a few seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 20000); // Redirect after 5 seconds
    return () => clearTimeout(timer); // Clean up timer
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-6">
        <h1 className="text-4xl font-bold text-green-700">Thank You!</h1>
        <p className="text-lg text-gray-600">
          Your feedback has been successfully submitted. We value your input and will use it to improve our services.
        </p>

        <div className="mt-4">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-transform duration-300 ease-in-out transform hover:scale-105"
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
        </div>

        <p className="text-sm text-gray-400">You will be redirected to the homepage in a few seconds.</p>
      </div>
    </div>
  );
};

export default ThankYou;
