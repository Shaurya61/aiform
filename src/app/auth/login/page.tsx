'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import LoginBackgroundDecoration from '@/components/ui/loginbackground-decoration'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    const { email, password } = formData;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Handle successful login (e.g., store token, redirect, etc.)
        console.log('Login successful:', data);
        // Example: Redirect to homepage or dashboard
        router.push('/form-analysis');

    } catch (error) {
        console.error('Error:', error);
        // Optionally set an error state to display to the user
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <LoginBackgroundDecoration />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          className="bg-white shadow-2xl rounded-2xl p-8 space-y-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h1 className="text-3xl font-bold text-center text-gray-800">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              icon="mail"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              icon="lock"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
                Forgot password?
              </a>
            </div>
            <Button type="submit" isLoading={isLoading}>
              Log In
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Sign up
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
