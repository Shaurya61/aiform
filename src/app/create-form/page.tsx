"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";

// Snackbar component for notifications
const Snackbar = ({ message, type }: { message: string; type: "success" | "error" }) => {
  return (
    <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-lg text-white ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {message}
    </div>
  );
};

const CreateForm = () => {
  const [formData, setFormData] = useState({
    formName: "",
    formDescription: "",
  });
  const [formLink, setFormLink] = useState<string | null>(null);
  const [forms, setForms] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Snackbar auto-hide after 3 seconds
  useEffect(() => {
    if (snackbar) {
      const timer = setTimeout(() => setSnackbar(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("/api/forms/getUserForms", {
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to fetch forms");
        const data = await res.json();
        setForms(data.forms);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchForms();
  }, []);

  const handleCreateForm = async () => {
    if (!formData.formName || !formData.formDescription) {
      setSnackbar({ message: "Please fill in all fields", type: "error" });
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const formUrlId = crypto.randomUUID();

      const res = await fetch("/api/forms/createNewForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, formUrlId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create form");
      }

      const data = await res.json();
      setFormLink(data.formLink);
      setForms([...forms, data.form]);
      setIsModalOpen(false);
      setFormData({ formName: "", formDescription: "" });
      setSnackbar({ message: "Form created successfully!", type: "success" });
    } catch (error: any) {
      setError(error.message);
      setSnackbar({ message: "Failed to create form", type: "error" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setSnackbar({ message: "Link copied to clipboard", type: "success" });
  };

  return (
    <>
    <div className={`${darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-blue-100 to-indigo-100 text-gray-800"} p-8 h-screen`}>
      {/* Dark mode toggle */}
      {/* <div className="flex justify-end mb-4">
        <motion.button
          className={`px-4 py-2 rounded-full shadow-lg ${darkMode ? "bg-gray-700" : "bg-gray-200"} hover:bg-indigo-600 text-sm`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </motion.button>
      </div> */}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold">Create New Form</h1>
        <motion.button
          className="bg-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-600 transition-all"
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.1 }}
        >
          Create Form
        </motion.button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-60"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <motion.div
            className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-white"} p-8 rounded-lg shadow-lg z-10 w-[400px]`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h2 className="text-2xl font-bold mb-4">Create a New Form</h2>
            <input
              type="text"
              placeholder="Form Name"
              value={formData.formName}
              onChange={(e) =>
                setFormData({ ...formData, formName: e.target.value })
              }
              className="border border-gray-400 p-2 w-full rounded-md mb-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition"
              required
            />
            <textarea
              placeholder="Form Description"
              value={formData.formDescription}
              onChange={(e) =>
                setFormData({ ...formData, formDescription: e.target.value })
              }
              className="border border-gray-400 p-2 w-full rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition"
              required
            />
            <div className="flex justify-end mt-4 space-x-2">
              <motion.button
                className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-all"
                onClick={() => setIsModalOpen(false)}
                whileHover={{ scale: 1.05 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className={`bg-indigo-500 text-white px-4 py-2 rounded-full ${isCreating ? "opacity-50" : "hover:bg-indigo-600"} transition-all`}
                onClick={handleCreateForm}
                disabled={isCreating}
                whileHover={{ scale: isCreating ? 1 : 1.05 }}
              >
                {isCreating ? "Creating..." : "Create"}
              </motion.button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </motion.div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl mb-4 font-semibold">Your Created Forms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.length === 0 ? (
            <div className="text-gray-500 col-span-full text-center">
              No forms created yet. Start by creating a new form!
            </div>
          ) : (
            forms.map((form) => (
              <motion.div
                key={form.formUrlId}
                className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-white"} p-6 rounded-lg shadow-md transition-transform transform hover:scale-105`}
              >
                <h3 className="font-bold text-xl mb-2 text-indigo-500">
                  {form.formName}
                </h3>
                <p className="text-gray-700">{form.formDescription}</p>
                <div className="mt-4">
                  <motion.button
                    className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all"
                    onClick={() => handleCopyLink(form.formLink)}
                    whileHover={{ scale: 1.1 }}
                  >
                    Copy Link
                  </motion.button>
                  <Link href={`/form-analysis/${form.formUrlId}`} passHref>
                    <motion.button
                      className="bg-indigo-200 text-gray-800 px-4 py-2 rounded-full ml-2 hover:bg-indigo-300 transition-all"
                      whileHover={{ scale: 1.1 }}
                    >
                      View Responses
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Snackbar for notifications */}
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} />}
    </div>
    </>
  );
};

export default CreateForm;
