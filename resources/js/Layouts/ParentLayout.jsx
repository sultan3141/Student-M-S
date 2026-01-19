import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    UserGroupIcon,
    CurrencyDollarIcon,
    AcademicCapIcon,
    PhoneIcon,
    LockClosedIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import ChangePasswordModal from '@/Components/ChangePasswordModal';

export default function ParentLayout({ children }) {
    const { auth, students } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Default to first student if available
    const [selectedStudent, setSelectedStudent] = useState(students ? students[0] : null);

    const navigation = [
        { name: 'My Children', href: route('parent.dashboard'), icon: UserGroupIcon },
        { name: 'Payment Info', href: route('parent.student.payments', selectedStudent?.id || students?.[0]?.id || 1), icon: CurrencyDollarIcon },
        { name: 'Academic Info', href: route('parent.student.marks', selectedStudent?.id || students?.[0]?.id || 1), icon: AcademicCapIcon },
        { name: 'School Contact', href: route('parent.school-contact'), icon: PhoneIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-neutral-gray">
            {/* Desktop Sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 overflow-y-auto" style={{ backgroundColor: '#3730a3' }}>
                    <div className="flex flex-col flex-shrink-0 px-4 mb-8">
                        <span className="text-xl font-bold text-white">School Portal</span>
                        <span className="text-sm text-indigo-200 mt-1">{auth.user.name}</span>
                    </div>

                    <div className="flex-grow flex flex-col">
                        <nav className="flex-1 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-white hover:bg-indigo-700 transition-colors"
                                >
                                    <item.icon
                                        className="mr-3 flex-shrink-0 h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-shrink-0 px-2 space-y-1 border-t border-indigo-700 pt-4">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-white hover:bg-indigo-700 transition-colors"
                        >
                            <LockClosedIcon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                            Change Password
                        </button>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-white hover:bg-indigo-700 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {showingNavigationDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
                        onClick={() => setShowingNavigationDropdown(false)}
                    ></div>

                    {/* Mobile Sidebar */}
                    <div className="fixed inset-y-0 left-0 flex flex-col w-64 z-50 md:hidden">
                        <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 overflow-y-auto" style={{ backgroundColor: '#3730a3' }}>
                            {/* Header with Close Button */}
                            <div className="flex items-center justify-between px-4 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-white">School Portal</span>
                                    <span className="text-sm text-indigo-200 mt-1">{auth.user.name}</span>
                                </div>
                                <button
                                    onClick={() => setShowingNavigationDropdown(false)}
                                    className="text-white hover:text-indigo-200"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Navigation Items */}
                            <div className="flex-grow flex flex-col">
                                <nav className="flex-1 px-2 space-y-1">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-white hover:bg-indigo-700 transition-colors"
                                            onClick={() => setShowingNavigationDropdown(false)}
                                        >
                                            <item.icon
                                                className="mr-3 flex-shrink-0 h-5 w-5"
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* Bottom Actions */}
                            <div className="flex-shrink-0 px-2 space-y-1 border-t border-indigo-700 pt-4">
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(true);
                                        setShowingNavigationDropdown(false);
                                    }}
                                    className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-white hover:bg-indigo-700 transition-colors"
                                >
                                    <LockClosedIcon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                    Change Password
                                </button>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-white hover:bg-indigo-700 transition-colors"
                                >
                                    <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Mobile Header & Content Wrapper */}
            <div className="flex flex-col md:pl-64 flex-1">
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-trust-blue md:hidden"
                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center text-trust-blue font-bold text-lg">
                        Parent Portal
                    </div>
                </div>

                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation (Optional fallback if Toggle is not sufficient) */}

            {/* Change Password Modal */}
            <ChangePasswordModal
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                isFirstLogin={auth.user?.first_login || false}
            />
        </div>
    );
}
