"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, TrendingUp, Trophy, Star, CheckCircle } from "lucide-react";

interface SystemStats {
    total_users: number;
    active_users: number;
    verified_users: number;
    pro_users: number;
    total_achievements: number;
    total_skills: number;
    total_goals: number;
    users_created_today: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/admin/stats/overview');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">System statistics and insights</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats?.total_users || 0}
                    icon={Users}
                    color="bg-blue-500"
                    subtitle={`${stats?.users_created_today || 0} today`}
                />
                <StatCard
                    title="Active Users"
                    value={stats?.active_users || 0}
                    icon={CheckCircle}
                    color="bg-green-500"
                    subtitle="Currently active"
                />
                <StatCard
                    title="Achievements"
                    value={stats?.total_achievements || 0}
                    icon={Trophy}
                    color="bg-yellow-500"
                    subtitle={`${stats?.total_skills || 0} skills, ${stats?.total_goals || 0} goals`}
                />
                <StatCard
                    title="Pro Users"
                    value={stats?.pro_users || 0}
                    icon={Star}
                    color="bg-purple-500"
                    subtitle={`${stats?.verified_users || 0} verified`}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionButton
                        href="/admin/users"
                        label="Manage Users"
                        description="View and manage all users"
                    />
                    <QuickActionButton
                        href="/admin/analytics"
                        label="View Analytics"
                        description="User growth and trends"
                    />
                    <QuickActionButton
                        href="/admin/content"
                        label="Moderate Content"
                        description="Review achievements"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    subtitle
}: {
    title: string;
    value: number;
    icon: any;
    color: string;
    subtitle?: string;
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value.toLocaleString()}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`${color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}

function QuickActionButton({
    href,
    label,
    description
}: {
    href: string;
    label: string;
    description: string;
}) {
    return (
        <a
            href={href}
            className="block p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
        >
            <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </a>
    );
}
