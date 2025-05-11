'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {Input} from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const { name, email, password } = formData
    
    try {
      // Send the signup request
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      const data = await response.json()
      router.push('/auth/login')
      console.log(data.message) // Handle success (e.g., redirect, show message)
    } catch (error) {
      console.error('Error during signup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      {/* Removed BackgroundDecoration for consistency */}
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
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input  
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Button type="submit" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/auth/login"
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Log in
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
