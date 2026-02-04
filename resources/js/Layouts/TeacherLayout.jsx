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
    BellIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function TeacherLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard Overview', href: route('teacher.dashboard'), icon: HomeIcon, current: route().current('teacher.dashboard') },
        { name: 'Declare Result', href: route('teacher.declare-result.index'), icon: ClipboardDocumentCheckIcon, current: route().current('teacher.declare-result.*') },
        { name: 'Student Results', href: route('teacher.students.manage-results'), icon: ChartBarIcon, current: route().current('teacher.students.manage-results') },
        { name: 'Assessments', href: route('teacher.assessments-simple.index'), icon: ClipboardDocumentCheckIcon, current: route().current('teacher.assessments-simple.*') || route().current('teacher.custom-assessments.*') },
        { name: 'Attendance', href: route('teacher.attendance.index'), icon: CalendarDaysIcon, current: route().current('teacher.attendance.*') },
    ];

    const bottomNavigation = [
        { name: 'Settings', href: route('teacher.profile.edit'), icon: Cog6ToothIcon, current: route().current('teacher.profile.*') },
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

            {/* Main Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        {/* Simple Logo Icon */}
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <AcademicCapIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-wide">EduPanel</span>
                    </div>
                    <button className="md:hidden ml-auto text-gray-400" onClick={() => setSidebarOpen(false)}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
                    {/* Top Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className={classNames(item.current ? 'text-white' : 'text-gray-400 group-hover:text-white', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Navigation (Settings & Logout) */}
                    <div className="px-4 py-6 space-y-1 border-t border-gray-700/50">
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-white" />
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full group flex items-center px-4 py-3 text-sm font-medium text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-white" />
                            Log Out
                        </Link>
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
                        {/* Breadcrumbs or Title could go here */}
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search Bar */}
                        <div className="hidden md:block relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                placeholder="Search..."
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        {/* Profile Dropdown */}
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">{auth.user.name}</span>
                            <img
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`}
                                alt={auth.user.name}
                            />
                        </div>
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
