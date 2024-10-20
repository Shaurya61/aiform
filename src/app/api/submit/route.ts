import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getGeminiEmbedding } from '@/lib/geminiClient';
import { initPinecone } from '@/lib/pineconeClient';

export async function POST(req: NextRequest) {
  try {
    const { customerName, feedback, rating, formUrlId } = await req.json();

    const client = await clientPromise;
    const db = client.db('video_player');
    const formsCollection = db.collection('forms');
    console.log('formUrlId', formUrlId);
    const form = await formsCollection.findOne({ formUrlId: formUrlId });
    const formId = form?._id; // Assuming formId is stored as _id, or replace _id with the actual field name
    console.log('formId', formId);

    // Insert the feedback into the customer_feedback collection
    const feedbackCollection = db.collection('customer_feedback');
    await feedbackCollection.insertOne({
      formId,
      customerName,
      feedback,
      rating,
      createdAt: new Date(),
    });

    const metadata = {
      customerName,
      feedback,
      rating,
    };

    // Initialize Pinecone and get the index
    const index = await initPinecone();

    // Get the embedding from the Gemini model
    const embedding = await getGeminiEmbedding(feedback);

    // Store the embedding in Pinecone
    await index.upsert([
      {
        id: metadata.customerName,
        values: embedding,
        metadata,
      },
    ]);

    return NextResponse.json({ message: 'Feedback submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}