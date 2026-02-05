"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Achievement } from "@/types";
import { BarChart3, TrendingUp, Award, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await api.get<Achievement[]>("/api/achievements/");
            setAchievements(response.data);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const totalAchievements = achievements.length;
    const publicAchievements = achievements.filter(a => a.is_public).length;
    const thisYear = new Date().getFullYear();
    const thisYearAchievements = achievements.filter(a =>
        new Date(a.achieved_date || a.created_at).getFullYear() === thisYear
    ).length;

    const avgImportance = achievements.length > 0
        ? (achievements.reduce((sum, a) => sum + a.importance_level, 0) / achievements.length).toFixed(1)
        : 0;

    // Achievements by year
    const byYear = achievements.reduce((acc, a) => {
        const year = new Date(a.achieved_date || a.created_at).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const yearlyData = Object.entries(byYear)
        .map(([year, count]) => ({ year: parseInt(year), count }))
        .sort((a, b) => b.year - a.year);

    // Achievements by month (this year)
    const byMonth = achievements
        .filter(a => new Date(a.achieved_date || a.created_at).getFullYear() === thisYear)
        .reduce((acc, a) => {
            const month = new Date(a.achieved_date || a.created_at).getMonth();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = monthNames.map((name, index) => ({
        month: name,
        count: byMonth[index] || 0
    }));

    const maxMonthly = Math.max(...monthlyData.map(m => m.count), 1);

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
                            <BarChart3 className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold">Analytics</h1>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* KPI Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Award className="w-8 h-8 text-purple-600" />
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-purple-600 mb-1">{totalAchievements}</div>
                        <div className="text-sm text-gray-600">Total Achievements</div>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-1">{thisYearAchievements}</div>
                        <div className="text-sm text-gray-600">This Year ({thisYear})</div>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-600 mb-1">{avgImportance}</div>
                        <div className="text-sm text-gray-600">Avg. Importance</div>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">🌐</span>
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-1">{publicAchievements}</div>
                        <div className="text-sm text-gray-600">Public</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Yearly Breakdown */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-6">Achievements by Year</h2>
                        {yearlyData.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No data available</p>
                        ) : (
                            <div className="space-y-4">
                                {yearlyData.map(({ year, count }) => {
                                    const maxCount = Math.max(...yearlyData.map(d => d.count));
                                    const percentage = (count / maxCount) * 100;
                                    return (
                                        <div key={year}>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-semibold">{year}</span>
                                                <span className="text-purple-600 font-bold">{count}</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Monthly Breakdown (This Year) */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-6">{thisYear} Monthly Breakdown</h2>
                        {thisYearAchievements === 0 ? (
                            <p className="text-gray-500 text-center py-8">No achievements this year</p>
                        ) : (
                            <div className="space-y-3">
                                {monthlyData.map(({ month, count }) => (
                                    <div key={month} className="flex items-center gap-3">
                                        <span className="text-sm font-medium w-8">{month}</span>
                                        <div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all"
                                                style={{ width: `${(count / maxMonthly) * 100}%` }}
                                            >
                                                {count > 0 && count}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass rounded-xl p-6 mt-6">
                    <h2 className="text-xl font-bold mb-6">Recent Achievements</h2>
                    {achievements.slice(0, 5).map(achievement => (
                        <Link
                            key={achievement.id}
                            href={`/achievements/${achievement.id}`}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition mb-2"
                        >
                            <div>
                                <h3 className="font-semibold">{achievement.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {new Date(achievement.achieved_date || achievement.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {[...Array(achievement.importance_level)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
