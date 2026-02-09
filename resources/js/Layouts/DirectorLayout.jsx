/**
 * Director Layout Component
 * Executive layout for School Directors and high-level management.
 */
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
    LockClosedIcon,
} from '@heroicons/react/24/outline';
import Footer from '@/Components/Footer';

const navigation = [
    { name: 'Dashboard', href: '/director/dashboard', icon: HomeIcon },
    // Revised "Semester Management" Section
    { name: 'Academic Years', href: '/director/academic-years', icon: CalendarIcon },
    { name: 'Students', href: '/director/students', icon: UserCircleIcon },
    { name: 'Parents', href: '/director/parents', icon: UsersIcon },
    { name: 'Teachers', href: '/director/teachers', icon: UsersIcon },
    { name: 'Teacher Assignments', href: '/director/teacher-assignments', icon: ClipboardDocumentListIcon },
    { name: 'Academic', href: '/director/academic/overview', icon: AcademicCapIcon },
    { name: 'Schedule', href: '/director/schedule', icon: CalendarIcon },
    { name: 'Profile', href: '/director/profile', icon: UserCircleIcon },
    { name: 'Registration', href: '/director/registration/status', icon: ChartBarIcon },
    { name: 'Documents', href: '/director/documents', icon: DocumentTextIcon },
    { name: 'Communication', href: '/director/announcements', icon: ChatBubbleLeftRightIcon },
    { name: 'Audit Log', href: '/director/audit', icon: Cog6ToothIcon },
];

export default function DirectorLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

            {/* Ultra Compact Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-52 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } director-sidebar`}
            >
                {/* Minimal Sidebar Header */}
                <div className="p-3 border-b border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-base font-bold text-white">Director</h1>
                            <p className="text-xs text-gold-400">Executive</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white hover:text-gold-400"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Ultra Compact Navigation Links */}
                <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${isActive
                                    ? 'bg-white bg-opacity-20 text-white shadow-sm'
                                    : 'text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Minimal Sidebar Footer */}
                <div className="p-2 border-t border-white border-opacity-20">
                    <div className="flex items-center space-x-2 mb-1.5 px-1">
                        <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xs">
                            {auth?.user?.name?.charAt(0) || 'D'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                                {auth?.user?.name || 'Director'}
                            </p>
                            <p className="text-xs text-gray-300">Admin</p>
                        </div>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all w-full text-left"
                    >
                        <ArrowRightOnRectangleIcon className="h-3.5 w-3.5" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-52 flex flex-col min-h-screen">

                {/* Premium Mobile Top Bar */}
                <div className="sticky top-0 z-30 lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center shadow-sm">
                    <div className="flex-1 flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-navy-900 transition-colors"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-shrink-0">
                        <h1 className="text-base font-bold text-navy-900 tracking-tight">
                            Director Portal
                        </h1>
                    </div>

                    <div className="flex-1 flex items-center justify-end">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="p-2 -mr-2 text-red-500 hover:text-red-600 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Ultra Compact Page Content */}
                <main className="p-3 lg:p-5 flex-1 bg-gray-50/50">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
}
