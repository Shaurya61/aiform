import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('video_player');
    const users = db.collection('users');

    const refreshToken = req.cookies.get('token');

    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token found' }, { status: 400 });
    }

    // Find the user and clear the refresh token in the database
    await users.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });

    // Clear cookies
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    response.cookies.set('token', '', { maxAge: -1, path: '/' });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to log out' }, { status: 500 });
  }
}
