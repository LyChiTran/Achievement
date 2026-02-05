// User types
export interface User {
    id: number;
    email: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    is_active: boolean;
    is_superuser: boolean;  // Admin flag for admin dashboard access
    created_at: string;
    updated_at: string;
}

// Achievement types
export interface Achievement {
    id: number;
    user_id: number;
    category_id?: number;
    title: string;
    description?: string;
    achieved_date?: string;  // Added field
    date_achieved?: string;
    importance_level: number;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface AchievementCreate {
    title: string;
    description?: string;
    category_id?: number;
    date_achieved?: string;
    importance_level?: number;
    is_public?: boolean;
}

// Category types
export interface Category {
    id: number;
    name: string;
    icon?: string;
    color?: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

// Skill types
export interface Skill {
    id: number;
    user_id: number;
    name: string;
    proficiency_level: number;
    category?: string;
    created_at: string;
    updated_at: string;
}

// Goal types
export type GoalStatus = "not_started" | "in_progress" | "completed" | "cancelled";

export interface Goal {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    target_date?: string;
    status: GoalStatus;
    progress_percentage: number;
    created_at: string;
    updated_at: string;
}

// Auth types
export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    full_name?: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}
