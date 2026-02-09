/**
 * Unified Login Page
 * Intelligent authentication portal for all school roles.
 */
import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import RoleBadge from '@/Components/Auth/RoleBadge';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function UnifiedLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const [detectedRole, setDetectedRole] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    // Intelligent Role Detection Logic based on username
    useEffect(() => {
        const username = data.username.toLowerCase();
        if (username.startsWith('admin') || username === 'admin') {
            setDetectedRole('admin');
        } else if (username.startsWith('teacher') || username.startsWith('t_')) {
            setDetectedRole('teacher');
        } else if (username.startsWith('student') || username.startsWith('s_')) {
            setDetectedRole('student');
        } else if (username.startsWith('parent') || username.startsWith('p_')) {
            setDetectedRole('parent');
        } else if (username.startsWith('registrar') || username.startsWith('r_')) {
            setDetectedRole('registrar');
        } else {
            setDetectedRole(null);
        }
    }, [data.username]);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E3A8A] font-sans px-4">
            <Head title="Login - Darul-Ulum School" />

            {/* Main Card Container */}
            <div className="w-full max-w-[400px]">
                <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 p-10 relative overflow-hidden">

                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 mb-5 relative flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 flex items-center justify-center bg-white shadow-inner overflow-hidden transform transition-transform duration-500 hover:rotate-12">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#0F172A]">
                                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 003.239 8.588.75.75 0 013.04 7.252a60.65 60.65 0 0110.9-2.812z" />
                                    <path d="M12.75 14.226l-3.09 1.636a15.82 15.82 0 006.319-1.956 16.038 16.038 0 00-3.23.32z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-center text-[#0F172A] font-black text-xl tracking-widest uppercase">
                            Secure Access
                        </h2>

                        {/* Role Detection Feedback */}
                        <div className="h-8 mt-2 flex items-center justify-center">
                            {detectedRole ? (
                                <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 uppercase tracking-tighter border border-blue-100 animate-in fade-in zoom-in duration-300">
                                    {detectedRole} Portal
                                </span>
                            ) : (
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em]">Enter Credentials</span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Username */}
                        <div className="group">
                            <label htmlFor="username" className="block text-[11px] font-black text-[#0F172A] uppercase tracking-widest mb-2 ml-4">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-700 placeholder-gray-300 bg-gray-50/50"
                                placeholder="e.g. j.doe"
                                required
                                autoFocus
                            />
                            {errors.username && (
                                <p className="mt-2 text-xs text-red-500 font-bold pl-4">{errors.username}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label htmlFor="password" className="block text-[11px] font-black text-[#0F172A] uppercase tracking-widest mb-2 ml-4">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-700 placeholder-gray-300 bg-gray-50/50 pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-xs text-red-500 font-bold pl-4">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between text-[11px] px-2">
                            <label className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 border-2"
                                    />
                                </div>
                                <span className="ml-3 font-bold text-gray-500 group-hover:text-[#0F172A] transition-colors">Remember device</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-tighter"
                                >
                                    Forgot?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all duration-300 bg-[#0F172A] hover:bg-black hover:transform hover:-translate-y-1 active:scale-95 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                        © 2026 <span className="text-white/80">Darul-Ulum School</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
