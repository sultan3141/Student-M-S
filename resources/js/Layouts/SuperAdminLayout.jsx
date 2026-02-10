/**
 * Super Admin Layout Component
 * High-level system management layout for Super Admin users.
 */
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    BellIcon,
    LockClosedIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import Footer from '@/Components/Footer';

export default function SuperAdminLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('super_admin.dashboard'),
            icon: Squares2X2Icon,
            current: route().current('super_admin.dashboard')
        },
        {
            name: 'User Management',
            href: route('super_admin.users.index'),
            icon: UsersIcon,
            current: route().current('super_admin.users.*')
        },
        {
            name: 'System Configuration',
            href: route('super_admin.config.index'),
            icon: Cog6ToothIcon,
            current: route().current('super_admin.config.*')
        },
        {
            name: 'Security & Audit',
            href: route('super_admin.security.audit-logs'),
            icon: ShieldCheckIcon,
            current: route().current('super_admin.security.*')
        },
        {
            name: 'Data & Backup',
            href: route('super_admin.data.backups'),
            icon: ChartBarIcon,
            current: route().current('super_admin.data.*')
        },
        {
            name: 'Access Control',
            href: route('super_admin.access.index'),
            icon: LockClosedIcon,
            current: route().current('super_admin.access.*')
        },
    ];


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Premium Sidebar Strategy - Synced with Student Portal */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-indigo-900 to-indigo-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
                            <p className="text-[8px] font-bold text-indigo-200 tracking-[0.2em] uppercase mt-0.5 opacity-80 truncate">
                                Islamic School (Super Admin)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
                    {/* Top Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={classNames(
                                    item.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white',
                                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200'
                                )}
                            >
                                <item.icon className={classNames(item.current ? 'text-white' : 'text-indigo-400 group-hover:text-white', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Profile & Notifications */}
                    <div className="px-5 py-6 border-t border-indigo-800/50 bg-indigo-950/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative group cursor-pointer">
                                <img
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 transition-all group-hover:ring-indigo-400"
                                    src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=4F46E5&color=fff`}
                                    alt={auth?.user?.name || 'Admin'}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-indigo-950 rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate leading-tight">
                                    {auth?.user?.name || 'Super Admin'}
                                </p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Super Admin</p>
                            </div>
                            <button className="relative p-2 text-indigo-300 hover:text-white transition-colors">
                                <BellIcon className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-indigo-950"></span>
                            </button>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href="#"
                                className="group flex items-center px-3 py-2 text-xs font-medium text-indigo-200 rounded-lg hover:bg-indigo-800/50 hover:text-white transition-all duration-200"
                            >
                                <LockClosedIcon className="mr-3 flex-shrink-0 h-4 w-4" />
                                <span>Change Password</span>
                            </Link>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setSidebarOpen(false)}
                                className="w-full group flex items-center px-3 py-2 text-xs font-medium text-red-300/80 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                                <span>Logout</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </aside >

            {/* Main Content Area - LG Padding Sync */}
            < div className="lg:pl-64 flex flex-col min-h-screen" >
                {/* Premium Mobile Top Bar - Synced with Student Design (lg breakpoint) */}
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
                            Super Admin Portal
                        </h1>
                    </div>

                    <div className="flex-1 flex items-center justify-end">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-2 -mr-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div >

                {/* Main Scrollable Content */}
                < main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50" >
                    {children}
                </main >

                <Footer />
            </div >
        </div >
    );
}
