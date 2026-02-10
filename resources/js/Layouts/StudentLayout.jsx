/**
 * Student Layout Component
 * Provides the sidebar navigation and mobile top bar for the Student Portal.
 */
import { useState, Fragment } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    KeyIcon,
    DocumentChartBarIcon,
    TrophyIcon,
    CalendarDaysIcon,
    Squares2X2Icon,
    BellIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import Footer from '@/Components/Footer';

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('student.dashboard'),
            icon: Squares2X2Icon,
            current: route().current('student.dashboard'),
        },
        {
            name: 'Attendance',
            href: route('student.attendance'),
            icon: CalendarDaysIcon,
            current: route().current('student.attendance'),
        },
        {
            name: 'Semester Records',
            href: route('student.academic.semesters'),
            icon: DocumentChartBarIcon,
            current: route().current('student.academic.semesters') || route().current('student.academic.semester.show'),
        },
        {
            name: 'Academic Year',
            href: route('student.academic.year.current'),
            icon: TrophyIcon,
            current: route().current('student.academic.year.current') || route().current('student.academic.year.show'),
        },
        {
            name: 'Profile',
            href: route('student.profile.edit'),
            icon: UserCircleIcon,
            current: route().current('student.profile.edit'),
        },
        {
            name: 'My Schedule',
            href: route('student.schedule'),
            icon: CalendarDaysIcon,
            current: route().current('student.schedule'),
            description: 'Weekly Timetable'
        },
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

            {/* Larger Sidebar - Same Navy Gradient as Director */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } director-sidebar`}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-white">Student</h1>
                            <p className="text-sm text-blue-200">Portal</p>
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
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-white bg-opacity-20 text-white shadow-sm'
                                    : 'text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Premium Top Bar - Responsive for both Mobile and Desktop */}
                <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] px-4 h-16 flex items-center shadow-lg border-b border-white/10">
                    <div className="flex-1 flex items-center space-x-4">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors lg:hidden"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        {/* Desktop Navigation Links (matching user request) */}
                        <div className="hidden lg:flex items-center space-x-8 ml-4 h-full">
                            <Link
                                href={route('student.dashboard')}
                                className={`h-full flex items-center text-sm font-bold transition-all tracking-wide uppercase border-b-2 px-1 ${route().current('student.dashboard')
                                    ? 'text-white border-blue-400 opacity-100'
                                    : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="#"
                                className="h-full flex items-center text-white/70 text-sm font-bold hover:text-white transition-all tracking-wide uppercase border-b-2 border-transparent hover:border-white/30 px-1"
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Mobile Title */}
                        <div className="lg:hidden flex-shrink-0 ml-2">
                            <h1 className="text-xs font-black text-white tracking-[0.2em] uppercase opacity-80">
                                Student Portal
                            </h1>
                        </div>
                    </div>

                    {/* Right Side Utilities (Bell, Grid, Profile) */}
                    <div className="flex items-center space-x-1 sm:space-x-3">
                        {/* Notifications */}
                        <button className="p-2 text-white/70 hover:text-white transition-all relative group rounded-full hover:bg-white/10">
                            <BellIcon className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#1E293B] shadow-sm animate-pulse"></span>
                        </button>

                        {/* Apps Grid */}
                        <button className="p-2 text-white/70 hover:text-white transition-all rounded-full hover:bg-white/10">
                            <Squares2X2Icon className="h-5 w-5" />
                        </button>

                        {/* User Profile Dropdown (Modern Design) */}
                        <Menu as="div" className="relative ml-2 sm:ml-4 border-l border-white/10 pl-4 h-8 flex items-center">
                            <Menu.Button className="flex items-center focus:outline-none h-full">
                                <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-xl flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer">
                                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0F172A] to-[#1E3A8A] flex items-center justify-center text-white font-bold text-xs ring-2 ring-white ring-offset-2 ring-offset-[#1E293B]">
                                        {auth?.user?.name?.charAt(0) || 'S'}
                                    </div>
                                </div>
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 top-full mt-4 w-64 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                                    {/* Dropdown Header */}
                                    <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] p-6 flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-white p-1 shadow-lg mb-3">
                                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0F172A] to-[#1E3A8A] flex items-center justify-center text-white font-bold text-2xl">
                                                {auth?.user?.name?.charAt(0) || 'S'}
                                            </div>
                                        </div>
                                        <h3 className="text-white font-bold text-lg">Welcome!</h3>
                                        <p className="text-blue-200 text-xs truncate w-full text-center mt-1">
                                            {auth?.user?.name || 'Student Name'}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-4 grid grid-cols-3 gap-2 bg-gray-50">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('student.profile.edit')}
                                                    className={`${active ? 'bg-blue-600 scale-95 shadow-inner' : 'bg-blue-500 shadow-md'} flex flex-col items-center justify-center p-2 rounded-lg text-white transition-all`}
                                                    title="Profile"
                                                >
                                                    <UserIcon className="h-5 w-5 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase">Profile</span>
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('student.password.edit')}
                                                    className={`${active ? 'bg-amber-600 scale-95 shadow-inner' : 'bg-amber-500 shadow-md'} flex flex-col items-center justify-center p-2 rounded-lg text-white transition-all`}
                                                    title="Password"
                                                >
                                                    <KeyIcon className="h-5 w-5 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase">Secure</span>
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className={`${active ? 'bg-red-600 scale-95 shadow-inner' : 'bg-red-500 shadow-md'} flex flex-col items-center justify-center p-2 rounded-lg text-white transition-all`}
                                                    title="Logout"
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase">Exit</span>
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-3 lg:p-5 flex-1 bg-gray-50/50">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
}
