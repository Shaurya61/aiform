import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt'; // Import getToken from NextAuth

export async function GET(req: NextRequest) {
  try {
    // Fetch the token using NextAuth's getToken function
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // Check if token exists
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract user ID from the token (usually it's in the 'sub' field)
    const userId = token.sub;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token: missing user ID' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('video_player');
    const formsCollection = db.collection('forms');

    // Fetch forms created by the logged-in user
    const forms = await formsCollection.find({ userId }).toArray();

    // Return the forms in the response
    return NextResponse.json({ forms }, { status: 200 });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}
