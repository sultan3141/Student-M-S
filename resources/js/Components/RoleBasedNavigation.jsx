import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function RoleBasedNavigation({ user }) {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);

    const hasRole = (role) => {
        return user.roles && user.roles.some(r => r.name === role);
    };

    const isActive = (routeName) => {
        return url.startsWith(route(routeName));
    };

    const navigationItems = () => {
        const items = [];

        // School Director Navigation
        if (hasRole('school_director')) {
            items.push(
                {
                    name: 'Director Dashboard',
                    href: route('school-director.dashboard'),
                    icon: '🏫',
                    active: isActive('school-director.dashboard')
                },
                {
                    name: 'Teachers',
                    href: route('school-director.teachers'),
                    icon: '👨‍🏫',
                    active: isActive('school-director.teachers')
                },
                {
                    name: 'All Assessments',
                    href: route('school-director.assessments'),
                    icon: '📋',
                    active: isActive('school-director.assessments')
                },
                {
                    name: 'Reports',
                    href: route('school-director.reports'),
                    icon: '📊',
                    active: isActive('school-director.reports')
                }
            );
        }

        // Teacher Navigation
        if (hasRole('teacher')) {
            items.push(
                {
                    name: 'Teacher Dashboard',
                    href: route('teacher.dashboard'),
                    icon: '👨‍🏫',
                    active: isActive('teacher.dashboard')
                },
                {
                    name: 'My Assessments',
                    href: route('assessments.index'),
                    icon: '📝',
                    active: isActive('assessments.index')
                },
                {
                    name: 'Create Assessment',
                    href: route('assessments.create'),
                    icon: '➕',
                    active: isActive('assessments.create')
                }
            );
        }

        // Student Navigation
        if (hasRole('student')) {
            items.push(
                {
                    name: 'Student Dashboard',
                    href: route('student.dashboard'),
                    icon: '🎓',
                    active: isActive('student.dashboard')
                },
                {
                    name: 'My Marks',
                    href: route('student.marks'),
                    icon: '📊',
                    active: isActive('student.marks')
                },
                {
                    name: 'Profile',
                    href: route('student.profile.edit'),
                    icon: '👤',
                    active: isActive('student.profile.edit')
                }
            );
        }

        // Registrar Navigation
        if (hasRole('registrar')) {
            items.push(
                {
                    name: 'Registrar Dashboard',
                    href: route('registrar.dashboard'),
                    icon: '📋',
                    active: isActive('registrar.dashboard')
                },
                {
                    name: 'Register Student',
                    href: route('registrar.students.create'),
                    icon: '👨‍🎓',
                    active: isActive('registrar.students.create')
                },
                {
                    name: 'Payments',
                    href: route('registrar.payments.index'),
                    icon: '💰',
                    active: isActive('registrar.payments.index')
                }
            );
        }

        return items;
    };

    const items = navigationItems();

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Mobile menu button */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:space-x-8">
                {items.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                            item.active
                                ? 'border-indigo-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </div>

            {/* Mobile navigation menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {items.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    item.active
                                        ? 'text-indigo-700 bg-indigo-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}