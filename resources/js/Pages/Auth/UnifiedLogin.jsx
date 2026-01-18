import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AnimatedBackground from '@/Components/Auth/AnimatedBackground';
import GlassCard from '@/Components/Auth/GlassCard';
import RoleBadge from '@/Components/Auth/RoleBadge';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import schooLogoUrl from '/images/logo.png'; // Assuming logo exists, handle fallback if not

export default function UnifiedLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const [detectedRole, setDetectedRole] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [logoLoaded, setLogoLoaded] = useState(false);

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

    // Dynamic Theme Colors
    const getThemeColors = () => {
        switch (detectedRole) {
            case 'admin': return 'from-amber-500 to-orange-600 shadow-amber-500/30';
            case 'teacher': return 'from-blue-500 to-indigo-600 shadow-blue-500/30';
            case 'student': return 'from-emerald-500 to-teal-600 shadow-emerald-500/30';
            case 'parent': return 'from-purple-500 to-violet-600 shadow-purple-500/30';
            case 'registrar': return 'from-indigo-500 to-purple-600 shadow-indigo-500/30';
            default: return 'from-slate-700 to-slate-900 shadow-slate-500/30';
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden font-sans text-white/90">
            <Head title="Login - School Portal" />

            {/* Animated Background */}
            <AnimatedBackground />

            <div className="w-full max-w-md px-6 py-4 z-10 animate-in fade-in zoom-in-95 duration-700">
                <GlassCard className={`p-8 transition-colors duration-500 border-t ${detectedRole ? 'border-t-white/40' : 'border-t-white/20'}`}>

                    {/* Header Section */}
                    <div className="text-center mb-8">
                        {/* School Logo Placeholder with Glow */}
                        <div className="mx-auto h-16 w-16 mb-4 relative flex items-center justify-center">
                            <div className={`absolute inset-0 bg-gradient-to-tr ${getThemeColors()} rounded-full blur-xl opacity-60 animate-pulse-slow`}></div>
                            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20 shadow-lg">
                                {/* Use generic icon if logo not available */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 003.239 8.588.75.75 0 013.04 7.252a60.65 60.65 0 0110.9-2.812zM14.246 2.195l.161.815.165.815.161-.815zM2.838 9.387l-.145.719-.138.729.138-.729zM19.162 9.387l.145.719.138.729-.138-.729z" />
                                    <path d="M12.75 14.226l-3.09 1.636a15.82 15.82 0 006.319-1.956 16.038 16.038 0 00-3.23.32zM8.161 16.095l-3.09-1.636a16.035 16.035 0 003.09 1.636zM11.75 16.894l-3.59 1.901a18.3 18.3 0 013.59-1.901zM15.84 18.795l-3.59-1.901a18.303 18.303 0 013.59 1.901z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight mb-2">
                            Welcome Back
                        </h2>

                        <div className="h-6 transition-all duration-300">
                            {detectedRole ? (
                                <p className="text-white/80 text-sm animate-in slide-in-from-bottom-2 fade-in">
                                    Logging in to <span className="font-semibold text-white capitalize">{detectedRole} Dashboard</span>
                                </p>
                            ) : (
                                <p className="text-white/50 text-sm">Please sign in to continue</p>
                            )}
                        </div>

                        {/* Role Badge Component */}
                        <div className="h-10 transition-all duration-300">
                            {detectedRole && <RoleBadge role={detectedRole} />}
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Username Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-white/40 group-focus-within:text-white/80 transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all shadow-inner backdrop-blur-sm"
                                placeholder="Username"
                                required
                                autoFocus
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-300/90 pl-1">{errors.username}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all shadow-inner backdrop-blur-sm"
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-300/90 pl-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border border-white/30 flex items-center justify-center transition-all ${data.remember ? 'bg-white/90 border-transparent' : 'bg-transparent'}`}>
                                        {data.remember && (
                                            <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-white/60 group-hover:text-white/80 transition-colors">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-white/60 hover:text-white hover:underline transition-all"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-2 bg-gradient-to-r ${getThemeColors()} ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {processing ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRightIcon className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </GlassCard>

                {/* Footer */}
                <p className="mt-8 text-center text-white/30 text-xs">
                    Protected by secure unified login system v2.1
                </p>
            </div>
        </div>
    );
}
