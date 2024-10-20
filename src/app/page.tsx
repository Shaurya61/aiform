'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Share2, Brain } from 'lucide-react';
import Button from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-indigo-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col md:flex-row items-center justify-between p-10 md:p-20 lg:p-24">
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <h1 className="text-6xl lg:text-7xl font-extrabold text-indigo-800 mb-4 leading-tight">
            Revolutionize Your <span className="text-blue-600">Surveys</span> with AI
          </h1>
          <p className="text-lg lg:text-xl text-indigo-700 mb-8">
            Effortlessly create, share, and analyze forms powered by AI. Get insights in seconds!
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <Button
              type="button"
              onClick={() => (window.location.href = '/auth/login')}
              className="w-72 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Login to Create Forms
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="md:w-1/2 flex justify-center mt-8 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeInOut' }}
        >
          <img
            src="/AIForm2.svg"
            alt="AI Survey Analysis Illustration"
            className="rounded-lg shadow-xl max-w-lg"
          />
        </motion.div>
      </section>


      {/* Features Section */}

      <motion.section
        className="bg-gradient-to-br from-indigo-50 to-indigo-100 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-indigo-800 mb-10">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
            <FeatureCard
              icon={<FileText size={28} />}
              title="Effortless Form Creation"
              description="Quickly design and create personalized forms with an intuitive interface."
            />
            <FeatureCard
              icon={<Share2 size={28} />}
              title="Share Instantly"
              description="Distribute your survey via a single link — no login required for respondents."
            />
            <FeatureCard
              icon={<Brain size={28} />}
              title="AI-Driven Insights"
              description="Let AI handle the analysis, providing fast, deep insights from your responses."
            />
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="bg-gradient-to-r from-indigo-200 to-indigo-300 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-white mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
            {[
              { step: 1, title: 'Create', description: 'Design your survey using our form builder.' },
              { step: 2, title: 'Share', description: 'Distribute your form link effortlessly.' },
              { step: 3, title: 'Analyze', description: 'AI summarizes and highlights key insights.' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-indigo-800 mb-4">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* AI Analysis Showcase Section */}
      <motion.section
        className="bg-indigo-100 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold text-indigo-800 mb-10 text-center">
            AI-Powered Response Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                AI Working For You
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span> Automatic summary of responses.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span> Identifies key trends and insights.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span> Provides sentiment analysis for open-ended responses.
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-inner">
              <h4 className="font-semibold mb-4">Sample AI Analysis Output:</h4>
              <p className="text-sm text-gray-700">
                "Based on 200 responses, 80% are satisfied with product usability. Key areas for improvement include customer
                support and delivery times."
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="bg-blue-500 text-white py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            Start Creating AI-Powered Forms Today
          </h2>
          <Button
            type="button"
            onClick={() => (window.location.href = '/auth/signup')}
            className="bg-blue-900 text-white hover:bg-gray-100 transition-colors w-48"
          >
            Get Started for Free
          </Button>
        </div>
      </motion.section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FormMaster</h3>
            <p className="text-sm text-gray-400">
              AI-powered forms to create, share, and analyze surveys with ease.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} FormMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg p-6 shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};
