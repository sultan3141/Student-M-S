import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    AcademicCapIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function TeacherLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/teacher/dashboard', icon: HomeIcon },
        { name: 'Declare Result', href: '/teacher/declare-result', icon: ClipboardDocumentCheckIcon },
        { name: 'Student Results', href: '/teacher/students/manage-results', icon: ChartBarIcon },
        { name: 'Assessments', href: '/teacher/assessments-simple', icon: ClipboardDocumentCheckIcon },
        { name: 'Attendance', href: '/teacher/attendance', icon: CalendarDaysIcon },
        { name: 'Profile', href: '/teacher/profile/edit', icon: Cog6ToothIcon },
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

            {/* Compact Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-60 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } teacher-sidebar`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-white">Teacher</h1>
                            <p className="text-sm text-blue-200">Instructor</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white hover:text-blue-200"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-white bg-opacity-20 text-white shadow-sm'
                                        : 'text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                                }`}
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-white border-opacity-20">
                    <div className="flex items-center space-x-3 mb-2 px-1">
                        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            {auth?.user?.name?.charAt(0) || 'T'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {auth?.user?.name || 'Teacher'}
                            </p>
                            <p className="text-xs text-gray-300">Instructor</p>
                        </div>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all w-full text-left"
                    >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-60 flex flex-col min-h-screen">

                {/* Ultra Compact Top Bar (Mobile) */}
                <div className="sticky top-0 z-30 lg:hidden bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-600 hover:text-navy-900"
                    >
                        <Bars3Icon className="h-5 w-5" />
                    </button>
                    <h1 className="text-xs font-semibold text-navy-900">Teacher Panel</h1>
                    <Link href="/logout" method="post" as="button" className="text-red-600">
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    </Link>
                </div>

                {/* Ultra Compact Page Content */}
                <main className="p-3 lg:p-5 flex-1 bg-gray-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
