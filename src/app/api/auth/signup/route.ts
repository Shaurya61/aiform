import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('video_player')

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    try {
      // Attempt to insert the new user directly
      await db.collection('users').insertOne({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      })
    } catch (error: any) {
      // Check if the error is due to a duplicate key (user already exists)
      if (error.code === 11000) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
