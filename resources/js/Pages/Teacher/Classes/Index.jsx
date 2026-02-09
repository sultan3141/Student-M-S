import React from 'react';
import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    AcademicCapIcon,
    UserGroupIcon,
    ChartBarIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    RectangleStackIcon
} from '@heroicons/react/24/outline';

export default function Index({ classes }) {
    const getUrgencyColor = (days) => {
        if (days <= 2) return 'text-red-600 bg-red-50 border-red-100';
        if (days <= 5) return 'text-orange-600 bg-orange-50 border-orange-100';
        return 'text-green-600 bg-green-50 border-green-100';
    };

    return (
        <TeacherLayout>
            <Head title="My Classes" />

            {/* Premium Header / Hero */}
            <div className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-500/20 rounded-xl backdrop-blur-md border border-indigo-400/30">
                                <AcademicCapIcon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">Academic Registry</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                            MY <span className="text-indigo-400">CLASSES</span>
                        </h1>
                        <p className="mt-4 text-indigo-200/60 font-medium max-w-lg">
                            Comprehensive overview of your official teaching assignments and section-specific performance metrics.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10 shadow-2xl">
                        <div className="text-center px-4 border-r border-white/10">
                            <div className="text-2xl font-black text-white leading-none mb-1">{classes.length}</div>
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Sections</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-black text-white leading-none mb-1">
                                {classes.reduce((acc, c) => acc + (c.pending_marks > 0 ? 1 : 0), 0)}
                            </div>
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pending Sync</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {classes.map((classItem) => (
                        <div key={classItem.id} className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 hover:-translate-y-2 group">
                            {/* Class Identity Card */}
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-16 h-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform group-hover:rotate-6 duration-500 border-2 border-white shadow-sm overflow-hidden">
                                        <div className="text-xl font-black uppercase">{classItem.name.substring(0, 2)}</div>
                                    </div>
                                    {classItem.pending_marks > 0 ? (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Action Required</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                                            <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Synced</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">
                                        {classItem.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <span>Code: {classItem.code}</span>
                                        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                                        <span>Official Roster</span>
                                    </div>
                                </div>

                                {/* Modern Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50/50 rounded-3xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <UserGroupIcon className="w-3 h-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Students</span>
                                        </div>
                                        <div className="text-2xl font-black text-gray-900 leading-none">{classItem.students_count}</div>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-3xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <ChartBarIcon className="w-3 h-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Avg Grade</span>
                                        </div>
                                        <div className="text-2xl font-black text-gray-900 leading-none">{classItem.average_score}%</div>
                                    </div>
                                </div>

                                {/* Sophisticated Progress Bar */}
                                <div className="mb-0">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                        <span className="text-gray-400">Registry Progress</span>
                                        <span className="text-indigo-600">{classItem.completion_rate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-gray-50 shadow-inner">
                                        <div
                                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${classItem.completion_rate}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Due Date</span>
                                    <span className={`text-xs font-black uppercase ${classItem.days_remaining <= 2 ? 'text-red-500' : 'text-gray-700'}`}>
                                        {classItem.next_deadline}
                                    </span>
                                </div>
                                <Link
                                    href={route('teacher.classes.show', classItem.id)}
                                    className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                >
                                    <ArrowRightIcon className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </TeacherLayout>
    );
}
