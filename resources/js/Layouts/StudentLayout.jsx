import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentLayout({ children, auth, title, student }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Green Header */}
            <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="text-white hover:bg-green-700 p-2 rounded"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">IP</span>
                        </div>
                        <span className="font-bold text-lg">IPSMS</span>
                    </div>
                    <div className="ml-8 flex items-center space-x-6">
                        <Link href={route('student.dashboard')} className="hover:text-green-200 transition">Home</Link>
                        <Link href="#" className="hover:text-green-200 transition">Contact</Link>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="relative hover:bg-green-700 p-2 rounded">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="hover:bg-green-700 p-2 rounded">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-green-400">
                        <span className="text-green-600 font-bold">{auth?.user?.name?.charAt(0) || 'S'}</span>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Green Sidebar */}
                <div className={`bg-green-600 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-0' : 'w-64'} overflow-hidden`}>
                    <div className="p-4">
                        {/* Manage Student Header */}
                        <div className="bg-green-700 rounded px-4 py-3 mb-2 flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            <span className="font-semibold">Manage Student</span>
                            <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>

                        {/* Navigation Links - FR-01 to FR-12 */}
                        <nav className="space-y-1">
                            <Link
                                href={route('student.dashboard')}
                                className={`flex items-center space-x-3 px-4 py-2 rounded hover:bg-green-700 transition ${title === 'Student Dashboard' ? 'bg-green-700' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                href={route('student.admission.form')}
                                className={`flex items-center space-x-3 px-4 py-2 rounded hover:bg-green-700 transition ${title === 'Admission Application' ? 'bg-green-700' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <span>Application</span>
                            </Link>

                            <Link
                                href={route('student.registration.form')}
                                className={`flex items-center space-x-3 px-4 py-2 rounded hover:bg-green-700 transition ${title === 'Annual Registration' ? 'bg-green-700' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>Registration</span>
                            </Link>

                            <Link
                                href={route('student.grade-audit')}
                                className={`flex items-center space-x-3 px-4 py-2 rounded hover:bg-green-700 transition ${title === 'Grade Audit' ? 'bg-green-700' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                <span>Course Audit</span>
                            </Link>

                            <Link
                                href={route('student.profile.edit')}
                                className={`flex items-center space-x-3 px-4 py-2 rounded hover:bg-green-700 transition ${title === 'Edit Profile' ? 'bg-green-700' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>Profile</span>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Breadcrumb */}
                    <div className="bg-white px-6 py-3 border-b flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href={route('student.dashboard')} className="text-blue-600 hover:underline">Home</Link>
                            <span>/</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
