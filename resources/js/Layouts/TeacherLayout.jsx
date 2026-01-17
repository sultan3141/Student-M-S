import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    AcademicCapIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function TeacherLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('teacher.dashboard'), icon: HomeIcon, current: route().current('teacher.dashboard'), gradient: 'from-blue-500 to-indigo-600' },
        { name: 'Marks Management', href: route('teacher.marks.index'), icon: ClipboardDocumentCheckIcon, current: route().current('teacher.marks.*'), gradient: 'from-purple-500 to-pink-600' },
        { name: 'My Classes', href: '#', icon: UserGroupIcon, current: false, gradient: 'from-green-500 to-teal-600' },
        { name: 'Reports', href: route('teacher.reports.index'), icon: ChartBarIcon, current: route().current('teacher.reports.*'), gradient: 'from-orange-500 to-red-600' },
        { name: 'Profile', href: route('teacher.profile.edit'), icon: UserCircleIcon, current: route().current('teacher.profile.*'), gradient: 'from-cyan-500 to-blue-600' },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo with gradient */}
                    <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">EduPanel</span>
                        </div>
                        <button className="md:hidden text-white/80 hover:text-white" onClick={() => setSidebarOpen(false)}>
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* User Profile Card */}
                    <div className="mx-4 mt-6 mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img
                                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-lg"
                                    src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=667eea&color=fff&bold=true`}
                                    alt={auth.user.name}
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{auth.user.name}</p>
                                <p className="text-xs text-purple-600 font-medium">Teacher</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current
                                        ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg scale-105'
                                        : 'text-gray-700 hover:bg-gray-100',
                                    'group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon
                                    className={classNames(
                                        item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-600',
                                        'mr-3 flex-shrink-0 h-5 w-5'
                                    )}
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-4 space-y-2 border-t border-gray-200">
                        <Link
                            href="#"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                            Settings
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:pl-72">
                {/* Top Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700">
                            <Bars3Icon className="w-6 h-6" />
                        </button>

                        <div className="flex-1"></div>

                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                                <BellIcon className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

