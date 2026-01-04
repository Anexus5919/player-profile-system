"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Create account
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create account');
                setLoading(false);
                return;
            }

            // Auto sign-in after successful registration
            const signInResult = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.error) {
                setError('Account created! Please sign in.');
                router.push('/login');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = () => {
        const { password } = formData;
        if (!password) return null;
        if (password.length < 6) return { text: 'Too short', color: 'text-red-500', width: '25%' };
        if (password.length < 8) return { text: 'Weak', color: 'text-yellow-500', width: '50%' };
        if (password.length < 12) return { text: 'Good', color: 'text-lime-500', width: '75%' };
        return { text: 'Strong', color: 'text-green-500', width: '100%' };
    };

    const strength = passwordStrength();

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-500/10 rounded-full mb-4">
                        <UserPlus size={32} className="text-lime-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Create Account</h1>
                    <p className="text-gray-500 mt-2">Start building your player profile</p>
                </div>

                {/* Form Card */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-lime-500 focus:outline-none transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-lime-500 focus:outline-none transition-colors"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-lime-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            {strength && (
                                <div className="mt-2">
                                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${strength.color.replace('text-', 'bg-')}`}
                                            style={{ width: strength.width }}
                                        />
                                    </div>
                                    <span className={`text-xs ${strength.color} mt-1 block`}>{strength.text}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-lime-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500" />
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-lime-600 to-lime-500 text-black font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(132,204,22,0.3)]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-lime-500 hover:text-lime-400 font-bold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    © 2024 Player Profile System. All rights reserved.
                </p>
            </div>
        </div>
    );
}
