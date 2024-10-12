"use client"
import { useState } from 'react';
import FormSelection from '@/components/FormSelection';
import { useRouter } from 'next/navigation';
import QuestionAsking from '@/components/QuestionAsking'; // Import the QuestionAsking component

const FormAnalysisPage = () => {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const router = useRouter();

  const handleFormSelect = (formId: string) => {
    setSelectedFormId(formId);
    // Redirect to the detail page
    router.push(`/form-detail/${formId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Analysis</h1>
      {/* Global question context: Ask about all forms */}
      <QuestionAsking />
      <FormSelection onSelect={handleFormSelect} />
      
    </div>
  );
};

export default FormAnalysisPage;
