// src/components/Form.tsx
import { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    feedback: '',
    rating: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send data to API
    await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
      <input
        type="text"
        placeholder="Your Name"
        value={formData.customerName}
        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        className="border p-2 rounded mb-4 w-full text-black"
        required
      />
      <textarea
        placeholder="Your Feedback"
        value={formData.feedback}
        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
        className="border p-2 rounded mb-4 w-full text-black"
        required
      />
      <label className="block mb-2">
        Rating:
        <select
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
          className="border p-2 rounded mb-4 w-full text-black"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="bg-blue-500 p-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default Form;
