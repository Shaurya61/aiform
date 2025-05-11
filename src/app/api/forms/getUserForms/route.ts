import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    // Combine token existence and user ID check
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = token.sub;

    // Connect to MongoDB (clientPromise already caches the connection)
    const client = await clientPromise;
    const db = client.db('video_player');

    // Use projection to limit the fields returned (adjust as needed)
    const forms = await db
      .collection('forms')
      .find(
        { userId },
        { projection: { formName: 1, formDescription: 1, formUrlId: 1, createdAt: 1 } }
      )
      .toArray();

    return NextResponse.json({ forms }, { status: 200 });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}
