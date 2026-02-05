"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Trophy, Eye, User, Search, Filter, SortAsc, Lock, Globe } from "lucide-react";
import toast from "react-hot-toast";

interface Achievement {
    id: number;
    title: string;
    description: string;
    user_id: number;
    user_email: string | null;
    is_public: boolean;
    created_at: string;
    importance_level: number;
}

export default function ContentPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');
    const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'importance'>('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await api.get('/api/admin/achievements');
            setAchievements(response.data);
        } catch (error) {
            console.error("Failed to fetch achievements:", error);
            toast.error("Failed to load achievements");
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort logic
    const filteredAchievements = achievements
        .filter(achievement => {
            const matchesSearch =
                achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                achievement.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter =
                filterVisibility === 'all' ||
                (filterVisibility === 'public' && achievement.is_public) ||
                (filterVisibility === 'private' && !achievement.is_public);

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === 'latest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortBy === 'oldest') {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else {
                return b.importance_level - a.importance_level;
            }
        });

    // Pagination
    const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAchievements = filteredAchievements.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Moderation</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {achievements.length} total achievements, showing {filteredAchievements.length}
                </p>
            </div>

            {/* Filters & Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title or description..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    {/* Visibility Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Filter className="inline w-4 h-4 mr-2" />
                            Visibility
                        </label>
                        <select
                            value={filterVisibility}
                            onChange={(e) => {
                                setFilterVisibility(e.target.value as any);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="all">All</option>
                            <option value="public">Public Only</option>
                            <option value="private">Private Only</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <SortAsc className="inline w-4 h-4 mr-2" />
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="latest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="importance">Importance Level</option>
                        </select>
                    </div>

                    {/* Items per page */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Items per Page
                        </label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                        </select>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t dark:border-gray-700">
                    <QuickStat
                        label="Total"
                        value={achievements.length}
                        icon={Trophy}
                        color="purple"
                    />
                    <QuickStat
                        label="Public"
                        value={achievements.filter(a => a.is_public).length}
                        icon={Globe}
                        color="green"
                    />
                    <QuickStat
                        label="Private"
                        value={achievements.filter(a => !a.is_public).length}
                        icon={Lock}
                        color="gray"
                    />
                </div>
            </div>

            {/* Achievements Grid */}
            {paginatedAchievements.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {searchQuery ? "No results found" : "No achievements found"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedAchievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-6 h-6 text-yellow-500" />
                                        <div className="flex gap-1">
                                            {[...Array(achievement.importance_level || 0)].map((_, i) => (
                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                            ))}
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${achievement.is_public
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {achievement.is_public ? (
                                            <>
                                                <Eye className="w-3 h-3" />
                                                Public
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-3 h-3" />
                                                Private
                                            </>
                                        )}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                    {achievement.title}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                    {achievement.description || 'No description'}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
                                    <div className="flex items-center gap-2 truncate">
                                        <User className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">
                                            {achievement.user_email || `User #${achievement.user_id}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-400 mt-2">
                                    {new Date(achievement.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                                            ? 'bg-purple-600 text-white'
                                            : 'border hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function QuickStat({ label, value, icon: Icon, color }: {
    label: string;
    value: number;
    icon: any;
    color: 'purple' | 'green' | 'gray';
}) {
    const colors: Record<'purple' | 'green' | 'gray', string> = {
        purple: 'text-purple-600',
        green: 'text-green-600',
        gray: 'text-gray-600'
    };

    return (
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${colors[color]}`} />
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
}
