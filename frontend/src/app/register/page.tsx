"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const { isLoading } = useAuthStore();

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // OTP state
    const [step, setStep] = useState<"form" | "otp">("form");
    const [otpCode, setOtpCode] = useState("");
    const [tempId, setTempId] = useState<number>(0);

    // UI state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Password validation
    const validatePassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(password);
        const hasMinLength = password.length >= 8;

        return {
            hasUpperCase,
            hasNumber,
            hasSpecialChar,
            hasMinLength,
            isValid: hasUpperCase && hasNumber && hasSpecialChar && hasMinLength
        };
    };

    const passwordStrength = validatePassword(password);

    // Step 1: Submit form and request OTP
    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!agreedToTerms) {
            setError("You must agree to Terms of Service and Privacy Policy");
            return;
        }

        if (!passwordStrength.isValid) {
            setError("Password does not meet requirements");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/api/auth/register/request-otp", null, {
                params: {
                    email,
                    full_name: fullName || ""
                }
            });

            setTempId(response.data.temp_id);
            setStep("otp");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and create account
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!otpCode || otpCode.length !== 6) {
            setError("Please enter valid 6-digit OTP code");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/api/auth/register",
                {
                    email,
                    password,
                    full_name: fullName || undefined
                },
                {
                    params: {
                        otp_code: otpCode
                    }
                }
            );

            // Success! Redirect to login
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Invalid OTP code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <UserPlus className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold" suppressHydrationWarning>
                            {step === "form" ? "Create Account" : "Verify Email"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2" suppressHydrationWarning>
                            {step === "form"
                                ? "Start tracking your achievements today"
                                : `We sent a code to ${email}`
                            }
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "form" ? "bg-purple-600 text-white" : "bg-green-500 text-white"
                                }`}>
                                1
                            </div>
                            <div className={`w-16 h-1 ${step === "otp" ? "bg-purple-600" : "bg-gray-300"}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "otp" ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
                                }`}>
                                2
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Registration Form */}
                    {step === "form" && (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" suppressHydrationWarning>Full Name (Optional)</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" suppressHydrationWarning>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" suppressHydrationWarning>Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={passwordStrength.hasMinLength ? 'text-green-500' : 'text-gray-400'} suppressHydrationWarning>
                                                {passwordStrength.hasMinLength ? '✓' : '○'} At least 8 characters
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={passwordStrength.hasUpperCase ? 'text-green-500' : 'text-gray-400'} suppressHydrationWarning>
                                                {passwordStrength.hasUpperCase ? '✓' : '○'} One uppercase letter
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'} suppressHydrationWarning>
                                                {passwordStrength.hasNumber ? '✓' : '○'} One number
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-gray-400'} suppressHydrationWarning>
                                                {passwordStrength.hasSpecialChar ? '✓' : '○'} One special character
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 mr-2"
                                    required
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-purple-600 hover:underline" suppressHydrationWarning>
                                        Terms of Service
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-purple-600 hover:underline" suppressHydrationWarning>
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !passwordStrength.isValid}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                suppressHydrationWarning
                            >
                                {loading ? "Sending OTP..." : "Continue →"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === "otp" && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" suppressHydrationWarning>Enter OTP Code</label>
                                <input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    className="w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center" suppressHydrationWarning>
                                    Check your email for the 6-digit code
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("form");
                                        setOtpCode("");
                                        setError("");
                                    }}
                                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                    suppressHydrationWarning
                                >
                                    ← Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || otpCode.length !== 6}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    suppressHydrationWarning
                                >
                                    {loading ? "Verifying..." : "Create Account"}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                            Already have an account?{" "}
                            <Link href="/login" className="text-purple-600 hover:underline font-semibold" suppressHydrationWarning>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
