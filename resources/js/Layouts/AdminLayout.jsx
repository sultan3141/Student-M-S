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
    XMarkIcon,
    BellIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Admin Overview', href: route('admin.dashboard'), icon: HomeIcon, current: route().current('admin.dashboard') },
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
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Sidebar - Dark Slate with Amber Accents */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/50">
                            <ShieldCheckIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-wide text-gray-100">AdminPanel</span>
                    </div>
                    <button className="md:hidden ml-auto text-gray-400" onClick={() => setSidebarOpen(false)}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
                    {/* Top Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Core Modules</p>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
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

                    {/* Bottom Navigation */}
                    <div className="px-4 py-6 space-y-1 border-t border-gray-800">
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-white" />
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full group flex items-center px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-white/5 hover:text-red-300 transition-all duration-200"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-red-500/70 group-hover:text-red-400" />
                            Log Out
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
<<<<<<< HEAD
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700 mr-4">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 hidden sm:block">Administration</h2>
                    </div>

                    <div className="flex items-center space-x-4">
=======
                {/* Premium Header - Centered Branding for Mobile */}
                <header className="bg-white/80 backdrop-blur-md h-16 flex items-center shadow-sm border-b border-gray-100 sticky top-0 z-40">
                    {/* Mobile Menu Button - Left */}
                    <div className="flex-1 flex items-center px-4 md:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-500 hover:text-navy-900 transition-colors">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Desktop Content - Left */}
                    <div className="hidden md:flex flex-1 items-center px-8">
                        <h2 className="text-xl font-bold text-navy-900">Administration</h2>
                    </div>

                    {/* Centered Branding - Mobile Only */}
                    <div className="md:hidden flex-shrink-0">
                        <h1 className="text-base font-bold text-navy-900 tracking-tight">
                            Admin Portal
                        </h1>
                    </div>

                    {/* Right Side Content (Search/Notifications/Profile) */}
                    <div className="flex items-center px-4 md:px-8 space-x-4 flex-1 justify-end">
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
                        <div className="hidden md:block relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
<<<<<<< HEAD
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors"
=======
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-100 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors shadow-inner"
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
                                placeholder="Search system..."
                            />
                        </div>

                        <button className="relative p-2 text-gray-400 hover:text-amber-600 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

<<<<<<< HEAD
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        <div className="flex items-center">
                            <div className="text-right mr-3 hidden sm:block">
                                <span className="block text-sm font-bold text-gray-900">{auth.user.name}</span>
                                <span className="block text-xs text-amber-600 font-semibold uppercase">Super Admin</span>
                            </div>
                            <img
                                className="w-9 h-9 rounded-lg object-cover ring-2 ring-amber-500/50 shadow-sm"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=F59E0B&color=fff`}
                                alt={auth.user.name}
=======
                        <div className="h-8 w-px bg-gray-100 mx-2"></div>

                        <div className="flex items-center group cursor-pointer">
                            <div className="text-right mr-3 hidden sm:block">
                                <span className="block text-sm font-bold text-navy-900 group-hover:text-amber-600 transition-colors">{auth?.user?.name || 'Admin'}</span>
                                <span className="block text-[10px] text-amber-600 font-black uppercase tracking-widest">Admin</span>
                            </div>
                            <img
                                className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-500/20 shadow-sm group-hover:ring-amber-500 transition-all"
                                src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=F59E0B&color=fff`}
                                alt={auth?.user?.name || 'Admin'}
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
                            />
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
