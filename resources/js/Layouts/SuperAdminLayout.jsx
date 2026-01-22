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
    XMarkIcon,
    BellIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

export default function SuperAdminLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('super_admin.dashboard'),
            icon: HomeIcon,
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
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Sidebar - Indigo/Purple Theme */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-900 to-indigo-950 text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-indigo-800/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-indigo-700 font-bold text-sm">SP</span>
                        </div>
                        <div>
                            <span className="text-base font-bold text-white block">School Portal</span>
                            <span className="text-xs text-indigo-300">Admin User</span>
                        </div>
                    </div>
                    <button className="md:hidden ml-auto text-gray-400" onClick={() => setSidebarOpen(false)}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
                    {/* Top Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
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

                    {/* Bottom Navigation */}
                    <div className="px-3 py-4 space-y-1 border-t border-indigo-800/50">
                        <Link
                            href="#"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium text-indigo-200 rounded-lg hover:bg-indigo-800/50 hover:text-white transition-all duration-200"
                        >
                            <LockClosedIcon className="mr-3 flex-shrink-0 h-5 w-5 text-indigo-400 group-hover:text-white" />
                            Change Password
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full group flex items-center px-3 py-2.5 text-sm font-medium text-red-300 rounded-lg hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-red-400 group-hover:text-red-300" />
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700 mr-4">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        <div className="flex items-center">
                            <div className="text-right mr-3 hidden sm:block">
                                <span className="block text-sm font-bold text-gray-900">{auth.user.name}</span>
                                <span className="block text-xs text-indigo-600 font-medium">Super Admin</span>
                            </div>
                            <img
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=4F46E5&color=fff`}
                                alt={auth.user.name}
                            />
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                    <div className="mb-6">
                        <p className="text-sm text-gray-500">Welcome, {auth.user.name}</p>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
