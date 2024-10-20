import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt'; // Import getToken from NextAuth

export async function POST(req: NextRequest) {
  try {
    // Get the session or token using NextAuth's getToken method
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.sub; // Extract userId from the token (sub property)

    // Parse form data from the request body
    const body = await req.json();
    const { formUrlId, formName, formDescription } = body;

    if (!formUrlId || !formName || !formDescription) {
      return NextResponse.json({ error: 'FormUrlId, FormName, and FormDescription are required' }, { status: 400 });
    }

    // Insert the form data into MongoDB
    const client = await clientPromise;
    const db = client.db('video_player');
    const formsCollection = db.collection('forms');

    const formLink = `http://localhost:3000/form/${formUrlId}`;
    
    const form = {
      formUrlId,
      userId,
      formLink,
      formName,
      formDescription,
      createdAt: new Date(),
    };

    // Insert the form into the database
    await formsCollection.insertOne(form);

    return NextResponse.json({ message: 'Form created successfully', formLink, form }, { status: 200 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}
