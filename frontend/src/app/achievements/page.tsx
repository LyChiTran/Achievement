"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Achievement } from "@/types";
import { Trophy, Filter, Search, Grid3x3, List, Calendar, Star, Eye, Lock } from "lucide-react";
import Link from "next/link";

export default function AchievementsPage() {
    const router = useRouter();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPublic, setFilterPublic] = useState<'all' | 'public' | 'private'>('all');

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {
        try {
            const response = await api.get<Achievement[]>("/api/achievements/");
            setAchievements(response.data);
        } catch (error) {
            console.error("Failed to load achievements", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAchievements = achievements.filter(achievement => {
        const matchesSearch = achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            achievement.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterPublic === 'all' ||
            (filterPublic === 'public' && achievement.is_public) ||
            (filterPublic === 'private' && !achievement.is_public);
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600" suppressHydrationWarning>Loading achievements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b glass sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold" suppressHydrationWarning>All Achievements</h1>
                        </div>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                        >
                            <span suppressHydrationWarning>Back to Dashboard</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Filters & Search */}
                <div className="glass rounded-xl p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search achievements..." suppressHydrationWarning
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterPublic('all')}
                                className={`flex-1 px-4 py-2 rounded-lg transition ${filterPublic === 'all'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span suppressHydrationWarning>All</span>
                            </button>
                            <button
                                onClick={() => setFilterPublic('public')}
                                className={`flex-1 px-4 py-2 rounded-lg transition ${filterPublic === 'public'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Eye className="w-4 h-4 inline mr-1" />
                                <span suppressHydrationWarning>Public</span>
                            </button>
                            <button
                                onClick={() => setFilterPublic('private')}
                                className={`flex-1 px-4 py-2 rounded-lg transition ${filterPublic === 'private'
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Lock className="w-4 h-4 inline mr-1" />
                                <span suppressHydrationWarning>Private</span>
                            </button>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600" suppressHydrationWarning>
                            Found {filteredAchievements.length} achievement{filteredAchievements.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
                                    }`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Achievements Grid/List */}
                {filteredAchievements.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2" suppressHydrationWarning>No achievements found</h3>
                        <p className="text-gray-500 mb-6" suppressHydrationWarning>
                            {searchQuery ? "Try a different search term" : "Start adding your achievements!"}
                        </p>
                        <Link
                            href="/achievements/new"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                        >
                            <span suppressHydrationWarning>Add Your First Achievement</span>
                        </Link>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }>
                        {filteredAchievements.map((achievement) => (
                            <Link
                                key={achievement.id}
                                href={`/achievements/${achievement.id}`}
                                className={`glass rounded-xl p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer ${viewMode === 'list' ? 'flex items-center gap-6' : ''
                                    }`}
                            >
                                {viewMode === 'grid' && (
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            {[...Array(achievement.importance_level)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        {achievement.is_public ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                <span suppressHydrationWarning>Public</span>
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                <span suppressHydrationWarning>Private</span>
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{achievement.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        <span suppressHydrationWarning>{achievement.description || "No description provided"}</span>
                                    </p>
                                    {achievement.achieved_date && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(achievement.achieved_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                {viewMode === 'list' && (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            {[...Array(achievement.importance_level)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        {achievement.is_public ? (
                                            <Eye className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Lock className="w-5 h-5 text-gray-600" />
                                        )}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
