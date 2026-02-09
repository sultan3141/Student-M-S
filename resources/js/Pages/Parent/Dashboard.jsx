import React, { useMemo } from 'react';
import ParentLayout from '@/Layouts/ParentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AcademicCapIcon,
    CalendarDaysIcon,
    BanknotesIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ArrowRightIcon,
    ClockIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ parentName, selectedStudent, attendance }) {
    // Mock payment data - in production this would come from controller
    const paymentInfo = useMemo(() => ({
        status: 'Partial',
        outstandingBalance: 5000,
    }), []);

    return (
        <ParentLayout>
            <Head title="Parent Dashboard" />

            <div className="space-y-6">
                {/* Modern Header Section */}
                <div className="bg-gradient-to-r from-navy-900 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back,</p>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                {parentName}
                            </h1>
                            {selectedStudent ? (
                                <div className="mt-3 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 w-fit">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <p className="text-xs font-semibold text-indigo-100">
                                        Managing: {selectedStudent.user?.name}
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-3 flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-amber-500/30 w-fit">
                                    <ExclamationCircleIcon className="h-4 w-4 text-amber-400" />
                                    <p className="text-xs font-semibold text-amber-100">
                                        No child selected.
                                    </p>
                                </div>
                            )}
                        </div>
                        <Link
                            href={route('parent.children')}
                            className="px-5 py-2.5 bg-white text-navy-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2 w-fit"
                        >
                            <UserGroupIcon className="h-4 w-4" />
                            Switch Child
                        </Link>
                    </div>
                </div>

                {selectedStudent ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <AcademicCapIcon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{selectedStudent.grade?.name || 'N/A'}</div>
                                <div className="text-xs text-gray-400 mt-1">Section {selectedStudent.section?.name || 'N/A'}</div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <ClockIcon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{attendance?.rate || '100'}%</div>
                                <div className="text-xs text-gerald-500 mt-1">{attendance?.present || 0} Days Present</div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <CalendarDaysIcon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</span>
                                </div>
                                <div className={`text-xl font-bold ${selectedStudent.current_registration?.status === 'Approved' ? 'text-green-600' : 'text-amber-600'}`}>
                                    {selectedStudent.current_registration?.status || 'Pending'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Academic Year 2024</div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                        <BanknotesIcon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{paymentInfo.outstandingBalance.toLocaleString()}</div>
                                <div className="text-xs text-amber-600 mt-1">{paymentInfo.status} Payment</div>
                            </div>
                        </div>

                        {/* Reports Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
                                        Recent Reports
                                    </h3>
                                    <Link href={route('parent.academic.semesters', selectedStudent.id)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                                        View All
                                    </Link>
                                </div>
                                <div className="p-5">
                                    {selectedStudent.reports && selectedStudent.reports.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedStudent.reports.map((report) => (
                                                <div key={report.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition border border-transparent hover:border-gray-200">
                                                    <div className={`p-2 rounded-lg h-fit ${report.report_type === 'disciplinary' ? 'bg-red-100 text-red-600' :
                                                            report.report_type === 'academic' ? 'bg-blue-100 text-blue-600' :
                                                                'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        <DocumentTextIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-extrabold uppercase tracking-wide text-gray-400">
                                                                {report.report_type} Report
                                                            </span>
                                                            <span className="text-[10px] font-medium text-gray-400">
                                                                {new Date(report.reported_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                                            {report.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <DocumentTextIcon className="h-8 w-8 text-gray-200" />
                                            </div>
                                            <p className="text-sm text-gray-500">No recent reports found for {selectedStudent.user?.name}.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions / Info */}
                            <div className="space-y-6">
                                <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                                    <h3 className="font-bold text-lg mb-2">Need Support?</h3>
                                    <p className="text-indigo-100 text-xs leading-relaxed mb-6 opacity-80">
                                        Have questions about your child's progress or school events? Our administration is here to help.
                                    </p>
                                    <Link
                                        href={route('parent.school-contact')}
                                        className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                                    >
                                        Contact School
                                    </Link>
                                </div>

                                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
                                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Quick Access</h4>
                                    <div className="space-y-3">
                                        <Link href={route('parent.student.attendance', selectedStudent.id)} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition group">
                                            <span className="text-xs font-bold">Attendance History</span>
                                            <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </Link>
                                        <Link href={route('parent.student.payments', selectedStudent.id)} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-amber-700 transition group">
                                            <span className="text-xs font-bold">Billing & Payments</span>
                                            <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center animate-in fade-in duration-1000">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UserGroupIcon className="h-10 w-10 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Student Selected</h2>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                            Please select a child from your account to view their specific academic achievements and real-time attendance stats.
                        </p>
                        <Link
                            href={route('parent.children')}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition shadow-lg"
                        >
                            Select a Child
                            <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
