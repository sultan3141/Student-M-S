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
    PencilSquareIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ auth, stats, recentStudents, grades }) {
    return (
        <RegistrarLayout user={auth.user}>
            <Head title="Registrar Command Center" />

            <div className="space-y-6">
                {/* 1. Header & Stats Row */}
                <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#1E40AF] px-6 py-4 border-b border-[#D4AF37] flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <ClipboardDocumentCheckIcon className="w-6 h-6 mr-2" /> ENROLLMENT COMMAND DASHBOARD
                        </h2>
                        <div className="text-[#F5F5DC] text-sm font-mono flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1 inline" /> {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {/* Stat 1 */}
                        <div className="p-6 text-center hover:bg-blue-50 transition-colors cursor-default group">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600">NEW TODAY</div>
                            <div className="mt-2 text-4xl font-black text-[#1E40AF]">{stats.newToday}</div>
                            <div className="text-sm text-gray-600 mt-1">Students Registered</div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-6 text-center hover:bg-yellow-50 transition-colors cursor-default group">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-yellow-600">PENDING FEES</div>
                            <div className="mt-2 text-4xl font-black text-[#D97706]">{stats.pendingPayments}</div>
                            <div className="text-sm text-gray-600 mt-1">Payment Requests</div>
                        </div>

                        {/* Stat 3 */}
                        <div className="p-6 text-center hover:bg-blue-50 transition-colors cursor-default group">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600">TOTAL ACTIVE</div>
                            <div className="mt-2 text-4xl font-black text-[#1E40AF]">{stats.totalActive}</div>
                            <div className="text-sm text-gray-600 mt-1">Enrolled Students</div>
                        </div>

                        {/* Actions Panel */}
                        <div className="p-6 flex flex-col justify-center space-y-3 bg-gray-50">
                            <Link href={route('registrar.students.create')} className="flex items-center justify-center w-full bg-[#1E40AF] text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm font-bold transition-all transform hover:scale-105">
                                <UserPlusIcon className="w-4 h-4 mr-2" /> New Registration
                            </Link>
                            <Link href={route('registrar.payments.index')} className="flex items-center justify-center w-full bg-white border border-[#D4AF37] text-[#D97706] px-4 py-2 rounded shadow-sm hover:bg-yellow-50 text-sm font-bold transition-colors">
                                <BanknotesIcon className="w-4 h-4 mr-2" /> Collect Fees
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 2. Quick Actions / Links */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* System Status */}
                        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-5">
                            <h3 className="font-bold text-[#1F2937] mb-4 uppercase text-xs tracking-wider border-b pb-2">System Status</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Registration Portal</span>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold ring-1 ring-blue-600/20">ONLINE</span>
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

                        {/* Shortcuts */}
                        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-5">
                            <h3 className="font-bold text-[#1F2937] mb-4 uppercase text-xs tracking-wider border-b pb-2">Shortcuts</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 text-center border rounded hover:border-blue-500 hover:bg-blue-50 transition group flex flex-col items-center">
                                    <PrinterIcon className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700">Print Forms</span>
                                </button>
                                <button className="p-3 text-center border rounded hover:border-blue-500 hover:bg-blue-50 transition group flex flex-col items-center">
                                    <AcademicCapIcon className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700">Class Lists</span>
                                </button>
                                <button className="p-3 text-center border rounded hover:border-blue-500 hover:bg-blue-50 transition group flex flex-col items-center">
                                    <UserGroupIcon className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700">Guardians</span>
                                </button>
                                <button className="p-3 text-center border rounded hover:border-blue-500 hover:bg-blue-50 transition group flex flex-col items-center">
                                    <Cog6ToothIcon className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700">Settings</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. Recent Students Table */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E5E7EB] flex flex-col">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-[#1F2937] flex items-center">
                                <ClockIcon className="w-5 h-5 mr-2" /> RECENT REGISTRATIONS
                            </h3>
                            <Link href={route('registrar.students.create')} className="text-xs text-[#1E40AF] font-bold hover:underline">View All History →</Link>
                        </div>
                        <div className="flex-1 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Placement</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                                <InboxIcon className="w-12 h-12 mb-3 mx-auto text-gray-300" />
                                                No registrations recorded today.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-blue-600">{student.student_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{student.user?.name}</div>
                                                    <div className="text-xs text-gray-500">{student.gender}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="font-semibold text-gray-700">{student.grade?.name}</span>
                                                    <span className="mx-1 text-gray-300">|</span>
                                                    {student.section?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-gray-400 hover:text-[#1E40AF] transition-colors">
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-right">
                            <span className="text-xs text-gray-500 italic">Showing last 5 entries</span>
                        </div>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}
