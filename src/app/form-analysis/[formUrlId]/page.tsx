'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import QuestionAsking from '@/components/QuestionAsking';
import {
    ArrowLeftIcon,
    FileTextIcon,
    StarIcon,
    ChartBarIcon,
    MessageCircleIcon, // Added for feedback icon
    LayoutDashboardIcon, //Added for overview
    BarChart4Icon, //Added for rating distribution
    MessageSquare, //Added for recent feedback
} from 'lucide-react';
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const FormAnalysisPage = () => {
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'form' | 'feedback'>('form');
    const { formUrlId } = useParams();
    const router = useRouter();

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center"
                >
                    <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-500 mb-6" />
                    <p className="text-lg text-gray-700">Loading form data...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center"
                >
                    <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-6" />
                    <p className="text-lg text-red-700">Error: {error}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-8"
                >
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="bg-white shadow-xl rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <h2 className="text-2xl font-semibold">{formData.formName}</h2>
                        <p className="text-sm opacity-80">{formData.formDescription}</p>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex bg-gray-50 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('form')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-200",
                                activeTab === 'form'
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                        >
                            <FileTextIcon className="h-5 w-5" />
                            Form Details
                        </button>
                        <button
                            onClick={() => setActiveTab('feedback')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-200",
                                activeTab === 'feedback'
                                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                        >
                            <MessageCircleIcon className="h-5 w-5" />
                            Feedback
                        </button>
                    </nav>

                    {/* Content Area */}
                    <div className="p-6">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[calc(100vh - 250px)]" // Increased min-height
                        >
                            {activeTab === 'form' ? (
                                <QuestionAsking formUrlId={Array.isArray(formUrlId) ? formUrlId[0] : formUrlId} />
                            ) : (
                                <FeedbackDashboard feedback={formData.feedback} />
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const FeedbackDashboard = ({ feedback }: { feedback: any[] }) => {
    const totalFeedback = feedback ? feedback.length : 0;
    const averageRating = feedback?.reduce((sum, item) => sum + item.rating, 0) / totalFeedback || 0;
    const ratingCounts = feedback?.reduce((acc, item) => {
        acc[item.rating] = (acc[item.rating] || 0) + 1;
        return acc;
    }, {} as { [key: number]: number });

    const recentFeedback = feedback?.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];

    return (
        <div className="space-y-8">
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex items-center gap-4">
                    <LayoutDashboardIcon className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Feedback</p>
                        <p className="text-2xl font-semibold text-gray-800">{totalFeedback}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex items-center gap-4">
                    <StarIcon className="h-8 w-8 text-yellow-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Average Rating</p>
                        <p className="text-2xl font-semibold text-gray-800">{averageRating.toFixed(1)} / 5</p>
                    </div>
                </div>
                {/* Add more overview stats as needed */}
            </div>

            {/* Rating Distribution */}
            {ratingCounts && Object.keys(ratingCounts).length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart4Icon className="h-6 w-6 text-gray-600" />
                        Rating Distribution
                    </h3>
                    <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-4">
                                <span className="text-gray-600">{rating} <StarIcon className="h-4 w-4 inline-block text-yellow-400" /></span>
                                <div className="bg-gray-200 h-4 rounded-full w-full relative overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-full rounded-full absolute left-0 top-0"
                                        style={{ width: `${(ratingCounts[rating] / totalFeedback) * 100}%` }}
                                    >
                                        {totalFeedback > 0 && (
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-800">
                                                {ratingCounts[rating] || 0}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Feedback */}
            {recentFeedback.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-gray-600"/>
                        Recent Feedback
                    </h3>
                    <div className="space-y-6">
                        {recentFeedback.map((feedbackItem: any) => (
                            <div key={feedbackItem.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-semibold uppercase">
                                        {feedbackItem.customerName.charAt(0)}
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <p className="text-sm font-medium text-gray-700">{feedbackItem.customerName}</p>
                                        <p className="text-xs text-gray-500">{format(new Date(feedbackItem.createdAt), 'PPPppp')}</p>
                                    </div>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon
                                                key={star}
                                                className={cn(
                                                    "h-5 w-5",
                                                    star <= feedbackItem.rating ? 'text-yellow-400' : 'text-gray-300'
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{feedbackItem.feedback}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Feedback Message */}
            {totalFeedback === 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 text-center text-gray-500">
                    <MessageCircleIcon className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">No feedback received yet.</p>
                </div>
            )}
        </div>
    );
};

export default FormAnalysisPage;
