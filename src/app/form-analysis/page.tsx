// pages/form-analysis.tsx
"use client"
import { useState } from 'react';
import FormSelection from '@/components/FormSelection';
import QuestionAsking from '@/components/QuestionAsking';

const FormAnalysisPage = () => {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Analysis</h1>
      <FormSelection onSelect={setSelectedFormId} />
      {selectedFormId && <QuestionAsking formId={selectedFormId} />}
    </div>
  );
};

export default FormAnalysisPage;
