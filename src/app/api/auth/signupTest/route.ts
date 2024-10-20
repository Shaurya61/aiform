import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db('video_player');
    const users = db.collection('users');

    // Check if the user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Create a JWT
    const token = jwt.sign(
      { userId: result.insertedId, email },
      JWT_SECRET,
      { expiresIn: '1h' } // token expires in 1 hour
    );

    // Set token in HttpOnly cookie
    const response = NextResponse.json({ message: 'User created' }, { status: 201 });
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.error(error); // Log error for debugging
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
