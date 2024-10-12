import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getGeminiEmbedding = async (text: string) => {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
};

export const generateEnhancedResponse = async (question: string, feedbacks: any[]) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set");
  }

  try {
    // Format feedback with clear structure and metadata
    const formattedFeedback = feedbacks
      .map((f, index) => `[Feedback ${index + 1}]
Customer: ${f.customerName}
Rating: ${f.rating}/5
Date: ${f.createdAt.toISOString().split('T')[0]}
Content: ${f.feedback}
---`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Task: Analyze customer feedback to answer a specific question about the company.

Question: "${question}"

Context: You are analyzing ${feedbacks.length} unique customer feedback entries collected over time.

Available Customer Feedback:
${formattedFeedback}

Response Guidelines:
1. Analyze ONLY the actual feedback content - do not make assumptions
2. If the question asks about a specific person or topic, only consider feedback that explicitly mentions it
3. Consider the dates of feedback for relevance
4. Note if there are duplicate customers or similar feedback patterns
5. Highlight trends in ratings when relevant
6. If there isn't enough relevant feedback to answer the question confidently, clearly state this

Format your response as follows:
ANALYSIS: [Provide a clear, factual answer based solely on the feedback data]
EVIDENCE: [List specific quotes or data points that support your analysis]
DATA COVERAGE: [Explain how many feedback entries were relevant to this specific question]
CONFIDENCE: [High/Medium/Low - based on quantity and quality of relevant feedback]
LIMITATIONS: [Note any important limitations in the available feedback for answering this question]

Keep your response objective and based strictly on the provided feedback data.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error("Failed to generate response");
  }
};