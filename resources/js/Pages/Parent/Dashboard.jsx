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
    ExclamationCircleIcon,
    ChartBarIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
    TrophyIcon,
    BookOpenIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, StarIcon } from '@heroicons/react/24/solid';

export default function Dashboard({ parentName, selectedStudent, attendance, schedule }) {
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
                {/* Modern Header Section */}
                <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-white/10">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div>
                                <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-2">
                                    <SparklesIcon className="h-4 w-4 text-amber-300" />
                                    Welcome back,
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                                    {parentName}
                                </h1>
                            </div>

                            {selectedStudent ? (
                                <div className="flex items-center gap-4 bg-white/10 p-2 pr-6 rounded-full backdrop-blur-md border border-white/20 w-fit transition-all hover:bg-white/20">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-pink-500 shadow-lg">
                                            <img
                                                src={selectedStudent.user?.profile_photo_url || `https://ui-avatars.com/api/?name=${selectedStudent.user?.name}&background=random&color=fff`}
                                                alt="Student"
                                                className="w-full h-full rounded-full object-cover border-2 border-white"
                                            />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#1e40af] rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider mb-0.5">Currently Managing</p>
                                        <p className="text-lg font-bold text-white leading-none">
                                            {selectedStudent.user?.name}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 flex items-center gap-3 bg-amber-500/20 px-4 py-3 rounded-xl backdrop-blur-sm border border-amber-500/30 w-fit">
                                    <ExclamationCircleIcon className="h-6 w-6 text-amber-300 animate-bounce" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-100">No Child Selected</p>
                                        <p className="text-xs text-amber-200/80">Select a child to view their details.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {selectedStudent ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* LEFT COLUMN: Schedule & Status */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Today's Schedule Section */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                                            <CalendarDaysIcon className="h-6 w-6 text-indigo-600" />
                                            Today's Schedule
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <Link href={route('parent.student.schedule', selectedStudent.id)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition">
                                        View Full Week
                                    </Link>
                                </div>

                                <div className="relative pl-4 border-l-2 border-indigo-100 space-y-8">
                                    {(() => {
                                        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                                        // The schedule prop is an object grouped by day name
                                        const todaysClasses = schedule && schedule[today] ? schedule[today] : [];

                                        if (todaysClasses.length === 0) {
                                            return (
                                                <div className="text-center py-8 pr-4">
                                                    <p className="text-gray-400 italic">No classes scheduled for today.</p>
                                                </div>
                                            );
                                        }

                                        return todaysClasses.map((item, index) => (
                                            <div key={item.id} className="relative group">
                                                <span className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white ring-4 ${item.type === 'break' ? 'bg-amber-400 ring-amber-50' : 'bg-indigo-600 ring-indigo-50'} transition-all group-hover:scale-125`}></span>
                                                <div className={`p-4 rounded-xl border transition-all ${item.type === 'break' ? 'bg-amber-50/50 border-amber-100' : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md'}`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className={`font-bold ${item.type === 'break' ? 'text-amber-800' : 'text-gray-900'}`}>
                                                            {item.activity}
                                                        </h3>
                                                        <span className={`text-xs font-bold px-2 py-1 rounded ${item.type === 'break' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {item.start_time} - {item.end_time}
                                                        </span>
                                                    </div>
                                                    {item.type !== 'break' && (
                                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                                            <span className="flex items-center gap-1">
                                                                <ClockIcon className="h-3 w-3" />
                                                                45 min
                                                            </span>
                                                            {/* Placeholder for subject/room info if available later */}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Stats & Updates */}
                        <div className="space-y-8">

                            {/* Visual Attendance Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-indigo-50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ClockIcon className="h-24 w-24 text-indigo-600 transform rotate-12" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 relative z-10">Attendance Status</h3>
                                <div className="flex flex-col items-center relative z-10">
                                    <div className="relative w-32 h-32 mb-4">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-100" />
                                            <circle
                                                cx="64" cy="64" r="56"
                                                stroke="currentColor" strokeWidth="12" fill="none"
                                                strokeDasharray={351.86}
                                                strokeDashoffset={351.86 - (351.86 * (attendance?.rate || 100)) / 100}
                                                className={`text-indigo-600 transition-all duration-1000 ease-out`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-navy-900">{attendance?.rate || 100}%</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full text-center mt-2">
                                        <div className="bg-green-50 rounded-lg p-2">
                                            <p className="text-xs text-green-600 font-bold uppercase">Present</p>
                                            <p className="text-lg font-black text-green-700">{attendance?.present || '0'}</p>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-2">
                                            <p className="text-xs text-red-600 font-bold uppercase">Absent</p>
                                            <p className="text-lg font-black text-red-700">{attendance?.absent || '0'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Feed */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900">Recent Activity</h3>
                                    <Link href={route('parent.academic.semesters', selectedStudent.id)} className="text-xs font-bold text-indigo-500 hover:text-indigo-700">View All</Link>
                                </div>

                                <div className="space-y-4">
                                    {selectedStudent.reports && selectedStudent.reports.length > 0 ? (
                                        selectedStudent.reports.slice(0, 3).map((report) => (
                                            <div key={report.id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${report.report_type === 'disciplinary' ? 'bg-red-500' : 'bg-blue-500'
                                                    }`}></div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                                                        {new Date(report.reported_at).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm font-bold text-gray-800 line-clamp-2">
                                                        {report.message}
                                                    </p>
                                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${report.report_type === 'disciplinary' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {report.report_type}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-center text-gray-400 py-4">No recent updates.</p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Action Button */}
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href={route('parent.student.payments', selectedStudent.id)}
                                    className="p-4 bg-amber-50 rounded-2xl hover:bg-amber-100 transition flex flex-col items-center justify-center text-center group"
                                >
                                    <BanknotesIcon className="h-6 w-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-amber-800">Payments</span>
                                </Link>
                                <Link
                                    href={route('parent.school-contact')}
                                    className="p-4 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition flex flex-col items-center justify-center text-center group"
                                >
                                    <PhoneIcon className="h-6 w-6 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-indigo-800">Contact</span>
                                </Link>
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
