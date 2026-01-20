import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    AcademicCapIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    MagnifyingGlassIcon,
    ClipboardDocumentCheckIcon,
    KeyIcon,
    DocumentChartBarIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard Overview',
            href: route('student.dashboard'),
            icon: HomeIcon,
            current: route().current('student.dashboard'),
            description: 'Fee, Reg. & Promotion Status'
        },
    ];

    const bottomNavigation = [ // Consistent with Teacher Layout structure for alignment
        { name: 'Change Password', href: route('student.password.edit'), icon: KeyIcon, current: route().current('student.password.edit') },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Sidebar - Dark Blue Theme (Matching Registration) */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-900 to-indigo-950 text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-blue-800/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
                            <AcademicCapIcon className="w-5 h-5 text-white" />

                        </div>
                        <div>
                            <span className="block text-lg font-bold tracking-wide text-white leading-tight">StudentPanel</span>
                        </div>
                    </div>
                    <button className="md:hidden ml-auto text-gray-400" onClick={() => setSidebarOpen(false)}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto justify-between">
                    {/* Top Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-blue-100 hover:bg-white/10 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className={classNames(item.current ? 'text-white' : 'text-blue-300 group-hover:text-white', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                <div className="flex flex-col">
                                    <span>{item.name}</span>
                                    {item.description && <span className={classNames(item.current ? 'text-blue-200' : 'text-blue-300/70', "text-[10px] font-normal")}>{item.description}</span>}
                                </div>
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Settings Section */}
                    <div className="px-4 py-6 space-y-1 border-t border-blue-800/50">
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-blue-300 group-hover:text-white" />
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full group flex items-center px-4 py-3 text-sm font-medium text-blue-200 rounded-xl hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 mt-2"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-blue-300 group-hover:text-red-300" />
                            Log Out
                        </Link>

                        {/* User Profile Summary (Mini) */}
                        <div className="mt-6 flex items-center px-2 py-3 bg-blue-950/50 rounded-xl border border-blue-800/50">
                            <img
                                className="h-8 w-8 rounded-full border border-blue-400"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=3B82F6&color=fff`}
                                alt=""
                            />
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">
                                    {auth.user.name}
                                </p>
                                <p className="text-xs text-blue-300 truncate">
                                    Student Account
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700 mr-4">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">Student Portal</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                placeholder="Search records..."
                            />
                        </div>

                        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        <Link
                            href={route('student.profile.edit')}
                            className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">{auth.user.name}</span>
                            <img
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 shadow-sm"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=3B82F6&color=fff`}
                                alt={auth.user.name}
                            />
                        </Link>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
