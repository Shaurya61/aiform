import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET method handler
export async function GET(req: NextRequest, { params }: { params: { formUrlId: string } }) {
  const { formUrlId } = params;

  try {
    const client = await clientPromise;
    const db = client.db('video_player');

    // Fetch the form data based on the formUrlId
    const form = await db.collection('forms').findOne({ formUrlId });
    const formId = form?._id;

    if (!form) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }

    // Fetch feedback related to this form
    const feedback = await db.collection('customer_feedback').find({ formId: formId }).toArray();

    return NextResponse.json({ ...form, feedback }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ message: 'Failed to fetch form details', error }, { status: 500 });
  }
}
