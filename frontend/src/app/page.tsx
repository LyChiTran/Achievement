"use client";

import Link from "next/link";
import { Trophy, Target, Award, TrendingUp } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center space-y-8">
                    <div className="inline-block">
                        <Trophy className="w-20 h-20 text-purple-600 mx-auto animate-bounce" />
                    </div>

                    <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" suppressHydrationWarning>
                        Achievement Web
                    </h1>

                    <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" suppressHydrationWarning>
                        Track, organize, and showcase your personal achievements in one beautiful place
                    </p>

                    <div className="flex gap-4 justify-center mt-8">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 shadow-lg"
                            suppressHydrationWarning
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all hover:scale-105"
                            suppressHydrationWarning
                        >
                            Login
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-4 text-gray-600 hover:text-gray-900 font-semibold transition"
                            suppressHydrationWarning
                        >
                            About
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="p-8 glass rounded-2xl hover:shadow-2xl transition-all hover:scale-105">
                        <Award className="w-12 h-12 text-purple-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2" suppressHydrationWarning>Track Achievements</h3>
                        <p className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                            Record all your accomplishments with details, dates, and categories
                        </p>
                    </div>

                    <div className="p-8 glass rounded-2xl hover:shadow-2xl transition-all hover:scale-105">
                        <Target className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2" suppressHydrationWarning>Set Goals</h3>
                        <p className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                            Define your objectives and track progress towards your dreams
                        </p>
                    </div>

                    <div className="p-8 glass rounded-2xl hover:shadow-2xl transition-all hover:scale-105">
                        <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2" suppressHydrationWarning>Visualize Progress</h3>
                        <p className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                            See your growth with beautiful charts and timelines
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-20 text-center">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="p-6">
                            <div className="text-4xl font-bold text-purple-600">∞</div>
                            <div className="text-gray-600 dark:text-gray-400 mt-2" suppressHydrationWarning>Achievements</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-blue-600">∞</div>
                            <div className="text-gray-600 dark:text-gray-400 mt-2" suppressHydrationWarning>Categories</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-green-600">∞</div>
                            <div className="text-gray-600 dark:text-gray-400 mt-2" suppressHydrationWarning>Skills</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-orange-600">∞</div>
                            <div className="text-gray-600 dark:text-gray-400 mt-2" suppressHydrationWarning>Goals</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
