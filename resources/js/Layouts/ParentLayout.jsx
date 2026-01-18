import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    AcademicCapIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    ChatBubbleLeftRightIcon,
    CreditCardIcon,
    ClockIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function ParentLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Family Overview', href: route('parent.dashboard'), icon: HomeIcon, current: route().current('parent.dashboard') },
        { name: 'My Children', href: '#', icon: UsersIcon, current: false },
        { name: 'Academic Progress', href: '#', icon: ChartBarIcon, current: false },
        { name: 'Attendance', href: '#', icon: ClockIcon, current: false },
        { name: 'Fee Payments', href: '#', icon: CreditCardIcon, current: false },
        { name: 'Messages', href: '#', icon: ChatBubbleLeftRightIcon, current: false },
    ];

    const bottomNavigation = [
        { name: 'My Profile', href: '#', icon: UserCircleIcon, current: false },
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

            {/* Main Sidebar - Dark Purple Theme */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#4C1D95] text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-purple-800/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/50">
                            <UsersIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-wide text-purple-50">ParentPortal</span>
                    </div>
                    <button className="md:hidden ml-auto text-purple-200" onClick={() => setSidebarOpen(false)}>
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
                                    item.current ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-purple-100 hover:bg-purple-700/50 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className={classNames(item.current ? 'text-white' : 'text-purple-300 group-hover:text-white', 'mr-3 flex-shrink-0 h-5 w-5')} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Navigation */}
                    <div className="px-4 py-6 space-y-1 border-t border-purple-800/50">
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-purple-600 text-white' : 'text-purple-100 hover:bg-purple-700/50 hover:text-white',
                                    'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200'
                                )}
                            >
                                <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-purple-300 group-hover:text-white" />
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full group flex items-center px-4 py-3 text-sm font-medium text-purple-200 rounded-xl hover:bg-purple-700/50 hover:text-white transition-all duration-200"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-purple-300 group-hover:text-white" />
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
                        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">Family Dashboard</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">{auth.user.name}</span>
                            <img
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500 shadow-sm"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=8B5CF6&color=fff`}
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
