/**
 * Registrar Layout Component
 * Layout for Registrar staff focusing on admissions and student management.
 */
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    AcademicCapIcon,
    BanknotesIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    UsersIcon,
    XMarkIcon,
    ClipboardDocumentListIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline';
import Footer from '@/Components/Footer';

export default function RegistrarLayout({ user, children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/registrar/dashboard', icon: HomeIcon },
        { name: 'Student Admission', href: '/registrar/students/create', icon: AcademicCapIcon },
        { name: 'Admitted Students', href: '/registrar/admission', icon: UsersIcon },
        { name: 'Student Management', href: '/registrar/students', icon: ClipboardDocumentListIcon },
        { name: 'Payments', href: '/registrar/payments', icon: BanknotesIcon },
        { name: 'Guardians', href: '/registrar/guardians', icon: UserGroupIcon },
        { name: 'Student Promotion', href: '/registrar/promotion', icon: AcademicCapIcon },
        { name: 'Reports', href: '/registrar/reports', icon: ChartBarIcon },
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
                className={`fixed top-0 left-0 z-50 h-screen w-60 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } registrar-sidebar`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-white">Registrar</h1>
                            <p className="text-sm text-blue-200">Enrollment</p>
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
                            {auth?.user?.name?.charAt(0) || user?.name?.charAt(0) || 'R'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {auth?.user?.name || user?.name || 'Registrar'}
                            </p>
                            <p className="text-xs text-gray-300">Registrar</p>
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
                            Registrar Portal
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

                {/* Page Content */}
                <main className="p-3 lg:p-5 flex-1 bg-gray-50/50">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
}
