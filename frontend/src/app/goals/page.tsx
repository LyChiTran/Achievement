"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Crosshair, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Goal {
    id: number;
    title: string;
    description?: string;
    target_date?: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
    progress_percentage: number;
    created_at: string;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newGoal, setNewGoal] = useState({
        title: "",
        description: "",
        target_date: "",
        progress_percentage: 0
    });

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const response = await api.get<Goal[]>("/api/goals/");
            setGoals(response.data);
        } catch (error) {
            console.error("Failed to load goals", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/goals/", newGoal);
            alert("Goal created! 🎯");
            setNewGoal({ title: "", description: "", target_date: "", progress_percentage: 0 });
            setShowModal(false);
            loadGoals();
        } catch (error) {
            alert("Failed to create goal");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this goal?")) return;
        try {
            await api.delete(`/api/goals/${id}`);
            loadGoals();
        } catch (error) {
            alert("Failed to delete goal");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in_progress': return 'bg-blue-100 text-blue-700';
            case 'not_started': return 'bg-gray-100 text-gray-700';
            default: return 'bg-red-100 text-red-700';
        }
    };

    const groupedGoals = {
        not_started: goals.filter(g => g.status === 'not_started'),
        in_progress: goals.filter(g => g.status === 'in_progress'),
        completed: goals.filter(g => g.status === 'completed'),
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
                            <Crosshair className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold">Goals</h1>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                <Plus className="w-4 h-4" />
                                New Goal
                            </button>
                            <Link href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Not Started */}
                    <div>
                        <h2 className="text-lg font-bold mb-4 text-gray-700">Not Started ({groupedGoals.not_started.length})</h2>
                        <div className="space-y-3">
                            {groupedGoals.not_started.map(goal => (
                                <div key={goal.id} className="glass rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold">{goal.title}</h3>
                                        <button onClick={() => handleDelete(goal.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {goal.description && <p className="text-sm text-gray-600 mb-2">{goal.description}</p>}
                                    {goal.target_date && (
                                        <p className="text-xs text-gray-500">
                                            Target: {new Date(goal.target_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))}
                            {groupedGoals.not_started.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">No goals</div>
                            )}
                        </div>
                    </div>

                    {/* In Progress */}
                    <div>
                        <h2 className="text-lg font-bold mb-4 text-blue-700">In Progress ({groupedGoals.in_progress.length})</h2>
                        <div className="space-y-3">
                            {groupedGoals.in_progress.map(goal => (
                                <div key={goal.id} className="glass rounded-lg p-4 border-l-4 border-blue-600">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold">{goal.title}</h3>
                                        <button onClick={() => handleDelete(goal.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {goal.description && <p className="text-sm text-gray-600 mb-2">{goal.description}</p>}
                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Progress</span>
                                            <span className="font-semibold">{goal.progress_percentage}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 transition-all"
                                                style={{ width: `${goal.progress_percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    {goal.target_date && (
                                        <p className="text-xs text-gray-500">
                                            Target: {new Date(goal.target_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))}
                            {groupedGoals.in_progress.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">No goals</div>
                            )}
                        </div>
                    </div>

                    {/* Completed */}
                    <div>
                        <h2 className="text-lg font-bold mb-4 text-green-700">Completed ({groupedGoals.completed.length})</h2>
                        <div className="space-y-3">
                            {groupedGoals.completed.map(goal => (
                                <div key={goal.id} className="glass rounded-lg p-4 border-l-4 border-green-600">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            <h3 className="font-semibold">{goal.title}</h3>
                                        </div>
                                        <button onClick={() => handleDelete(goal.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {goal.description && <p className="text-sm text-gray-600">{goal.description}</p>}
                                </div>
                            ))}
                            {groupedGoals.completed.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">No goals</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">Create New Goal</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Goal Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={newGoal.title}
                                    onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="e.g., Learn TypeScript"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={newGoal.description}
                                    onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Target Date</label>
                                <input
                                    type="date"
                                    value={newGoal.target_date}
                                    onChange={e => setNewGoal({ ...newGoal, target_date: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Create Goal
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
