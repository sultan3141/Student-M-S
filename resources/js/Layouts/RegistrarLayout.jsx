/**
 * Registrar Layout Component
 * Layout for Registrar staff focusing on admissions and student management.
 */
import { useState, Fragment } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import {
    Squares2X2Icon,
    AcademicCapIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    BanknotesIcon,
    UserGroupIcon,
    ChartBarIcon,
    Bars3Icon,
    BellIcon,
    UserIcon,
    KeyIcon,
    ArrowRightOnRectangleIcon,
    ArrowUturnLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import Footer from '@/Components/Footer';

export default function RegistrarLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/registrar/dashboard', icon: Squares2X2Icon },
        { name: 'Student Admission', href: '/registrar/students/create', icon: AcademicCapIcon },
        { name: 'Admitted Students', href: '/registrar/admission', icon: UsersIcon },
        { name: 'Student Management', href: '/registrar/students', icon: ClipboardDocumentListIcon },
        { name: 'Payments', href: '/registrar/payments', icon: BanknotesIcon },
        { name: 'Guardians', href: '/registrar/guardians', icon: UserGroupIcon },
        { name: 'Student Promotion', href: '/registrar/promotion', icon: AcademicCapIcon },
        { name: 'Reports', href: '/registrar/reports', icon: ChartBarIcon },
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

            {/* Larger Sidebar - Same Navy Gradient as Director/Student */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } director-sidebar`}
            >
                {/* Sidebar Top Branding */}
                <div className="p-3 bg-[#1D4ED8] border-b border-white/10 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white p-1 shadow-2xl group flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-100">
                                <img
                                    src="/images/logo.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://ui-avatars.com/api/?name=Darul+Ulum&background=1D4ED8&color=fff";
                                    }}
                                />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-sm font-black text-white tracking-wider uppercase leading-tight truncate">
                                Darul-Ulum
                            </h1>
                            <p className="text-[8px] font-bold text-blue-100 tracking-[0.2em] uppercase mt-0.5 opacity-80 truncate">
                                Islamic School (Registrar)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Managed Section (Styled Header) */}
                <div className="p-4">
                    <div className="bg-[#1D4ED8] rounded-xl p-3 shadow-lg border border-white/20 flex items-center justify-between group cursor-pointer hover:bg-[#1E40AF] transition-all">
                        <div className="flex items-center space-x-3">
                            <div className="p-1 px-2 border-r border-white/20">
                                <AcademicCapIcon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-white font-black uppercase tracking-wider text-sm">Registrar Panel</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white/90 border-b-[6px] border-b-transparent ml-2 group-hover:translate-x-0.5 transition-transform"></div>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                                    ? 'bg-[#1D4ED8]/10 text-[#1D4ED8] shadow-sm'
                                    : 'text-[#1E3A8A] hover:bg-[#1D4ED8]/5 hover:text-[#111827]'
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
                {/* Premium Top Bar (Navy Colors) */}
                <header className="sticky top-0 z-30 bg-[#1D4ED8] px-4 h-16 flex items-center shadow-xl border-b border-white/10">
                    <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
                    <div className="flex-1 flex items-center space-x-4 relative z-10">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors lg:hidden"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-4 sm:space-x-8 ml-2 sm:ml-4 h-full">
                            <Link
                                href="/registrar/dashboard"
                                className={`h-full flex items-center text-sm font-black transition-all tracking-wider uppercase border-b-[3px] px-1 ${currentPath === '/registrar/dashboard'
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

                    {/* Right Side Utilities */}
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

                        {/* User Profile Dropdown */}
                        <Menu as="div" className="relative ml-2 sm:ml-4 border-l border-white/10 pl-4 flex items-center">
                            <Menu.Button className="flex items-center focus:outline-none group py-1">
                                <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-2xl flex-shrink-0 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 ring-4 ring-white/10">
                                    <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center overflow-hidden border border-white/20">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Registrar'}&background=0F172A&color=fff`}
                                            alt={auth?.user?.name || 'Registrar'}
                                        />
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
                                <Menu.Items className="absolute right-0 top-full mt-0 w-52 origin-top-right divide-y divide-gray-100 rounded-b-[1.5rem] bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50 transform">
                                    {/* Dropdown Header */}
                                    <div className="bg-[#1D4ED8] p-3 flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-xl mb-2 ring-4 ring-white/10">
                                            <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center overflow-hidden border border-white/20 shadow-inner">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={auth?.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Registrar'}&background=0F172A&color=fff`}
                                                    alt={auth?.user?.name || 'Registrar'}
                                                />
                                            </div>
                                        </div>
                                        <h3 className="text-white font-black text-xs tracking-tighter uppercase leading-none mb-1">Welcome!</h3>
                                        <p className="text-blue-200 text-[8px] font-bold truncate w-full text-center opacity-80 px-2 line-height-none">
                                            {auth?.user?.name || 'Registrar User'}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-2 bg-white space-y-1.5">
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href={route('profile.edit')}
                                                        className={`${active ? 'bg-[#1E40AF] scale-[1.02]' : 'bg-[#1D4ED8]'} flex items-center justify-center space-x-1 p-1.5 rounded-lg text-white transition-all shadow-md group h-full`}
                                                    >
                                                        <UserIcon className="h-3 w-3" />
                                                        <span className="text-[7.5px] font-black uppercase tracking-wider">Profile</span>
                                                    </Link>
                                                )}
                                            </Menu.Item>

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`${active ? 'bg-amber-600 scale-[1.02]' : 'bg-amber-500'} flex items-center justify-center space-x-1 p-1.5 rounded-lg text-white transition-all shadow-md group h-full w-full`}
                                                    >
                                                        <KeyIcon className="h-3 w-3" />
                                                        <span className="text-[7.5px] font-black uppercase tracking-wider">Secure</span>
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>

                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className={`${active ? 'bg-red-700 scale-[1.02]' : 'bg-red-600'} flex items-center justify-center space-x-1.5 p-1.5 rounded-lg text-white transition-all shadow-md w-full group`}
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                                    <span className="text-[9px] font-black uppercase tracking-wider">Exit</span>
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                {/* Page Content Header / Breadcrumbs */}
                <div className="bg-gray-50/50 px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-end">
                    <nav className="flex items-center space-x-2 text-sm font-medium">
                        <Link
                            href="/registrar/dashboard"
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
            </div >
        </div >
    );
}
