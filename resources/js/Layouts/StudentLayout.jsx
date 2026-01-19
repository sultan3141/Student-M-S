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
    MagnifyingGlassIcon,
    ClipboardDocumentCheckIcon,
    KeyIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    DocumentChartBarIcon,
    TrophyIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('student.dashboard'),
            icon: HomeIcon,
            current: route().current('student.dashboard'),
            description: 'Fee, Reg. & Promotion Status'
        },
        {
            name: 'Semester Academic Record',
            href: route('student.academic.semesters'),
            icon: DocumentChartBarIcon,
            current: route().current('student.academic.semesters') || route().current('student.academic.semester.*')
        },
        {
            name: 'Academic Year Record',
            href: route('student.academic.year.current'),
            icon: TrophyIcon,
            current: route().current('student.academic.year.*')
        },
    ];

    const userNavigation = [
        { name: 'Profile Settings', href: route('student.profile.edit'), icon: UserCircleIcon, current: route().current('student.profile.edit') },
        { name: 'Change Password', href: route('student.password.edit'), icon: KeyIcon, current: route().current('student.password.edit') },
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
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#064E3B] text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-emerald-800/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                            <AcademicCapIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="block text-lg font-bold tracking-wide text-emerald-50 leading-tight">StudentPanel</span>
                            <span className="block text-xs text-emerald-300 uppercase tracking-widest">IPSMS Portal</span>
                        </div>
                    </div>
                    <button className="md:hidden ml-auto text-emerald-200" onClick={() => setSidebarOpen(false)}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Top Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {/* Main Links */}
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
                                <div className="flex flex-col">
                                    <span>{item.name}</span>
                                    {item.description && <span className="text-[10px] text-emerald-300/80 font-normal">{item.description}</span>}
                                </div>
                            </Link>
                        ))}



                        <div className="pt-4 mt-4 border-t border-emerald-800/50">
                            <p className="px-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Account Settings</p>
                            {userNavigation.map((item) => (
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
                                className="w-full group flex items-center px-4 py-3 text-sm font-medium text-emerald-200 rounded-xl hover:bg-red-900/30 hover:text-red-200 transition-all duration-200 mt-1"
                            >
                                <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-emerald-300 group-hover:text-red-300" />
                                Log Out
                            </Link>
                        </div>
                    </nav>

                    {/* User Profile Summary (Bottom) */}
                    <div className="p-4 bg-emerald-900/30 m-4 rounded-xl border border-emerald-800/50">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-10 w-10 rounded-full border-2 border-emerald-500"
                                    src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=10B981&color=fff`}
                                    alt=""
                                />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white group-hover:text-gray-900 line-clamp-1">
                                    {auth.user.name}
                                </p>
                                <p className="text-xs font-medium text-emerald-300 group-hover:text-gray-700">
                                    Student
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
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                                placeholder="Search records..."
                            />
                        </div>

                        <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors">
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
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500 shadow-sm"
                                src={auth.user.profile_photo_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=10B981&color=fff`}
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
