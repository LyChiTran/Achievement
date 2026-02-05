"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    FileText,
    Settings,
    LogOut
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        if (user === undefined) {
            // Still loading
            return;
        }

        if (!user) {
            // Not logged in
            router.push("/login");
            return;
        }

        if (!user.is_superuser) {
            // Not admin
            router.push("/dashboard");
            return;
        }

        setIsLoading(false);
    }, [user, router]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-purple-400">Admin Panel</h1>
                    <p className="text-sm text-gray-400 mt-1">Achievement Web</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Users className="w-5 h-5" />
                        <span>Users</span>
                    </Link>

                    <Link
                        href="/admin/analytics"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <TrendingUp className="w-5 h-5" />
                        <span>Analytics</span>
                    </Link>

                    <Link
                        href="/admin/content"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        <span>Content</span>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="px-4 py-2 text-sm text-gray-400">
                        <p className="font-medium text-white">{user?.email}</p>
                        <p className="text-xs">Admin</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-red-400"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
