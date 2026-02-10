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
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import Footer from '@/Components/Footer';

export default function RegistrarLayout({ user, children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/registrar/dashboard', icon: Squares2X2Icon },
        { name: 'Student Admission', href: '/registrar/students/create', icon: AcademicCapIcon },
        { name: 'Admitted Students', href: '/registrar/admission', icon: UsersIcon },
        { name: 'Student Management', href: '/registrar/students', icon: ClipboardDocumentListIcon },
        { name: 'Payments', href: '/registrar/payments', icon: BanknotesIcon },
        { name: 'Guardians', href: '/registrar/guardians', icon: UserGroupIcon },
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

            {/* Premium Sidebar Strategy - Synced with Student Portal */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } registrar-sidebar`}
            >
                {/* Sidebar Header */}
                <div className="p-3 border-b border-white border-opacity-20 bg-black/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white p-1 shadow-2xl group flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0F172A] to-[#1E3A8A] flex items-center justify-center text-white overflow-hidden border border-white/20">
                                <img
                                    src="/images/logo.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://ui-avatars.com/api/?name=Darul+Ulum&background=0F172A&color=fff";
                                    }}
                                />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-sm font-black text-white tracking-wider uppercase leading-tight truncate">
                                Darul-Ulum
                            </h1>
                            <p className="text-[8px] font-bold text-blue-200 tracking-[0.2em] uppercase mt-0.5 opacity-80 truncate">
                                Islamic School (Registrar)
                            </p>
                        </div>
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
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all w-full text-left"
                    >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside >

            {/* Main Content Area - LG Padding Sync */}
            < div className="lg:pl-64 flex flex-col min-h-screen" >

                {/* Premium Mobile Top Bar - Synced with Student Design */}
                < div className="sticky top-0 z-30 lg:hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] px-4 h-16 flex items-center shadow-lg border-b border-white/10" >
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
                            Registrar Portal
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
                </div >

                {/* Page Content */}
                < main className="p-3 lg:p-5 flex-1 bg-gray-50/50" >
                    {children}
                </main >

                <Footer />
            </div >
        </div >
    );
}
