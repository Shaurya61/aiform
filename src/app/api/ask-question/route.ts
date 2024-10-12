import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getGeminiEmbedding, generateEnhancedResponse } from '@/lib/geminiClient';
import { initPinecone } from '@/lib/pineconeClient';

export async function POST(req: NextRequest) {
  try {
    const { formId, question } = await req.json();
    console.log('Received question:', question);
    console.log('Form ID:', formId);

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('video_player');
    const feedbackCollection = db.collection('customer_feedback');

    let feedbacks;

    if (formId) {
      const objectId = new ObjectId(formId);
      const form = await feedbackCollection.findOne({ _id: objectId });
      if (!form) {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      }
      feedbacks = [form];
    } else {
      feedbacks = await feedbackCollection.find({}).toArray();
    }

    // Preprocess feedbacks to remove duplicates and standardize format
    const processedFeedbacks = processFeedbacks(feedbacks);

    // Get semantic search results
    const index = await initPinecone();
    const questionEmbedding = await getGeminiEmbedding(question);
    const pineconeQuery = await index.query({
      vector: questionEmbedding,
      topK: 5, // Increased for better context
      includeMetadata: true,
    });

    const similarFeedbacks = pineconeQuery.matches.map((match: any) => match.metadata);

    // Generate enhanced response with processed feedback
    const aiResponse = await generateEnhancedResponse(question, processedFeedbacks);

    return NextResponse.json({ 
      response: aiResponse,
      feedbackStats: getFeedbackStats(processedFeedbacks)
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing the question:', error);
    return NextResponse.json({ error: 'Failed to process the question' }, { status: 500 });
  }
}

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
        createdAt: feedback.createdAt
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
    uniqueCustomers: new Set(feedbacks.map(f => f.customerName.toLowerCase())).size
  };
}