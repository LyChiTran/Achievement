"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Achievement } from "@/types";
import { ArrowLeft, Edit, Trash2, Calendar, Star, Eye, Lock, Share2 } from "lucide-react";
import Link from "next/link";

export default function AchievementDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [achievement, setAchievement] = useState<Achievement | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (id) {
            loadAchievement();
        }
    }, [id]);

    const loadAchievement = async () => {
        try {
            const response = await api.get<Achievement>(`/api/achievements/${id}`);
            setAchievement(response.data);
        } catch (error) {
            console.error("Failed to load achievement", error);
            router.push("/achievements");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this achievement? This action cannot be undone.")) {
            return;
        }

        setDeleting(true);
        try {
            await api.delete(`/api/achievements/${id}`);
            alert("Achievement deleted successfully!");
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to delete achievement", error);
            alert("Failed to delete achievement");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading achievement...</p>
                </div>
            </div>
        );
    }

    if (!achievement) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b glass sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/achievements"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Achievements
                        </Link>
                        <div className="flex gap-2">
                            <Link
                                href={`/achievements/${id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Hero Section */}
                <div className="glass rounded-2xl p-8 mb-6">
                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                            {[...Array(achievement.importance_level)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        {achievement.is_public ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                <Eye className="w-4 h-4" />
                                Public
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                <Lock className="w-4 h-4" />
                                Private
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {achievement.title}
                    </h1>

                    {/* Date */}
                    {achievement.achieved_date && (
                        <div className="flex items-center gap-2 text-gray-600 mb-6">
                            <Calendar className="w-5 h-5" />
                            <span>
                                Achieved on {new Date(achievement.achieved_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    {achievement.description && (
                        <div className="prose max-w-none">
                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {achievement.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="glass rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Achievement Details</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Importance Level</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < achievement.importance_level
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-700 font-medium">{achievement.importance_level}/5</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Visibility</p>
                            <p className="text-gray-900 font-medium">
                                {achievement.is_public ? "Public (visible to everyone)" : "Private (only you can see this)"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Created</p>
                            <p className="text-gray-900 font-medium">
                                {new Date(achievement.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                            <p className="text-gray-900 font-medium">
                                {new Date(achievement.updated_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                {achievement.is_public && (
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Share This Achievement</h2>
                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                <Share2 className="w-4 h-4" />
                                Share on Twitter
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">
                                <Share2 className="w-4 h-4" />
                                Share on LinkedIn
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
