import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    AcademicCapIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    MagnifyingGlassIcon,
    CalendarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function DirectorLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/director/dashboard', icon: HomeIcon },
        { name: 'Students', href: '/director/students', icon: UserCircleIcon },
        { name: 'Teachers', href: '/director/teachers', icon: UsersIcon },
        { name: 'Academic', href: '/director/academic/overview', icon: AcademicCapIcon },
        { name: 'Profile', href: '/director/profile', icon: UserCircleIcon },
        { name: 'Registration', href: '/director/registration/status', icon: ChartBarIcon },
        { name: 'Documents', href: '/director/documents', icon: DocumentTextIcon },
        { name: 'Communication', href: '/director/announcements', icon: ChatBubbleLeftRightIcon },
        { name: 'Audit Log', href: '/director/audit', icon: Cog6ToothIcon },
    ];

    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } director-sidebar`}
            >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-white">School Director</h1>
                            <p className="text-xs text-gold-400">Command Center</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white hover:text-gold-400"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white border-opacity-20">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold">
                            {auth?.user?.name?.charAt(0) || 'D'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {auth?.user?.name || 'Director'}
                            </p>
                            <p className="text-xs text-gray-300">Administrator</p>
                        </div>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="sidebar-nav-item w-full text-left"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">

                {/* Top Bar (Mobile) */}
                <div className="sticky top-0 z-30 lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-600 hover:text-navy-900"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-semibold text-navy-900">Director Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <Link href="/logout" method="post" as="button" className="text-red-600">
                            <ArrowRightOnRectangleIcon className="h-6 w-6" />
                        </Link>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-6 lg:p-8 flex-1 bg-gray-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
