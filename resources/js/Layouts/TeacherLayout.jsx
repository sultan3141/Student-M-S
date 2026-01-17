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

/**
 * TeacherLayout Component
 * Updated with "School Dashboard" Dark/Light Theme.
 * - Sidebar: Dark Slate (#1E293B)
 * - Background: Light Gray (#F3F4F6)
 * - Active Items: White background, Dark text
 */
export default function TeacherLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('teacher.dashboard'), icon: HomeIcon, current: route().current('teacher.dashboard') },
        { name: 'Marks Management', href: route('teacher.marks.index'), icon: ClipboardDocumentCheckIcon, current: route().current('teacher.marks.*') },
        { name: 'My Classes', href: '#', icon: UserGroupIcon, current: false },
        { name: 'Reports', href: route('teacher.reports.index'), icon: ChartBarIcon, current: route().current('teacher.reports.*') },
        { name: 'Profile', href: route('teacher.profile.edit'), icon: UserCircleIcon, current: route().current('teacher.profile.*') },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] border-r border-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <AcademicCapIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wide">EduPanel</span>
                        </div>
                        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Main Menu</p>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current
                                        ? 'bg-white text-gray-900 shadow-md'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon
                                    className={classNames(
                                        item.current ? 'text-blue-600' : 'text-gray-500 group-hover:text-white',
                                        'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                                    )}
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom User Section */}
                    <div className="p-4 border-t border-gray-800 bg-[#1F2937]"> {/* Slightly lighter dark for contrast */}
                        <div className="flex items-center space-x-3 mb-4 px-2">
                            <img
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=374151&color=fff&bold=true`}
                                alt={auth.user.name}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{auth.user.name}</p>
                                <p className="text-xs text-gray-400">Teacher Account</p>
                            </div>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center justify-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-gray-700 hover:border-red-500/30"
                        >
                            <Cog6ToothIcon className="mr-2 h-4 w-4" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:pl-72 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700 mr-4">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">Dashboard</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search Bar Placeholder */}
                        <div className="hidden md:block relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                placeholder="Search for students..."
                            />
                        </div>

                        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">{auth.user.name}</span>
                            <img
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`}
                                alt={auth.user.name}
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
