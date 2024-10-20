// app/form-detail/[formId].tsx
"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import QuestionAsking from '@/components/QuestionAsking';

const FormDetailPage = () => {
  const router = useRouter();
  const { formUrlId, responseId } = useParams();

  const formUrlIdString = Array.isArray(formUrlId) ? formUrlId[0] : formUrlId;
  const responseIdString = Array.isArray(responseId) ? responseId[0] : responseId;

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormDetails = async () => {
      if (!formUrlId) return;
        const res = await fetch(`/api/forms/${formUrlIdString}/${responseIdString}`);
      try {
        const res = await fetch(`/api/forms/${formUrlId}/${responseId}`);
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
  }, [responseId, formUrlId]);

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
      <QuestionAsking formUrlId={formUrlIdString} />
    </div>
  );
};

export default FormDetailPage;
