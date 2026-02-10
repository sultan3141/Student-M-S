/**
 * Admin Layout Component
 * Standard layout for Administrative users.
 */
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    Cog6ToothIcon,
    ChartPieIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    BellIcon,
    MagnifyingGlassIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import Footer from '@/Components/Footer';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Admin Overview', href: route('admin.dashboard'), icon: Squares2X2Icon, current: route().current('admin.dashboard') },
        { name: 'User Management', href: '#', icon: UsersIcon, current: false },
        { name: 'System Settings', href: '#', icon: Cog6ToothIcon, current: false },
        { name: 'Reports & Analytics', href: '#', icon: ChartPieIcon, current: false },
        { name: 'Audit Logs', href: '#', icon: ShieldCheckIcon, current: false },
    ];

    const bottomNavigation = [
        { name: 'System Health', href: '#', icon: DocumentTextIcon, current: false },
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

            {/* Main Sidebar - Fixed strategy to match Student portal */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
                            <p className="text-[8px] font-bold text-amber-200 tracking-[0.2em] uppercase mt-0.5 opacity-80 truncate">
                                Islamic School (Admin)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
                    {/* Top Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Core Modules</p>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={classNames(
                                    item.current ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className={classNames(item.current ? 'text-white' : 'text-gray-500 group-hover:text-white', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Profile & Notifications */}
                    <div className="px-6 py-6 border-t border-gray-800 bg-gray-900/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative group cursor-pointer">
                                <img
                                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500/20 transition-all group-hover:ring-amber-500"
                                    src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=F59E0B&color=fff`}
                                    alt={auth?.user?.name || 'Admin'}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0F172A] rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate leading-tight">
                                    {auth?.user?.name || 'Admin'}
                                </p>
                                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">Admin</p>
                            </div>
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <BellIcon className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 border-[#0F172A]"></span>
                            </button>
                        </div>

                        <div className="space-y-1">
                            {bottomNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={classNames(
                                        item.current ? 'bg-amber-600/20 text-amber-400' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                        'group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200'
                                    )}
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))}

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setSidebarOpen(false)}
                                className="w-full group flex items-center px-3 py-2 text-xs font-medium text-red-400/80 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
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
                            Admin Portal
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
                < main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50" >
                    {children}
                </main >

                <Footer />
            </div >
        </div >
    );
}
