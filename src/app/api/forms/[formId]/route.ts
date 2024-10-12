import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET method handler
export async function GET(req: NextRequest, { params }: { params: { formId: string } }) {
  const { formId } = params;

  console.log(`Received GET request for formId: ${formId}`); // Log the request method

  if (!ObjectId.isValid(formId)) {
    return NextResponse.json({ message: 'Invalid form ID' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('video_player');
    
    const form = await db.collection('customer_feedback').findOne({ _id: new ObjectId(formId) });
    if (!form) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Failed to fetch form details', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error' }, { status: 500 });
  }
}
