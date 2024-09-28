import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getGeminiEmbedding = async (text: string) => {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  console.log(result.embedding.values); // Log the embedding vector
  return result.embedding.values; // Returns the embedding vector
};

export const generateEnhancedResponse = async (feedback: string, similarFeedbacks: any[]) => {
  // Construct a prompt incorporating only the selected feedbacks as context
  const context = similarFeedbacks
    .map((f) => `Name: ${f.name}\nFeedback: ${f.feedback}\nRating: ${f.rating}`)
    .join("\n\n");

  // Use a supported model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
You are an AI assistant designed to provide precise answers based on user feedback and related context.

**User Feedback:** "${feedback}"

**Related Feedback:**  
${context}

**Task:**
1. Directly answer the user's questions using the related feedback.
2. If asked about ratings, names, or specific feedback, provide those details from the context.
3. For unrelated questions, offer a general response and suggest further actions if needed.

Focus on relevance and clarity in your answers.
`;

  const result = await model.generateContent(prompt);
  return result.response.text(); // Return the generated response
};
