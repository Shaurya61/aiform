import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FormSelection = ({ onSelect }: { onSelect: (formId: string) => void }) => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch('/api/forms', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await res.json();
        setForms(data.forms);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchForms();
  }, []);

  if (error) {
    return <div className=" p-4 bg-white shadow-md rounded text-black">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-lg text-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Customer Feedback</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {forms.map((form: any) => (
          <div
            key={form._id}
            className="p-6 bg-white border border-gray-300 rounded-lg shadow hover:shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            {/* Name Section */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{form.customerName}</h3>

            {/* Feedback Section */}
            <p className="text-sm text-gray-600 mb-2 line-clamp-3 overflow-hidden text-ellipsis">
              {form.feedback}
            </p>

            {/* Rating and Date Section */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-xl">★</span>
                <p className="text-sm font-medium text-gray-600">
                  Rating: <span className="text-gray-800 font-semibold">{form.rating}</span> / 5
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(form.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Button */}
            <button
              className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              onClick={() => router.push(`/form-detail/${form._id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormSelection;
