import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    KeyIcon,
    ClipboardDocumentCheckIcon,
    CalendarDaysIcon,
    AcademicCapIcon,
    ChartBarIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export default function TeacherLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('teacher.dashboard'),
            icon: HomeIcon,
            current: route().current('teacher.dashboard'),
        },
        {
            name: 'Declare Result',
            href: route('teacher.declare-result.index'),
            icon: ClipboardDocumentCheckIcon,
            current: route().current('teacher.declare-result.*'),
        },
        {
            name: 'Student Results',
            href: route('teacher.students.manage-results'),
            icon: ChartBarIcon,
            current: route().current('teacher.students.manage-results'),
        },
        {
            name: 'Attendance',
            href: route('teacher.attendance.index'),
            icon: CalendarDaysIcon,
            current: route().current('teacher.attendance.*'),
        },
        {
            name: 'My Classes',
            href: route('teacher.classes.index'),
            icon: UsersIcon,
            current: route().current('teacher.classes.*'),
        },
        {
            name: 'Assessments',
            href: route('teacher.assessments.index'),
            icon: ClipboardDocumentListIcon,
            current: route().current('teacher.assessments.*'),
        },
        {
            name: 'Schedule',
            href: route('teacher.schedule'),
            icon: CalendarDaysIcon,
            current: route().current('teacher.schedule'),
        },
        {
            name: 'Profile',
            href: route('teacher.profile.edit'),
            icon: UserCircleIcon,
            current: route().current('teacher.profile.*'),
        },
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

            {/* Compact Sidebar - Same Navy Gradient as Director */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-52 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } director-sidebar`}
            >
                {/* Minimal Sidebar Header */}
                <div className="p-3 border-b border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-base font-bold text-white">Teacher</h1>
                            <p className="text-xs text-blue-200">Portal</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white hover:text-blue-200"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Ultra Compact Navigation Links */}
                <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.current;

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
                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                            {auth?.user?.name?.charAt(0) || 'T'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                                {auth?.user?.name || 'Teacher'}
                            </p>
                            <p className="text-xs text-blue-200">Teacher</p>
                        </div>
                    </div>

                    <Link
                        href={route('teacher.password.edit')}
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all w-full text-left mb-1"
                    >
                        <KeyIcon className="h-3.5 w-3.5" />
                        <span>Change Password</span>
                    </Link>

                    <Link
                        href={route('logout')}
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
                {/* Ultra Compact Top Bar (Mobile) */}
                <div className="sticky top-0 z-30 lg:hidden bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-600 hover:text-navy-900"
                    >
                        <Bars3Icon className="h-5 w-5" />
                    </button>
                    <h1 className="text-xs font-semibold text-navy-900">Teacher Portal</h1>
                    <Link href={route('logout')} method="post" as="button" className="text-red-600">
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    </Link>
                </div>

                {/* Ultra Compact Page Content */}
                <main className="p-3 lg:p-4 flex-1 bg-gray-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
