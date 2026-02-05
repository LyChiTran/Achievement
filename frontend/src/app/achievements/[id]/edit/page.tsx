"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Achievement } from "@/types";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";

export default function EditAchievementPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        achieved_date: "",
        importance_level: 3,
        is_public: true,
    });

    useEffect(() => {
        if (id) {
            loadAchievement();
        }
    }, [id]);

    const loadAchievement = async () => {
        try {
            const response = await api.get<Achievement>(`/api/achievements/${id}`);
            const achievement = response.data;
            setFormData({
                title: achievement.title,
                description: achievement.description || "",
                achieved_date: achievement.achieved_date || "",
                importance_level: achievement.importance_level,
                is_public: achievement.is_public,
            });
        } catch (error) {
            console.error("Failed to load achievement", error);
            router.push("/achievements");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put(`/api/achievements/${id}`, formData);
            alert("Achievement updated successfully! ✨");
            router.push(`/achievements/${id}`);
        } catch (error: any) {
            console.error("Failed to update achievement:", error);
            alert(error.response?.data?.detail || "Failed to update achievement");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b glass sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href={`/achievements/${id}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Achievement
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="glass rounded-2xl p-8">
                    {/* Title */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Edit Achievement
                            </h1>
                            <p className="text-gray-600 mt-1">Update your achievement details</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
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
                                    Others will be able to view this achievement
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <Link
                                href={`/achievements/${id}`}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
