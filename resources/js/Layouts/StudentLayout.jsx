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
    UserIcon,
    HomeIcon,
    ArrowUturnLeftIcon,
    ChevronRightIcon
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
                            <p className="text-[8px] font-bold text-blue-300 tracking-[0.2em] uppercase mt-0.5 opacity-80 truncate">
                                Islamic School (Student)
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
                                onClick={() => setSidebarOpen(false)}
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

                {/* Sidebar Footer with Profile Actions - RESTORED */}
                <div className="p-4 border-t border-white border-opacity-10 bg-black/20 mt-auto">
                    <div className="mb-4 flex items-center space-x-3">
                        <img
                            className="w-10 h-10 rounded-lg ring-2 ring-white ring-opacity-20 shadow-xl object-cover"
                            src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Student'}&background=1E3A8A&color=fff`}
                            alt={auth?.user?.name || 'Student'}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-bold truncate">
                                {auth?.user?.name || 'Student Name'}
                            </p>
                            <p className="text-blue-300 text-[10px] uppercase font-black tracking-widest opacity-80 mt-0.5">
                                Student
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Link
                            href={route('student.profile.edit')}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-200 hover:bg-white/10 hover:text-white transition-all w-full text-left"
                        >
                            <UserIcon className="h-4 w-4" />
                            <span>Profile</span>
                        </Link>

                        <Link
                            href={route('student.password.edit')}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-200 hover:bg-white/10 hover:text-white transition-all w-full text-left"
                        >
                            <KeyIcon className="h-4 w-4" />
                            <span>Secure</span>
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-white/10 hover:text-red-300 transition-all w-full text-left"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                            <span>Exit</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Premium Top Bar - More Bright & Visible Strategy */}
                <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1D4ED8] px-4 h-16 flex items-center shadow-xl border-b border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
                    <div className="flex-1 flex items-center space-x-4 relative z-10">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors lg:hidden"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        {/* Navigation Links (Enhanced Visibility) */}
                        <div className="flex items-center space-x-4 sm:space-x-8 ml-2 sm:ml-4 h-full">
                            <Link
                                href={route('student.dashboard')}
                                className={`h-full flex items-center text-sm font-black transition-all tracking-wider uppercase border-b-[3px] px-1 ${route().current('student.dashboard')
                                    ? 'text-white border-blue-400 opacity-100 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]'
                                    : 'text-white/60 border-transparent hover:text-white hover:border-white/20'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="#"
                                className="h-full flex items-center text-white/60 text-sm font-black hover:text-white transition-all tracking-wider uppercase border-b-[3px] border-transparent hover:border-white/20 px-1"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Right Side Utilities (Enhanced Interactive Feel) */}
                    <div className="flex items-center space-x-1 sm:space-x-4 relative z-10">
                        {/* Notifications */}
                        <button className="p-2 text-white/80 hover:text-white transition-all relative group rounded-xl hover:bg-white/10 hover:scale-110 active:scale-95">
                            <BellIcon className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#1E293B] shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse"></span>
                        </button>

                        {/* Apps Grid */}
                        <button className="p-2 text-white/80 hover:text-white transition-all rounded-xl hover:bg-white/10 hover:scale-110 active:scale-95">
                            <Squares2X2Icon className="h-5 w-5" />
                        </button>

                        {/* User Profile Dropdown (Modern Design) */}
                        <Menu as="div" className="relative ml-2 sm:ml-4 border-l border-white/10 pl-4 h-8 flex items-center">
                            <Menu.Button className="flex items-center focus:outline-none h-full group">
                                <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-xl flex-shrink-0 flex items-center justify-center transform hover:rotate-12 transition-all duration-300 cursor-pointer">
                                    <img
                                        className="w-full h-full rounded-full object-cover ring-2 ring-white ring-offset-2 ring-offset-[#1E293B]"
                                        src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Student'}&background=1E3A8A&color=fff`}
                                        alt={auth?.user?.name || 'Student'}
                                    />
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
                                        <div className="w-16 h-16 rounded-full bg-white p-1 shadow-lg mb-3 ring-4 ring-white/10">
                                            <img
                                                className="w-full h-full rounded-full object-cover"
                                                src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Student'}&background=1E3A8A&color=fff`}
                                                alt={auth?.user?.name || 'Student'}
                                            />
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

                {/* Page Content Header / Breadcrumbs - Restored per request */}
                <div className="bg-gray-50/50 px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-end">
                    <nav className="flex items-center space-x-2 text-sm font-medium">
                        <Link
                            href={route('student.dashboard')}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                            Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <button
                            onClick={() => window.history.back()}
                            className="ml-2 p-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                            title="Go Back"
                        >
                            <ArrowUturnLeftIcon className="h-5 w-5" />
                        </button>
                    </nav>
                </div>

                {/* Page Content */}
                <main className="p-3 lg:p-5 flex-1 bg-gray-50/50">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
}
