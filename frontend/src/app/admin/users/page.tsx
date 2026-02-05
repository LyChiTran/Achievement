"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Edit, Trash2, Shield, CheckCircle, XCircle, Star } from "lucide-react";
import toast from "react-hot-toast";

interface UserAdmin {
    id: number;
    email: string;
    full_name: string | null;
    is_active: boolean;
    is_superuser: boolean;
    subscription_tier: string;
    is_email_verified: boolean;
    created_at: string;
    achievement_count: number;
    skill_count: number;
    goal_count: number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/admin/users', {
                params: { search: search || undefined }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await api.delete(`/api/admin/users/${userId}`);
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to delete user");
        }
    };

    const handleEditUser = (user: UserAdmin) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleUpdateUser = async (updates: any) => {
        if (!selectedUser) return;

        try {
            await api.put(`/api/admin/users/${selectedUser.id}`, updates);
            toast.success("User updated successfully");
            setShowEditModal(false);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to update user");
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
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{users.length} total users</p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 dark:bg-gray-800 dark:border-gray-700"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tier
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Stats
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.full_name || "No name"}
                                                {user.is_superuser && (
                                                    <Shield className="inline w-4 h-4 ml-2 text-purple-500" />
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.subscription_tier === 'pro'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        {user.subscription_tier === 'pro' && <Star className="inline w-3 h-3 mr-1" />}
                                        {user.subscription_tier.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {user.is_active ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        {user.is_email_verified && (
                                            <span className="text-xs text-green-600">Verified</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {user.achievement_count} ach, {user.skill_count} skills
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400 mr-4"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateUser}
                />
            )}
        </div>
    );
}

function EditUserModal({
    user,
    onClose,
    onUpdate
}: {
    user: UserAdmin;
    onClose: () => void;
    onUpdate: (updates: any) => void;
}) {
    const [isActive, setIsActive] = useState(user.is_active);
    const [isSuperuser, setIsSuperuser] = useState(user.is_superuser);
    const [tier, setTier] = useState(user.subscription_tier);
    const [isVerified, setIsVerified] = useState(user.is_email_verified);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({
            is_active: isActive,
            is_superuser: isSuperuser,
            subscription_tier: tier,
            is_email_verified: isVerified
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Edit User</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="text"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Subscription Tier</label>
                        <select
                            value={tier}
                            onChange={(e) => setTier(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                        >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm">Active</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isVerified}
                                onChange={(e) => setIsVerified(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm">Email Verified</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isSuperuser}
                                onChange={(e) => setIsSuperuser(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm">Admin</span>
                        </label>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
