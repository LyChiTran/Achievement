"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Target, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Skill {
    id: number;
    name: string;
    proficiency_level: number;
    category?: string;
    created_at: string;
}

export default function SkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newSkill, setNewSkill] = useState({ name: "", proficiency_level: 50, category: "" });

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const response = await api.get<Skill[]>("/api/skills/");
            setSkills(response.data);
        } catch (error) {
            console.error("Failed to load skills", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/skills/", newSkill);
            alert("Skill added! 🎯");
            setNewSkill({ name: "", proficiency_level: 50, category: "" });
            setShowModal(false);
            loadSkills();
        } catch (error) {
            alert("Failed to add skill");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this skill?")) return;
        try {
            await api.delete(`/api/skills/${id}`);
            loadSkills();
        } catch (error) {
            alert("Failed to delete skill");
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
                            <Target className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold">Skills Tracking</h1>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Skill
                            </button>
                            <Link href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {skills.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">No skills tracked yet</h3>
                        <p className="text-gray-600 mb-6">Start tracking your skills and progress</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Add Your First Skill
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {skills.map(skill => (
                            <div key={skill.id} className="glass rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold">{skill.name}</h3>
                                        {skill.category && (
                                            <p className="text-sm text-gray-600">{skill.category}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-purple-600">
                                            {skill.proficiency_level}%
                                        </span>
                                        <button
                                            onClick={() => handleDelete(skill.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                                        style={{ width: `${skill.proficiency_level}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">Add New Skill</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Skill Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newSkill.name}
                                    onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="e.g., React.js"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <input
                                    type="text"
                                    value={newSkill.category}
                                    onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="e.g., Frontend Development"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Proficiency Level: {newSkill.proficiency_level}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={newSkill.proficiency_level}
                                    onChange={e => setNewSkill({ ...newSkill, proficiency_level: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Add Skill
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
