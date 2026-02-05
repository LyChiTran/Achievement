"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";
import { Achievement } from "@/types";
import { Trophy, Plus, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, fetchUser } = useAuthStore();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            router.push("/login");
        }
    }, [isAuthenticated, loading, router]);

    useEffect(() => {
        const loadAchievements = async () => {
            try {
                const response = await api.get<Achievement[]>("/api/achievements");
                setAchievements(response.data);
            } catch (error) {
                console.error("Failed to load achievements", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            loadAchievements();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl" suppressHydrationWarning>Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
            {/* Header */}
            <header className="border-b glass">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-8 h-8 text-purple-600" />
                        <h1 className="text-2xl font-bold" suppressHydrationWarning>Achievement Web</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600" suppressHydrationWarning>Welcome, {user?.full_name || user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" />
                            <span suppressHydrationWarning>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Navigation Pills */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <Link href="/dashboard" className="px-4 py-2 bg-purple-600 text-white rounded-lg whitespace-nowrap">
                        <span suppressHydrationWarning>Dashboard</span>
                    </Link>
                    <Link href="/achievements" className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg whitespace-nowrap">
                        <span suppressHydrationWarning>Achievements</span>
                    </Link>
                    <Link href="/categories" className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg whitespace-nowrap">
                        <span suppressHydrationWarning>Categories</span>
                    </Link>
                    <Link href="/skills" className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg whitespace-nowrap">
                        <span suppressHydrationWarning>Skills</span>
                    </Link>
                    <Link href="/goals" className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg whitespace-nowrap">
                        <span suppressHydrationWarning>Goals</span>
                    </Link>
                    <Link href="/timeline" className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg whitespace-nowrap">
                        <span suppressHydrationWarning>Timeline</span>
                    </Link>
                    <Link href="/profile" className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg whitespace-nowrap">
                        <span suppressHydrationWarning>Profile</span>
                    </Link>
                    {user?.is_superuser && (
                        <Link href="/admin" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg whitespace-nowrap font-semibold">
                            <span suppressHydrationWarning>👑 Admin</span>
                        </Link>
                    )}
                </div>
                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-purple-600">{achievements.length}</div>
                        <div className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>Total Achievements</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-blue-600">
                            {achievements.filter(a => a.is_public).length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>Public</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-green-600">
                            {achievements.filter(a => !a.is_public).length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>Private</div>
                    </div>
                    <div className="glass rounded-xl p-6">
                        <div className="text-3xl font-bold text-orange-600" suppressHydrationWarning>
                            {typeof window !== 'undefined' ? new Date().getFullYear() : '2026'}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>Current Year</div>
                    </div>
                </div>

                {/* Achievements List */}
                <div className="glass rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold" suppressHydrationWarning>My Achievements</h2>
                        <Link
                            href="/achievements/new"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span suppressHydrationWarning>Add Achievement</span>
                        </Link>
                    </div>

                    {achievements.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-xl" suppressHydrationWarning>No achievements yet</p>
                            <p className="mt-2" suppressHydrationWarning>Start by adding your first achievement!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="p-4 border rounded-lg hover:shadow-lg transition cursor-pointer"
                                >
                                    <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                        <span suppressHydrationWarning>{achievement.description || "No description"}</span>
                                    </p>
                                    <div className="mt-4 flex justify-between items-center text-xs">
                                        <span className="text-purple-600">
                                            <span suppressHydrationWarning>Level {achievement.importance_level}</span>
                                        </span>
                                        <span className={achievement.is_public ? "text-green-600" : "text-gray-500"}>
                                            <span suppressHydrationWarning>{achievement.is_public ? "Public" : "Private"}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
