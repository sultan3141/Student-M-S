import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    AcademicCapIcon,
    BanknotesIcon,
    UserGroupIcon,
    ChartBarIcon,
    BuildingLibraryIcon,
    ArrowRightOnRectangleIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

export default function RegistrarLayout({ user, children }) {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: route('registrar.dashboard'), icon: HomeIcon, active: url.startsWith('/registrar/dashboard') },
        { name: 'Enroll Student', href: route('registrar.students.create'), icon: AcademicCapIcon, active: url === '/registrar/students/create' },
        { name: 'Student Management', href: route('registrar.students.index'), icon: UsersIcon, active: url.startsWith('/registrar/students') && !url.includes('/create') },
        { name: 'Payments', href: route('registrar.payments.index'), icon: BanknotesIcon, active: url.startsWith('/registrar/payments') },
        { name: 'Guardians', href: route('registrar.guardians.index'), icon: UserGroupIcon, active: url.startsWith('/registrar/guardians') },
        { name: 'Reports', href: route('registrar.reports.index'), icon: ChartBarIcon, active: url.startsWith('/registrar/reports') },
    ];

    // Mobile responsiveness: Auto-close sidebar on mobile, open on desktop
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F5DC] font-sans text-[#1F2937]">
            {/* Top Navigation Bar */}
            <nav className="bg-[#1E40AF] border-b border-[#D4AF37] shadow-md fixed z-30 w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md text-[#F5F5DC] hover:text-white hover:bg-[#1a6b1a] focus:outline-none focus:bg-[#1a6b1a] transition duration-150 ease-in-out"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path className={!isSidebarOpen ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            <path className={isSidebarOpen ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="ml-4 flex items-center">
                        <BuildingLibraryIcon className="h-8 w-8 text-[#D4AF37] mr-2" />
                        <span className="font-bold text-xl text-white tracking-wide uppercase hidden sm:block">
                            Registrar <span className="text-[#D4AF37]">Command Center</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col items-end text-right">
                        <span className="text-sm text-[#F5F5DC]">Academic Year: 2025-2026</span>
                        <span className="text-xs text-[#D4AF37] font-semibold">● REGISTRATION OPEN</span>
                    </div>

                    <div className="relative">
                        <button className="flex items-center text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-[#D4AF37] transition duration-150 ease-in-out">
                            <div className="h-8 w-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1E40AF] font-bold">
                                {user?.name?.charAt(0) || 'R'}
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-20 w-64 bg-[#1E40AF] shadow-xl transform transition-transform duration-300 ease-in-out mt-16 flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200
                                ${item.active
                                    ? 'bg-[#D4AF37] text-[#1E40AF] shadow-md'
                                    : 'text-white hover:bg-[#3B82F6] hover:text-white'
                                }`}
                        >
                            <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                            {item.name}
                        </Link>
                    ))}

                    <div className="pt-8 mt-6 border-t border-blue-800">
                        <h3 className="px-4 text-xs font-semibold text-blue-300 uppercase tracking-wider">
                            Daily Stats
                        </h3>
                        <div className="mt-4 px-4 space-y-4">
                            <div className="bg-blue-900 rounded p-3 border-l-4 border-[#228B22]">
                                <p className="text-xs text-blue-200">New Students</p>
                                <p className="text-xl font-bold text-white">12</p>
                            </div>
                            <div className="bg-blue-900 rounded p-3 border-l-4 border-[#D4AF37]">
                                <p className="text-xs text-blue-200">Pending Fees</p>
                                <p className="text-xl font-bold text-white">8</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-blue-800 bg-[#1E40AF]">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center px-4 py-3 text-base font-medium text-red-300 rounded-lg hover:bg-red-900/50 hover:text-red-100 transition-colors duration-200"
                    >
                        <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            {/* Overlay on mobile when sidebar is open to capture clicks/close */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden mt-16"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <main
                className={`transition-all duration-300 ease-in-out pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-[#F5F5DC] min-h-screen
                ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}
            >
                {children}
            </main>
        </div>
    );
}
