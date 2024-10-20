"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import QuestionAsking from '@/components/QuestionAsking';
import Layout from '@/components/Layout';
import Header from '@/components/Header';

const FormAnalysisPage = () => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'feedback'>('form'); // state for active tab
  const { formUrlId } = useParams();

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const res = await fetch(`/api/forms/${formUrlId}`);
        if (!res.ok) throw new Error('Failed to fetch form responses');
        const data = await res.json();
        setFormData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFormDetails();
  }, [formUrlId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-gray-800"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-red-600"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="h-screen w-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen mx-auto"
        >
          <div className="flex flex-col gap-6">
            <motion.div
              className="bg-white shadow-2xl rounded-2xl p-8 w-full"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Clean Tab Navigation */}
              <div className="flex justify-center mb-6">
                <TabButton
                  label="Form"
                  isActive={activeTab === 'form'}
                  onClick={() => setActiveTab('form')}
                />
                <TabButton
                  label="Feedback"
                  isActive={activeTab === 'feedback'}
                  onClick={() => setActiveTab('feedback')}
                />
              </div>

              {/* Tab Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {activeTab === 'form' ? (
                  <FormView formData={formData} formUrlId={Array.isArray(formUrlId) ? formUrlId[0] : formUrlId} />
                ) : (
                  <FeedbackView feedback={formData.feedback} />
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => {
  return (
    <button
      className={`px-6 py-2 mx-1 rounded-full font-semibold text-lg transition-colors duration-300
        ${isActive ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const FormView = ({ formData, formUrlId }: { formData: any; formUrlId: string }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        {formData.formName}
      </h1>
      <p className="text-lg text-gray-600 text-center mb-6">
        {formData.formDescription}
      </p>
      <QuestionAsking formUrlId={Array.isArray(formUrlId) ? formUrlId[0] : formUrlId} />
    </div>
  );
};

const FeedbackView = ({ feedback }: { feedback: any[] }) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr">
      {feedback.map((feedbackItem: any, index: number) => (
        <FeedbackCard key={index} feedback={feedbackItem} index={index} />
      ))}
    </div>
  );
};

const FeedbackCard = ({ feedback, index }: { feedback: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Header Section */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {feedback.customerName.toUpperCase().charAt(0)}
          </div>
          <div className="ml-3 flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {feedback.customerName}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Feedback Content */}
        <div className="flex-grow mb-4">
          <p className="text-gray-600">
            {feedback.feedback}
          </p>
        </div>

        {/* Footer Section - Rating */}
        <div className="flex items-center mt-auto">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({feedback.rating}/5)
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FormAnalysisPage;
