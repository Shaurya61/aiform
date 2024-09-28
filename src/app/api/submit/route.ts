import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getGeminiEmbedding } from '@/lib/geminiClient';
import { initPinecone } from '@/lib/pineconeClient';

export async function POST(req: NextRequest) {
  try {
    const { customerName, feedback, rating } = await req.json();
    const client = await clientPromise;
    const db = client.db('video_player');
    
    // Insert into customer_feedback collection
    const feedbackCollection = db.collection('customer_feedback');
    await feedbackCollection.insertOne({
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
        id: metadata.customerName, // Use a unique identifier for the document
        values: embedding, // The embedding values from Gemini
        metadata, // Attach any additional metadata
      },
    ]);

    return NextResponse.json({ message: 'Feedback submitted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
