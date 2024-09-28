import { useState, useEffect } from 'react';

const FormSelection = ({ onSelect }: { onSelect: (formId: string) => void }) => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState<string | null>(null);

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
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded text-black">
      <h2 className="text-xl font-bold mb-4">Customer Feedback</h2>
      <ul className="list-disc pl-5">
        {forms.map((form: any) => (
          <li
            key={form._id}
            className="cursor-pointer hover:underline"
            onClick={() => onSelect(form._id)} // Pass selected form ID
          >
            {form.customerName} - {new Date(form.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormSelection;
