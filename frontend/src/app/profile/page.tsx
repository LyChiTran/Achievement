"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";
import { User, Mail, Lock, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const { user, fetchUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        bio: "",
    });
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                email: user.email,
                bio: user.bio || "",
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put("/api/auth/me", formData);
            alert("Profile updated successfully! ✨");
            fetchUser();
        } catch (error) {
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            alert("Passwords don't match!");
            return;
        }
        setLoading(true);
        try {
            await api.post("/api/auth/change-password", {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
            });
            alert("Password changed successfully! 🔒");
            setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
        } catch (error) {
            alert("Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <header className="border-b glass sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <User className="w-10 h-10 text-purple-600" />
                    <div>
                        <h1 className="text-3xl font-bold">Profile Settings</h1>
                        <p className="text-gray-600">Manage your account information</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Profile Info */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-6">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirm_password}
                                    onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                <Lock className="w-4 h-4" />
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-900 text-sm mb-2">Password Requirements</h3>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>• At least 6 characters long</li>
                                <li>• Include numbers and letters</li>
                                <li>• Avoid common passwords</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Account Stats */}
                <div className="glass rounded-xl p-6 mt-6">
                    <h2 className="text-xl font-bold mb-4">Account Statistics</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Member Since</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {user?.created_at && new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Account Type</p>
                            <p className="text-2xl font-bold text-blue-600">Free</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <p className="text-2xl font-bold text-green-600">Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
