'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Password validation
    const validatePassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasMinLength = password.length >= 8;

        return {
            hasUpperCase,
            hasNumber,
            hasSpecialChar,
            hasMinLength,
            isValid: hasUpperCase && hasNumber && hasSpecialChar && hasMinLength
        };
    };

    const passwordStrength = validatePassword(newPassword);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/forgot-password', null, {
                params: { email }
            });
            console.log('✅ Forgot password response:', response.data);
            toast.success('OTP code has been sent to your email!');
            setStep('otp');
        } catch (error: any) {
            console.error('❌ Forgot password error:', error);
            console.error('Error response:', error.response);
            toast.error(error.response?.data?.detail || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/api/auth/verify-otp', null, {
                params: { email, otp_code: otp }
            });
            toast.success('OTP verified successfully!');
            setStep('reset');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Invalid OTP code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!passwordStrength.isValid) {
            toast.error('Password does not meet requirements');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/api/auth/reset-password', null, {
                params: { email, new_password: newPassword }
            });
            toast.success('Password reset successfully!');
            setTimeout(() => router.push('/login'), 1500);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="glass rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" suppressHydrationWarning>
                            Forgot Password
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                            {step === 'email' && 'Enter your email to receive OTP code'}
                            {step === 'otp' && 'Enter the OTP code sent to your email'}
                            {step === 'reset' && 'Set your new password'}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'email' ? 'bg-purple-600 text-white' : 'bg-green-500 text-white'}`}>
                                {step === 'email' ? '1' : '✓'}
                            </div>
                            <div className={`w-16 h-1 ${step !== 'email' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-purple-600 text-white' : step === 'reset' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                {step === 'reset' ? '✓' : '2'}
                            </div>
                            <div className={`w-16 h-1 ${step === 'reset' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'reset' ? 'bg-purple-600 text-white' : 'bg-gray-300'}`}>
                                3
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Email Input */}
                    {step === 'email' && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
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

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                suppressHydrationWarning
                            >
                                {isLoading ? 'Sending...' : 'Send OTP Code'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Input */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" suppressHydrationWarning>OTP Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center" suppressHydrationWarning>
                                    OTP code valid for 10 minutes
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                suppressHydrationWarning
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="w-full text-sm text-purple-600 hover:underline"
                                suppressHydrationWarning
                            >
                                Resend OTP Code
                            </button>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" suppressHydrationWarning>New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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
                                {newPassword && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={passwordStrength.hasMinLength ? 'text-green-500' : 'text-gray-400'}>
                                                {passwordStrength.hasMinLength ? '✓' : '○'} At least 8 characters
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={passwordStrength.hasUpperCase ? 'text-green-500' : 'text-gray-400'}>
                                                {passwordStrength.hasUpperCase ? '✓' : '○'} One uppercase letter
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'}>
                                                {passwordStrength.hasNumber ? '✓' : '○'} One number
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-gray-400'}>
                                                {passwordStrength.hasSpecialChar ? '✓' : '○'} One special character
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" suppressHydrationWarning>Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? (
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
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !passwordStrength.isValid}
                                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                suppressHydrationWarning
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <p className="text-center mt-6 text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                        Remember your password?{" "}
                        <Link href="/login" className="text-purple-600 hover:underline font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
