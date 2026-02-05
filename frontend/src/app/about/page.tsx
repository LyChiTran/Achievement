"use client";

import { Trophy, Target, Tag, Crosshair, Clock, User, Github, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const features = [
        {
            icon: Trophy,
            title: "Track Achievements",
            description: "Record and celebrate your personal and professional milestones"
        },
        {
            icon: Tag,
            title: "Organize by Categories",
            description: "Group achievements by different aspects of your life"
        },
        {
            icon: Target,
            title: "Skill Development",
            description: "Monitor your skill proficiency and track improvement over time"
        },
        {
            icon: Crosshair,
            title: "Set Goals",
            description: "Define and pursue your objectives with progress tracking"
        },
        {
            icon: Clock,
            title: "Timeline View",
            description: "Visualize your journey through an interactive timeline"
        },
        {
            icon: User,
            title: "Personal Portfolio",
            description: "Showcase your achievements publicly or keep them private"
        }
    ];



    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Hero Section */}
            <header className="border-b glass">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                        <Trophy className="w-6 h-6" />
                        <span className="font-bold text-xl">Achievement Web</span>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-block p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6">
                        <Trophy className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Achievement Web
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your personal platform to track achievements, develop skills, and celebrate your journey
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="glass rounded-xl p-6 hover:shadow-xl transition">
                                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl w-fit mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Why Use This */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="glass rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Why Track Achievements?</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">✓</span>
                                <span>Build confidence by celebrating your wins</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">✓</span>
                                <span>Visualize your professional growth over time</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">✓</span>
                                <span>Keep a portfolio of your accomplishments</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1">✓</span>
                                <span>Share your journey with others</span>
                            </li>
                        </ul>
                    </div>

                    <div className="glass rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Perfect For</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Students tracking academic achievements</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Professionals building their career portfolio</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Developers documenting their learning journey</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Anyone wanting to celebrate their progress</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center glass rounded-2xl p-12">
                    <h2 className="text-3xl font-bold mb-4">Start Your Journey Today</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join Achievement Web and begin tracking your accomplishments. It's free, modern, and built with care.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-gray-600">
                    <p className="flex items-center justify-center gap-2">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Ly Chi Tran
                    </p>
                    <p className="mt-2 text-sm">© 2026 Ly Chi Tran. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
