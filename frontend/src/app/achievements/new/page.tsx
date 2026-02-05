"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewAchievementPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        achieved_date: new Date().toISOString().split('T')[0],
        importance_level: 3,
        is_public: true,
        category_id: null as number | null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/api/achievements/", formData);

            // Show success notification
            alert("Achievement created successfully! 🎉");

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Failed to create achievement:", error);
            alert(error.response?.data?.detail || "Failed to create achievement");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b glass sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="glass rounded-2xl p-8">
                    {/* Title */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Add New Achievement
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Record your accomplishment and celebrate your success!
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Achievement Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Completed Full Stack Web Development Course"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description || ""}
                                onChange={handleChange}
                                placeholder="Describe your achievement, what you learned, and why it matters..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                            />
                        </div>

                        {/* Date & Importance */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Achieved Date */}
                            <div>
                                <label htmlFor="achieved_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date Achieved
                                </label>
                                <input
                                    type="date"
                                    id="achieved_date"
                                    name="achieved_date"
                                    value={formData.achieved_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Importance Level */}
                            <div>
                                <label htmlFor="importance_level" className="block text-sm font-medium text-gray-700 mb-2">
                                    Importance Level: {formData.importance_level}
                                </label>
                                <input
                                    type="range"
                                    id="importance_level"
                                    name="importance_level"
                                    min="1"
                                    max="5"
                                    value={formData.importance_level}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Low</span>
                                    <span>Medium</span>
                                    <span>High</span>
                                </div>
                            </div>
                        </div>

                        {/* Public Toggle */}
                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="is_public"
                                name="is_public"
                                checked={formData.is_public}
                                onChange={handleChange}
                                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="is_public" className="flex-1 cursor-pointer">
                                <div className="font-medium text-gray-900">Make this achievement public</div>
                                <div className="text-sm text-gray-600">
                                    Others will be able to view this achievement on your public profile
                                </div>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Achievement
                                    </>
                                )}
                            </button>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Tips */}
                <div className="mt-6 p-6 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for a great achievement</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                        <li>• Be specific about what you accomplished</li>
                        <li>• Include measurable results when possible</li>
                        <li>• Describe the impact or what you learned</li>
                        <li>• Add photos or certificates (coming soon!)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
