
'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTitle,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ClipboardCopy,
    PlusCircle,
    ListChecks,
    FilePlus,
    FileEdit,
    Search,
    ArrowUpDown,
    CheckCircle,
    XCircle,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip"

interface Form {
    formName: string;
    formDescription: string;
    formUrlId: string;
    formLink: string;
    createdAt: string; // Add createdAt for sorting
}

// Animation variants
const formCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    hover: { scale: 1.03, boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } }, // Adjusted boxShadow
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const CreateForm = () => {
    const [formData, setFormData] = useState({
        formName: "",
        formDescription: "",
    });
    const [forms, setForms] = useState<Form[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [router] = useState(useRouter());
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<'name' | 'date'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);

    // Fetch user forms
    useEffect(() => {
        const fetchForms = async () => {
            try {
                const res = await fetch("/api/forms/getUserForms", { method: "GET" });
                if (!res.ok) {
                    throw new Error("Failed to fetch forms");
                }
                const data = await res.json();
                // Add createdAt if it doesn't exist
                const updatedForms = data.forms.map((form: Form) => ({
                    ...form,
                    createdAt: form.createdAt || new Date().toISOString(), // Fallback to current time
                }));
                setForms(updatedForms);
            } catch (error: any) {
                toast.error(error.message, {
                    icon: <XCircle className="h-5 w-5" />
                });
            }
        };
        fetchForms();
    }, []);

    const handleCreateForm = async () => {
        if (!formData.formName || !formData.formDescription) {
            toast.error("Please fill in all fields", {
                icon: <XCircle className="h-5 w-5" />
            });
            return;
        }
        setIsCreating(true);

        try {
            const formUrlId = crypto.randomUUID();
            const formLink = `/f/${formUrlId}`;
            const createdAt = new Date().toISOString();
            const res = await fetch("/api/forms/createNewForm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, formUrlId, formLink, createdAt }),
            });

            if (!res.ok) {
                throw new Error("Failed to create form");
            }

            const data = await res.json();
            setForms(prevForms => [...prevForms, data.form]);
            setFormData({ formName: "", formDescription: "" });
            toast.success("Form created successfully!", {
                icon: <CheckCircle className="h-5 w-5" />
            });
        } catch (error: any) {
            toast.error("Failed to create form", {
                icon: <XCircle className="h-5 w-5" />
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!", {
            icon: <ClipboardCopy className="h-5 w-5" />
        });
    };

    const viewResponses = (formUrlId: string) => {
        router.push(`/form-analysis/${formUrlId}`);
    };

    const sortedForms = [...forms].sort((a, b) => {
        if (sortOption === 'name') {
            const nameA = a.formName.toLowerCase();
            const nameB = b.formName.toLowerCase();
            if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
            if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        } else { // sortOption === 'date'
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
    });

    const filteredForms = sortedForms.filter(form =>
        form.formName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.formDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Toaster richColors />
            <div className="max-w-6xl mx-auto space-y-10">
                <header className="text-center space-y-6">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text drop-shadow-md">
                        Form Builder
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Create and manage online forms with ease. Build surveys, gather feedback, and more.
                    </p>
                    <div className="mt-8">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600
                                                transition-all duration-300 px-8 py-3 rounded-full shadow-lg
                                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                                                font-semibold text-lg"
                                >
                                    <PlusCircle className="w-6 h-6 mr-2" />
                                    Create New Form
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl border border-gray-200">
                                <DialogHeader className="py-4 px-6 border-b border-gray-200">
                                    <DialogTitle className="text-xl font-semibold text-gray-900">New Form</DialogTitle>
                                    <DialogDescription className="text-gray-600 text-sm mt-1">
                                        Enter the details for your new form.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-5 px-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="formName" className="text-gray-700 font-medium block text-sm">Form Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="formName"
                                            placeholder="Enter form name"
                                            value={formData.formName}
                                            onChange={(e) => setFormData({ ...formData, formName: e.target.value })}
                                            required
                                            className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400
                                                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30
                                                        rounded-md shadow-sm py-3 px-4 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="formDescription" className="text-gray-700 font-medium block text-sm">Description <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="formDescription"
                                            placeholder="Enter form description"
                                            value={formData.formDescription}
                                            onChange={(e) => setFormData({ ...formData, formDescription: e.target.value })}
                                            required
                                            className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400
                                                        min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30
                                                        rounded-md shadow-sm py-3 px-4 text-sm resize-y"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="justify-end gap-3 py-4 px-6 border-t border-gray-200">
                                    <Button
                                        variant="outline"
                                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200
                                                    px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50
                                                    text-sm"
                                        onClick={() => setFormData({ formName: "", formDescription: "" })}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-indigo-500 text-white hover:bg-indigo-600 transition-colors duration-200
                                                    px-5 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                                                    disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        onClick={handleCreateForm}
                                        disabled={isCreating}
                                    >
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </header>

                <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                            Your Forms
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <Input
                                type="text"
                                placeholder="Search forms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-72 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400
                                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30
                                            rounded-md shadow-sm py-3 px-4 text-sm"
                            />
                            <div className="flex items-center gap-2">
                                <Select onValueChange={(value) => setSortOption(value as 'name' | 'date')} value={sortOption}>
                                    <SelectTrigger className="w-[180px] bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30 rounded-md shadow-sm py-3 px-4 text-sm">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md">
                                        <SelectItem value="name" className="py-2 px-3 text-sm hover:bg-gray-100 rounded-md">Name</SelectItem>
                                        <SelectItem value="date" className="py-2 px-3 text-sm hover:bg-gray-100 rounded-md">Date</SelectItem>
                                    </SelectContent>
                                </Select>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                onClick={toggleSortDirection}
                                                className="bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900
                                                            transition-colors duration-200 rounded-md p-2
                                                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30"
                                            >
                                                <ArrowUpDown className="w-5 h-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white rounded-md shadow-md py-1 px-2 text-xs">
                                            <span>{sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>

                    {filteredForms.length === 0 ? (
                        <div className="text-gray-500 text-center py-16 bg-white/70 backdrop-blur-sm rounded-md border border-dashed border-gray-300">
                            <FilePlus className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                            <p className="text-xl font-medium">No forms found.</p>
                            {searchQuery && <p className="mt-2 text-gray-600 text-sm">Try adjusting your search or create a new form.</p>}
                            {!searchQuery && <p className="mt-2 text-gray-600 text-sm">Create a new form to get started.</p>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredForms.map((form) => (
                                    <motion.div
                                        key={form.formUrlId}
                                        variants={formCardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        exit="exit"
                                        className="bg-white/90 backdrop-blur-sm rounded-md shadow-md border border-gray-200 p-5 space-y-4 transition-all duration-300
                                                    group relative hover:shadow-lg hover:border-indigo-500/30"
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
                                                <FileEdit className="w-5 h-5" />
                                                {form.formName}
                                            </h3>
                                            <p className="text-gray-600 line-clamp-2 mt-1 text-sm">{form.formDescription}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400 transition-colors duration-200
                                                                            flex items-center gap-1 w-full sm:w-auto px-3 py-2 rounded-md
                                                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                                                            font-medium text-xs"
                                                            onClick={() => handleCopyLink(form.formLink)}
                                                        >
                                                            <ClipboardCopy className="w-4 h-4" />
                                                            Copy
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-gray-800 text-white rounded-md shadow-md py-1 px-2 text-xs">
                                                        Copy form link
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200
                                                                            flex items-center gap-1 w-full sm:w-auto px-3 py-2 rounded-md
                                                                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                                                                            font-medium text-xs"
                                                            onClick={() => viewResponses(form.formUrlId)}
                                                        >
                                                            <ListChecks className="w-4 h-4" />
                                                            Responses
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-gray-800 text-white rounded-md shadow-md py-1 px-2 text-xs">
                                                        View form responses
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CreateForm;
