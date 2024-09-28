import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Named export for the GET method
export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('video_player');
    const feedbackCollection = db.collection('customer_feedback');

    // Fetch all forms
    const forms = await feedbackCollection.find({}).toArray();

    // Return the forms as JSON
    return NextResponse.json({ forms }, { status: 200 });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}
