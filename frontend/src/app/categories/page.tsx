"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Tag, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    created_at: string;
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", description: "", color: "#8B5CF6" });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get<Category[]>("/api/categories/");
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to load categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/categories/", newCategory);
            alert("Category created! ✨");
            setNewCategory({ name: "", description: "", color: "#8B5CF6" });
            setShowCreateModal(false);
            loadCategories();
        } catch (error) {
            alert("Failed to create category");
        }
    };

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
                            <Tag className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold">Categories</h1>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                <Plus className="w-4 h-4" />
                                New Category
                            </button>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {categories.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <Tag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
                        <p className="text-gray-600 mb-6">Create categories to organize your achievements</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            Create Your First Category
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className="glass rounded-xl p-6 hover:shadow-xl transition"
                                style={{ borderLeft: `4px solid ${category.color || '#8B5CF6'}` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                                        {category.description && (
                                            <p className="text-gray-600 text-sm">{category.description}</p>
                                        )}
                                    </div>
                                    <div
                                        className="w-8 h-8 rounded-full"
                                        style={{ backgroundColor: category.color || '#8B5CF6' }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500">
                                    Created {new Date(category.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">Create New Category</h2>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="e.g., Education"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <input
                                    type="color"
                                    value={newCategory.color}
                                    onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                                    className="w-full h-12 rounded-lg cursor-pointer"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
