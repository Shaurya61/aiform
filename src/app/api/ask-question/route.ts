import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getGeminiEmbedding, generateEnhancedResponse } from '@/lib/geminiClient';
import { initPinecone } from '@/lib/pineconeClient';

export async function POST(req: NextRequest) {
  try {
    const { formUrlId, question } = await req.json();
    console.log('Received question:', question);
    console.log('Form URL ID:', formUrlId);

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Establish database connection
    const client = await clientPromise;
    const db = client.db('video_player');

    // Find the form by its formUrlId
    const form = await db.collection('forms').findOne({ formUrlId });
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const formId = form._id;

    // Fetch feedback from customer_feedback collection using formId
    const feedbackCollection = db.collection('customer_feedback');
    const feedbacks = await feedbackCollection.find({ formId: new ObjectId(formId) }).toArray();

    if (feedbacks.length === 0) {
      return NextResponse.json({ error: 'No feedback found for this form' }, { status: 404 });
    }

    // Preprocess feedbacks to remove duplicates and standardize format
    const processedFeedbacks = processFeedbacks(feedbacks);

    // Get semantic search results using Pinecone
    const index = await initPinecone();
    const questionEmbedding = await getGeminiEmbedding(question);
    const pineconeQuery = await index.query({
      vector: questionEmbedding,
      topK: 5, // Number of similar feedbacks to retrieve
      includeMetadata: true,
    });

    const similarFeedbacks = pineconeQuery.matches.map((match: any) => match.metadata);

    // Generate enhanced response with processed feedback
    const aiResponse = await generateEnhancedResponse(question, processedFeedbacks);

    // Return the AI-generated response and feedback stats
    return NextResponse.json({
      response: aiResponse,
      feedbackStats: getFeedbackStats(processedFeedbacks),
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error processing the question:', error);
    return NextResponse.json({ error: 'Failed to process the question' }, { status: 500 });
  }
}

// Helper functions

interface ProcessedFeedback {
  customerName: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}

function processFeedbacks(feedbacks: any[]): ProcessedFeedback[] {
  // Remove duplicate feedback entries (same content from same customer)
  const uniqueFeedbacks = new Map();
  
  feedbacks.forEach(feedback => {
    const key = `${feedback.customerName.toLowerCase()}-${feedback.feedback.toLowerCase()}`;
    if (!uniqueFeedbacks.has(key)) {
      uniqueFeedbacks.set(key, {
        customerName: feedback.customerName,
        feedback: feedback.feedback,
        rating: feedback.rating,
        createdAt: feedback.createdAt,
      });
    }
  });

  return Array.from(uniqueFeedbacks.values());
}

function getFeedbackStats(feedbacks: ProcessedFeedback[]) {
  const totalFeedbacks = feedbacks.length;
  const averageRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalFeedbacks;
  
  return {
    totalFeedbacks,
    averageRating: averageRating.toFixed(1),
    uniqueCustomers: new Set(feedbacks.map(f => f.customerName.toLowerCase())).size,
  };
}
