"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
    Settings as SettingsIcon,
    Mail,
    Database,
    Shield,
    Bell,
    Save,
    RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [systemInfo, setSystemInfo] = useState({
        environment: "development",
        version: "1.0.0",
        database: "SQLite",
        totalUsers: 0,
        totalAchievements: 0
    });

    useEffect(() => {
        loadSystemInfo();
    }, []);

    const loadSystemInfo = async () => {
        try {
            const response = await api.get('/api/admin/stats/overview');
            setSystemInfo(prev => ({
                ...prev,
                totalUsers: response.data.total_users || 0,
                totalAchievements: response.data.total_achievements || 0
            }));
        } catch (error) {
            console.error("Failed to load system info:", error);
        }
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            // Simulate save
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Settings saved successfully!");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    System Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage system configuration and parameters
                </p>
            </div>

            <div className="space-y-6">
                {/* System Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold">System Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem label="Environment" value={systemInfo.environment} />
                        <InfoItem label="Version" value={systemInfo.version} />
                        <InfoItem label="Database" value={systemInfo.database} />
                        <InfoItem label="Total Users" value={systemInfo.totalUsers.toString()} />
                        <InfoItem label="Total Achievements" value={systemInfo.totalAchievements.toString()} />
                    </div>
                </div>

                {/* Email Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold">Email Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email Provider
                            </label>
                            <input
                                type="text"
                                value="SendGrid"
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                From Email
                            </label>
                            <input
                                type="email"
                                defaultValue="noreply@achievementweb.com"
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                API Key Status
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Configured
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-bold">Security</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">User Registration</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Allow new users to register
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email Verification Required</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Users must verify email before login
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Maintenance Mode</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Disable user access temporarily
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-6 h-6 text-yellow-600" />
                        <h2 className="text-xl font-bold">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">New User Notifications</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Send email when new user registers
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Daily Reports</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Receive daily system statistics
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSaveSettings}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {loading ? "Saving..." : "Save Settings"}
                    </button>

                    <button
                        onClick={loadSystemInfo}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {value}
            </p>
        </div>
    );
}
