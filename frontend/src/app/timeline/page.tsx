"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Achievement } from "@/types";
import { Clock, Calendar, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";

export default function TimelinePage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {
        try {
            const response = await api.get<Achievement[]>("/api/achievements/");
            // Sort by date descending
            const sorted = response.data.sort((a, b) =>
                new Date(b.achieved_date || b.created_at).getTime() -
                new Date(a.achieved_date || a.created_at).getTime()
            );
            setAchievements(sorted);
        } catch (error) {
            console.error("Failed to load achievements", error);
        } finally {
            setLoading(false);
        }
    };

    const years = Array.from(new Set(
        achievements.map(a => new Date(a.achieved_date || a.created_at).getFullYear())
    )).sort((a, b) => b - a);

    const filteredAchievements = selectedYear === 'all'
        ? achievements
        : achievements.filter(a => new Date(a.achieved_date || a.created_at).getFullYear() === selectedYear);

    const groupedByMonth = filteredAchievements.reduce((acc, achievement) => {
        const date = new Date(achievement.achieved_date || achievement.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(achievement);
        return acc;
    }, {} as Record<string, Achievement[]>);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <header className="border-b glass sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold">Achievement Timeline</h1>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Year Filter */}
                <div className="glass rounded-xl p-4 mb-8">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Filter by year:</span>
                        <button
                            onClick={() => setSelectedYear('all')}
                            className={`px-4 py-2 rounded-lg transition ${selectedYear === 'all'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            All Years
                        </button>
                        {years.map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-4 py-2 rounded-lg transition ${selectedYear === year
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-blue-600 to-purple-600"></div>

                    {Object.entries(groupedByMonth).map(([monthKey, monthAchievements], index) => {
                        const [year, month] = monthKey.split('-');
                        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                        });

                        return (
                            <div key={monthKey} className="mb-12">
                                {/* Month Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="glass rounded-xl px-6 py-3 ml-12 md:ml-0 md:w-fit md:mx-auto">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                            <h2 className="text-xl font-bold">{monthName}</h2>
                                        </div>
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="space-y-8">
                                    {monthAchievements.map((achievement, idx) => (
                                        <div
                                            key={achievement.id}
                                            className={`relative md:w-1/2 ${idx % 2 === 0 ? 'md:ml-0 md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'}`}
                                        >
                                            {/* Timeline Dot */}
                                            <div className={`absolute left-3 md:left-auto ${idx % 2 === 0 ? 'md:-right-2.5' : 'md:-left-2.5'} top-6 w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 border-4 border-white shadow-lg`}></div>

                                            {/* Content */}
                                            <Link href={`/achievements/${achievement.id}`}>
                                                <div className="glass rounded-xl p-6 ml-12 md:ml-0 hover:shadow-xl transition cursor-pointer">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                                                            {achievement.description && (
                                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                                    {achievement.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(achievement.achieved_date || achievement.created_at).toLocaleDateString('en-US', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredAchievements.length === 0 && (
                    <div className="text-center py-12">
                        <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No achievements yet</h3>
                        <p className="text-gray-500 mb-6">Start adding achievements to see your timeline!</p>
                        <Link
                            href="/achievements/new"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
                        >
                            Add Achievement
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
