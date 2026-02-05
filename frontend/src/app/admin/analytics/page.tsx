"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TrendingUp, Users as UsersIcon, Download, Calendar } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import toast from "react-hot-toast";

interface GrowthDataPoint {
    date: string;
    new_users: number;
    total_users: number;
}

export default function AnalyticsPage() {
    const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        fetchGrowthData();
    }, [days]);

    const fetchGrowthData = async () => {
        try {
            const response = await api.get('/api/admin/stats/growth', {
                params: { days }
            });
            setGrowthData(response.data);
        } catch (error) {
            console.error("Failed to fetch growth data:", error);
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = ["Date", "New Users", "Total Users"];
        const csvData = growthData.map(d => [
            d.date,
            d.new_users,
            d.total_users
        ]);

        const csv = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${days}days-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success("Data exported successfully!");
    };

    const chartData = growthData.map(d => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        newUsers: d.new_users,
        totalUsers: d.total_users
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">User growth and engagement metrics</p>
                </div>

                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Time Range Selector */}
            <div className="mb-6 flex items-center gap-4">
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</label>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                    <option value={180}>Last 6 months</option>
                    <option value={365}>Last year</option>
                </select>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total New Users"
                    value={growthData.reduce((sum, d) => sum + d.new_users, 0)}
                    subtitle={`in last ${days} days`}
                    icon={UsersIcon}
                    color="blue"
                />
                <StatCard
                    title="Current Total"
                    value={growthData[growthData.length - 1]?.total_users || 0}
                    subtitle="registered users"
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Daily Average"
                    value={Math.round(growthData.reduce((sum, d) => sum + d.new_users, 0) / days)}
                    subtitle="new users per day"
                    icon={Calendar}
                    color="purple"
                />
                <StatCard
                    title="Peak Day"
                    value={Math.max(...growthData.map(d => d.new_users), 0)}
                    subtitle="highest new users"
                    icon={TrendingUp}
                    color="orange"
                />
            </div>

            {/* Charts */}
            <div className="space-y-6">
                {/* Total Users Growth - Area Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-6 h-6 text-green-500" />
                        <h2 className="text-xl font-bold">Total Users Growth</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="totalUsers"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                                name="Total Users"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* New Users - Line Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <UsersIcon className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-bold">New Users Trend</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="newUsers"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="New Users"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

type ColorType = 'blue' | 'green' | 'purple' | 'orange';

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color
}: {
    title: string;
    value: number;
    subtitle: string;
    icon: any;
    color: ColorType;
}) {
    const colorClasses: Record<ColorType, string> = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {value.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                </div>
                <div className={`${colorClasses[color]} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}
