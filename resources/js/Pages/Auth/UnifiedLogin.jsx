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

            {/* Main Card Container - Compact & Beautiful */}
            <div className="w-full max-w-[380px]">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">

                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                    {/* Logo Section - Compact */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 mb-3 relative flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-3 border-indigo-100 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg overflow-hidden transform transition-transform duration-500 hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-600">
                                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 003.239 8.588.75.75 0 013.04 7.252a60.65 60.65 0 0110.9-2.812z" />
                                    <path d="M12.75 14.226l-3.09 1.636a15.82 15.82 0 006.319-1.956 16.038 16.038 0 00-3.23.32z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-center text-[#0F172A] font-extrabold text-lg tracking-wide uppercase">
                            Secure Access
                        </h2>

                        {/* Role Detection Feedback - Compact */}
                        <div className="h-6 mt-2 flex items-center justify-center">
                            {detectedRole ? (
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white uppercase tracking-wider shadow-md animate-in fade-in zoom-in duration-300">
                                    {detectedRole} Portal
                                </span>
                            ) : (
                                <span className="text-[9px] text-gray-400 uppercase font-semibold tracking-widest">Enter Credentials</span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Username - Compact */}
                        <div className="group">
                            <label htmlFor="username" className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-3">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm text-gray-700 placeholder-gray-400 bg-gray-50/50 font-medium"
                                placeholder="s_12345"
                                required
                                autoFocus
                            />
                            {errors.username && (
                                <p className="mt-1 text-[10px] text-red-500 font-semibold pl-3">{errors.username}</p>
                            )}
                        </div>

                        {/* Password - Compact */}
                        <div className="group">
                            <label htmlFor="password" className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-3">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm text-gray-700 placeholder-gray-400 bg-gray-50/50 pr-10 font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-[10px] text-red-500 font-semibold pl-3">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me - Compact */}
                        <div className="flex items-center justify-between text-[10px] px-1">
                            <label className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 border-2"
                                    />
                                </div>
                                <span className="ml-2 font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Remember device</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wide"
                                >
                                    Forgot?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button - Compact & Beautiful */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg transition-all duration-300 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl hover:transform hover:-translate-y-0.5 active:scale-95 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer - Compact */}
                <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-[9px] font-semibold text-white/50 uppercase tracking-wider">
                        © 2026 <span className="text-white/80">Darul-Ulum School</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
