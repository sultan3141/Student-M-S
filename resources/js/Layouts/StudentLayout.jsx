import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    AcademicCapIcon,
    BookOpenIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'My Dashboard', href: route('student.dashboard'), icon: HomeIcon, current: route().current('student.dashboard') },
        { name: 'My Courses', href: '#', icon: BookOpenIcon, current: false },
        { name: 'Grades & Reports', href: '#', icon: ChartBarIcon, current: false },
        { name: 'Class Schedule', href: '#', icon: CalendarDaysIcon, current: false },
        { name: 'Assignments', href: '#', icon: AcademicCapIcon, current: false },
    ];

    const bottomNavigation = [
        { name: 'My Profile', href: route('student.profile.edit'), icon: UserCircleIcon, current: route().current('student.profile.*') },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Sidebar - Dark Green Theme */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#064E3B] text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-emerald-800/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                            <AcademicCapIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-wide text-emerald-50">StudentPanel</span>
                    </div>
                    <button className="md:hidden ml-auto text-emerald-200" onClick={() => setSidebarOpen(false)}>
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
                                    item.current ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className={classNames(item.current ? 'text-white' : 'text-emerald-300 group-hover:text-white', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Navigation */}
                    <div className="px-4 py-6 space-y-1 border-t border-emerald-800/50">
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-emerald-600 text-white' : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-emerald-300 group-hover:text-white" />
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full group flex items-center px-4 py-3 text-sm font-medium text-emerald-200 rounded-xl hover:bg-emerald-700/50 hover:text-white transition-all duration-200"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-emerald-300 group-hover:text-white" />
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
                        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">Student Portal</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                                placeholder="Search courses..."
                            />
                        </div>

                        <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">{auth.user.name}</span>
                            <img
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500 shadow-sm"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=10B981&color=fff`}
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
