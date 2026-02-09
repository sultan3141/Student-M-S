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
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 font-sans">
            <Head title="Login - Darul-Ulum School" />

            {/* Main Card Container */}
            <div className="w-full max-w-[400px] px-4">
                <div className="bg-white rounded-[30px] shadow-lg border-2 border-green-500 p-8 relative overflow-hidden">

                    {/* Top Green Accent/Glow (Optional subtle effect) */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
                            {/* Placeholder for University Logo - Using a ring to simulate the circular logo style */}
                            <div className="w-24 h-24 rounded-full border-4 border-green-600/20 flex items-center justify-center bg-white shadow-sm overflow-hidden">
                                {/* Replace this SVG with the actual University Logo Image if available */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-green-700">
                                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 003.239 8.588.75.75 0 013.04 7.252a60.65 60.65 0 0110.9-2.812zM14.246 2.195l.161.815.165.815.161-.815zM2.838 9.387l-.145.719-.138.729.138-.729zM19.162 9.387l.145.719.138.729-.138-.729z" />
                                    <path d="M12.75 14.226l-3.09 1.636a15.82 15.82 0 006.319-1.956 16.038 16.038 0 00-3.23.32zM8.161 16.095l-3.09-1.636a16.035 16.035 0 003.09 1.636zM11.75 16.894l-3.59 1.901a18.3 18.3 0 013.59-1.901zM15.84 18.795l-3.59-1.901a18.303 18.303 0 013.59 1.901z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-center text-blue-500 font-bold text-lg tracking-wide uppercase">
                            Login to Secure Access
                        </h2>

                        {/* Role Detection Feedback */}
                        <div className="h-6 mt-1 text-center">
                            {detectedRole && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                    {detectedRole} Portal
                                </span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition-all text-gray-700 placeholder-gray-400 bg-white"
                                placeholder="Username"
                                required
                                autoFocus
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600 pl-2">{errors.username}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition-all text-gray-700 placeholder-gray-400 bg-white pr-10"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 pl-2">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password (Optional per design, but good UX to keep) */}
                        <div className="flex items-center justify-between text-xs px-1">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-gray-600">Remember me</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-3 rounded-md text-white font-bold text-lg shadow-md transition-all duration-300 bg-green-600 hover:bg-green-700 hover:shadow-lg ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-[13px] whitespace-nowrap">
                    <span className="font-bold text-gray-900">Copyright © 2026</span>{' '}
                    <span className="text-[#3c8dbc] font-bold">Darul-Ulum School</span>
                    <span className="text-gray-900"> . All rights reserved.</span>
                </div>
            </div>
        </div>
    );
}
