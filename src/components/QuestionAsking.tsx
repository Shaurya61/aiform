import { useState } from 'react';

const QuestionAsking = ({ formId }: { formId: string }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    setLoading(true);
    const res = await fetch(`/api/ask-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formId, question }),
    });
    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
  };

  // Function to style the AI response
  const renderFormattedResponse = (response: string) => {
    const boldPattern = /\*\*(.*?)\*\*/g; // Matches text surrounded by **
    const formattedText = response.split(boldPattern).map((part, index) => {
      if (index % 2 === 1) {
        // Every second match is bold
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });

    return formattedText;
  };

  return (
    <div className="p-4 bg-white shadow-md rounded mt-4 text-black">
      <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
      <input
        type="text"
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />
      <button
        onClick={handleAskQuestion}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? 'Asking...' : 'Ask'}
      </button>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <strong className="block mb-2">AI Response:</strong>
          <div className="whitespace-pre-line">{renderFormattedResponse(response)}</div>
        </div>
      )}
    </div>
  );
};

export default QuestionAsking;
