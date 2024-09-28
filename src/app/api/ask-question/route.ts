import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId
import { getGeminiEmbedding, generateEnhancedResponse } from '@/lib/geminiClient';
import { initPinecone } from '@/lib/pineconeClient';

export async function POST(req: NextRequest) {
  try {
    const { formId, question } = await req.json();
    console.log('Received question:', question);
    console.log('Form ID:', formId);

    // Validate the request payload
    if (!formId || !question) {
      return NextResponse.json({ error: 'Form ID and question are required' }, { status: 400 });
    }

    // Convert formId to ObjectId
    const objectId = new ObjectId(formId);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('video_player');
    const feedbackCollection = db.collection('customer_feedback');

    // Fetch the feedback for the given formId
    const form = await feedbackCollection.findOne({ _id: objectId });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Initialize Pinecone and get the index
    const index = await initPinecone();

    // Get the embedding for the question from Gemini
    const questionEmbedding = await getGeminiEmbedding(question);

    // Query Pinecone for similar feedback based on the question embedding
    const pineconeQuery = await index.query({
      vector: questionEmbedding,
      topK: 3, // Get the top 3 similar feedbacks
      includeMetadata: true,
    });

    const similarFeedbacks = pineconeQuery.matches.map((match: any) => match.metadata);

    // Generate an enhanced response using the feedback and similar feedbacks
    const aiResponse = await generateEnhancedResponse(form.feedback, similarFeedbacks);

    // Return the AI-generated response
    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error) {
    console.error('Error processing the question:', error);
    return NextResponse.json({ error: 'Failed to process the question' }, { status: 500 });
  }
}
