"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Share2, Brain } from "lucide-react";
import {Button} from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <header className="w-full py-6 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">FormMaster</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="/support"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Support
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Blog
            </Link>
            <Button
              type="button" // Add this prop
              onClick={() => (window.location.href = "/auth/login")}
              className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col md:flex-row items-center justify-between px-8 py-16 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <motion.div
          className="md:w-1/2 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            One place to <span className="text-purple-700">create</span> all
            your surveys.
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Effortlessly create, share, and analyze forms powered by AI. Get
            actionable insights in seconds.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => (window.location.href = "/auth/login")}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6"
            >
              Start for free
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="md:w-1/2 flex justify-center mt-12 md:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Image
            src="/AIForm2.svg"
            alt="AI Survey Analysis Illustration"
            width={600}
            height={600}
            className="max-w-md md:max-w-lg"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-purple-600 mr-2">
                  <FileText className="h-5 w-5" />
                </span>
                Create everything
              </h3>
              <p className="text-gray-600">
                Design and create personalized forms with our intuitive
                interface in minutes, not hours.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-purple-600 mr-2">
                  <Share2 className="h-5 w-5" />
                </span>
                Share instantly
              </h3>
              <p className="text-gray-600">
                Distribute your survey via a single link — no login required for
                respondents.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-purple-600 mr-2">
                  <Brain className="h-5 w-5" />
                </span>
                AI-powered analysis
              </h3>
              <p className="text-gray-600">
                Let AI handle the analysis, providing fast, deep insights from
                your responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis Showcase Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                AI-Powered Response Analysis
              </h2>
              <p className="text-gray-600 mb-8">
                Transform raw data into actionable insights with our advanced AI
                technology
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Automatic summary of responses with key metrics
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Identifies trends, patterns, and correlations in data
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Sentiment analysis for open-ended responses
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="AI Analysis Dashboard"
                width={400}
                height={400}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Create",
                description:
                  "Design your survey using our intuitive form builder.",
              },
              {
                step: 2,
                title: "Share",
                description:
                  "Distribute your form link to your target audience.",
              },
              {
                step: 3,
                title: "Analyze",
                description:
                  "AI summarizes and highlights key insights automatically.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <span className="font-semibold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Creating AI-Powered Forms Today
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who are saving time and gaining
            deeper insights with our platform.
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/signup")}
            className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 py-6"
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white py-12 px-8 md:px-16 lg:px-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                FormMaster
              </h3>
              <p className="text-gray-600">
                AI-powered forms to create, share, and analyze surveys with
                ease.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/enterprise"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} FormMaster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
