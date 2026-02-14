import React from 'react';
import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ClipboardDocumentCheckIcon,
    CalendarIcon,
    UserPlusIcon,
    BanknotesIcon,
    PrinterIcon,
    AcademicCapIcon,
    UserGroupIcon,
    Cog6ToothIcon,
    ClockIcon,
    InboxIcon,
    PencilSquareIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ auth, stats = {}, recentStudents = [], grades = [] }) {
    return (
        <RegistrarLayout user={auth.user}>
            <Head title="Registrar Dashboard" />

            <div className="space-y-4">
                {/* Guardian Stats Banner - Responsive */}
                <div className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="p-2 sm:p-3 bg-white/20 rounded-lg flex-shrink-0">
                                <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm sm:text-lg">
                                    Guardian Portal Management
                                </h3>
                                <p className="text-indigo-100 text-xs sm:text-sm">
                                    Manage parent accounts and link students to guardians
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                            <div className="text-center flex-1 sm:flex-initial">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{stats?.totalGuardians || 0}</div>
                                <div className="text-xs sm:text-sm text-indigo-100 mt-1">Total Guardians</div>
                            </div>
                            <Link
                                href={route('registrar.guardians.index')}
                                className="px-3 sm:px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                            >
                                Manage Guardians
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Compact Summary Cards - 5 columns (Director Style) */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="p-2 bg-blue-500 rounded">
                                <UserPlusIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-700">{stats?.newToday || 0}</div>
                            </div>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">New Today</div>
                        <div className="text-xs text-blue-500">Students Registered</div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="p-2 bg-amber-500 rounded">
                                <BanknotesIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-amber-700">{stats?.pendingPayments || 0}</div>
                            </div>
                        </div>
                        <div className="text-xs text-amber-600 font-medium">Pending Fees</div>
                        <div className="text-xs text-amber-500">Payment Requests</div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="p-2 bg-emerald-500 rounded">
                                <UsersIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-700">{stats?.totalActive || 0}</div>
                            </div>
                        </div>
                        <div className="text-xs text-emerald-600 font-medium">Total Active</div>
                        <div className="text-xs text-emerald-500">Enrolled Students</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="p-2 bg-purple-500 rounded">
                                <UserGroupIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-700">{stats?.totalGuardians || 0}</div>
                            </div>
                        </div>
                        <div className="text-xs text-purple-600 font-medium">Guardians</div>
                        <div className="text-xs text-purple-500">Parent Accounts</div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="p-2 bg-pink-500 rounded">
                                <CalendarIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-pink-700 font-semibold">Term 1</div>
                            </div>
                        </div>
                        <div className="text-xs text-pink-600 font-medium">Academic Term</div>
                        <div className="text-xs text-pink-500">Week 4</div>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">⚡ Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link 
                            href={route('registrar.students.create')} 
                            className="p-3 text-center border border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group flex flex-col items-center"
                        >
                            <UserPlusIcon className="w-6 h-6 mb-2 text-blue-400 group-hover:text-blue-600 transition-colors" />
                            <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">New Registration</span>
                        </Link>
                        <Link 
                            href={route('registrar.payments.index')} 
                            className="p-3 text-center border border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition group flex flex-col items-center"
                        >
                            <BanknotesIcon className="w-6 h-6 mb-2 text-amber-400 group-hover:text-amber-600 transition-colors" />
                            <span className="text-xs font-semibold text-gray-700 group-hover:text-amber-700">Collect Fees</span>
                        </Link>
                        <button className="p-3 text-center border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group flex flex-col items-center">
                            <PrinterIcon className="w-6 h-6 mb-2 text-gray-400 group-hover:text-purple-600 transition-colors" />
                            <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-700">Print Forms</span>
                        </button>
                        <button className="p-3 text-center border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition group flex flex-col items-center">
                            <AcademicCapIcon className="w-6 h-6 mb-2 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                            <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-700">Class Lists</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* System Status */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 System Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Registration Portal</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">ONLINE</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Academic Term</span>
                                    <span className="font-semibold text-gray-900">Term 1 (Week 4)</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Server Time</span>
                                    <span className="font-mono text-gray-500 text-xs">{new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Students Table - Responsive */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg flex flex-col">
                        <div className="bg-gray-50 px-3 sm:px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                                <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Recent Registrations
                            </h3>
                            <Link href={route('registrar.admission.index')} className="text-xs text-blue-600 font-semibold hover:text-blue-700 hover:underline whitespace-nowrap">View All →</Link>
                        </div>
                        
                        {/* Desktop Table View */}
                        <div className="hidden md:block flex-1 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Placement</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-2 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {!recentStudents || recentStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                                <InboxIcon className="w-10 h-10 mb-2 mx-auto text-gray-300" />
                                                <p className="text-sm">No registrations recorded today.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        recentStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono font-medium text-blue-600">{student.student_id}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">{student.user?.name}</div>
                                                    <div className="text-xs text-gray-500">{student.gender}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="font-semibold text-gray-700">{student.grade?.name}</span>
                                                    <span className="mx-1 text-gray-300">|</span>
                                                    {student.section?.name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden flex-1 overflow-y-auto">
                            {!recentStudents || recentStudents.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    <InboxIcon className="w-10 h-10 mb-2 mx-auto text-gray-300" />
                                    <p className="text-sm">No registrations recorded today.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {recentStudents.map((student) => (
                                        <div key={student.id} className="p-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="text-xs font-mono font-medium text-blue-600 mb-1">{student.student_id}</div>
                                                    <div className="text-sm font-semibold text-gray-900">{student.user?.name}</div>
                                                    <div className="text-xs text-gray-500">{student.gender}</div>
                                                </div>
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap ml-2">
                                                    Active
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-gray-500">
                                                    <span className="font-semibold text-gray-700">{student.grade?.name}</span>
                                                    <span className="mx-1 text-gray-300">|</span>
                                                    {student.section?.name}
                                                </div>
                                                <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 px-3 sm:px-4 py-2 border-t border-gray-200 text-right">
                            <span className="text-xs text-gray-500">Showing last 5 entries</span>
                        </div>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}
