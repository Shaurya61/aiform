// pages/form-detail/[formId].tsx
"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import QuestionAsking from '@/components/QuestionAsking';

const FormDetailPage = () => {
  const router = useRouter();
  const { formId } = useParams() as { formId: string }; // Type the query correctly

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormDetails = async () => {
      if (!formId) return;

      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch form details');
        }
        const data = await res.json();
        setFormData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormDetails();
  }, [formId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Details</h1>
      <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Name: {formData.customerName}</h2>
        <p>Feedback: {formData.feedback}</p>
        <p>Rating: {formData.rating} / 5</p>
        <p>Date Submitted: {new Date(formData.createdAt).toLocaleString()}</p>
      </div>
      
      {/* Form-specific question asking */}
      <QuestionAsking formId={formId} />
    </div>
  );
};

export default FormDetailPage;
