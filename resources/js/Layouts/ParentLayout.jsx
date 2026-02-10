/**
 * Parent Layout Component
 * Layout for Guardian users to monitor their children's progress.
 */
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    AcademicCapIcon,
    PhoneIcon,
    LockClosedIcon,
    ArrowRightOnRectangleIcon,
    DocumentChartBarIcon,
    TrophyIcon,
    Bars3Icon,
    XMarkIcon,
    CalendarDaysIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import ChangePasswordModal from '@/Components/ChangePasswordModal';
import Footer from '@/Components/Footer';

export default function ParentLayout({ children }) {
    const { auth, students, student: pageStudent, selectedStudentId } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Determine active student ID from multiple sources
    // Page-specific student takes priority, then globally selected, then first child
    const activeStudentId = pageStudent?.id || selectedStudentId || students?.[0]?.id;

    const navigation = [
        {
            name: 'Dashboard',
            href: route('parent.dashboard'),
            icon: HomeIcon,
        },
        {
            name: 'My Children',
            href: route('parent.children'),
            icon: UserGroupIcon,
        },
        {
            name: 'Semester Records',
            href: route('parent.academic.semesters', activeStudentId),
            icon: DocumentChartBarIcon,
        },
        {
            name: 'Academic Year',
            href: route('parent.academic.year.current', activeStudentId),
            icon: TrophyIcon,
        },
        {
            name: 'Attendance',
            href: route('parent.student.attendance', activeStudentId),
            icon: ClipboardDocumentCheckIcon,
        },
        {
            name: 'Class Schedule',
            href: route('parent.student.schedule', activeStudentId),
            icon: CalendarDaysIcon,
            description: 'Weekly Timetable',
            current: route().current('parent.student.schedule')
        },
        {
            name: 'Payments',
            href: route('parent.student.payments', activeStudentId),
            icon: CurrencyDollarIcon,
        },
        {
            name: 'School Contact',
            href: route('parent.school-contact'),
            icon: PhoneIcon,
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

            {/* Premium Sidebar Strategy - Synced with Student Portal */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } parent-sidebar`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-white">Parent</h1>
                            <p className="text-sm text-blue-200">Portal</p>
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
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive
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
                            {auth?.user?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {auth?.user?.name || 'Parent'}
                            </p>
                            <p className="text-xs text-gray-300">Guardian</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all w-full text-left mb-1"
                    >
                        <LockClosedIcon className="h-4 w-4" />
                        <span>Change Password</span>
                    </button>

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

            {/* Main Content Area - LG Padding Sync */}
            <div className="lg:pl-64 flex flex-col min-h-screen">

                {/* Premium Mobile Top Bar - Synced with Student Design */}
                <div className="sticky top-0 z-30 lg:hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] px-4 h-16 flex items-center shadow-lg border-b border-white/10">
                    <div className="flex-1 flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-shrink-0">
                        <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase">
                            Parent Portal
                        </h1>
                    </div>

                    <div className="flex-1 flex items-center justify-end">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="p-2 -mr-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-3 lg:p-5 flex-1 bg-gray-50/50">
                    {children}
                </main>

                <Footer />
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                isFirstLogin={auth?.user?.first_login || false}
            />
        </div>
    );
}
