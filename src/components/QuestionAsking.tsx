import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIResponseFormatter from './AiResponseFormatter';

const QuestionAsking = ({ formUrlId }: { formUrlId: string }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/ask-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formUrlId, question }),
      });
      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error asking question:', error);
      setResponse('An error occurred while processing your question.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Ask AI about this form
      </h2>

      <div className="space-y-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="E.g., Summarize the responses for this form"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 pr-24 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white"
          />
          <motion.button
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            className={`absolute right-2 px-4 py-1.5 rounded-md font-medium transition-all duration-200 ${loading || !question.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              }`}
            whileHover={!loading && question.trim() ? { scale: 1.02 } : {}}
            whileTap={!loading && question.trim() ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>...</span>
              </span>
            ) : (
              'Ask AI'
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-inner"
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                  AI
                </div>
                <h3 className="font-semibold text-gray-700">Response</h3>
              </div>

              <div className="prose prose-blue max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-2">
                <AIResponseFormatter response={response ?? ''} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionAsking;