import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db('video_player');
    const users = db.collection('users');

    // Check if the user exists
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    // Verify the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    const Token = jwt.sign(
      { userId: user._id, email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Set tokens in HttpOnly cookies
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    
    response.cookies.set('token', Token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1 Hour
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
