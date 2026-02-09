import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    CalendarIcon,
    AcademicCapIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, schedule, todayDate, stats }) {
    return (
        <TeacherLayout>
            <Head title="Attendance Dashboard" />

            {/* Header / Hero Section */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-sm mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <CalendarIcon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">{todayDate}</span>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                ATTENDANCE <span className="text-blue-200">DASHBOARD</span>
                            </h1>
                        </div>

                        {/* Summary Stats in Hero */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Completed</div>
                                <div className="text-2xl font-black text-white leading-none">
                                    {stats.todayCompleted} <span className="text-xs font-medium text-white/50">/ {stats.totalClasses}</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Weekly Rate</div>
                                <div className="text-2xl font-black text-white leading-none">{stats.weekRate}%</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hidden sm:block">
                                <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Pending</div>
                                <div className="text-2xl font-black text-white leading-none">{stats.totalClasses - stats.todayCompleted}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Schedule Pulse Board */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Today's Schedule</h2>
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {schedule.length} Classes Today
                        </div>
                    </div>

                    {schedule.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schedule.map((cls) => {
                                const isCompleted = cls.status === 'Completed';
                                return (
                                    <div
                                        key={cls.section_id}
                                        className={`group relative bg-white rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isCompleted
                                                ? 'border-green-100 hover:border-green-300'
                                                : 'border-blue-50 hover:border-blue-200'
                                            }`}
                                    >
                                        <div className="p-6">
                                            {/* Status Badge */}
                                            <div className="absolute top-6 right-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCompleted
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-amber-50 text-amber-600 animate-pulse'
                                                    }`}>
                                                    {isCompleted ? 'Completed' : 'Upcoming'}
                                                </span>
                                            </div>

                                            {/* Class Info */}
                                            <div className="mb-6">
                                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                                                    {cls.grade_name} &bull; {cls.section_name}
                                                </div>
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {cls.subject_name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Students</span>
                                                    <span className="text-sm font-bold text-gray-700">{cls.student_count} Total</span>
                                                </div>
                                                <div className="w-px h-6 bg-gray-100 italic"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Period</span>
                                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                                        <ClockIcon className="w-3.5 h-3.5 text-blue-500" />
                                                        Daily
                                                    </span>
                                                </div>
                                            </div>

                                            <Link
                                                href={route('teacher.attendance.create', cls.section_id)}
                                                className={`flex items-center justify-center w-full py-4 rounded-xl font-black text-sm transition-all tracking-tight ${isCompleted
                                                        ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                                    }`}
                                            >
                                                {isCompleted ? 'View/Edit Records' : 'Mark Attendance'}
                                                {!isCompleted && <ArrowRightIcon className="w-4 h-4 ml-2" />}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-20 text-center">
                            <div className="w-20 h-20 bg-blue-50 text-blue-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <ClockIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">All Clear Today!</h3>
                            <p className="text-gray-500 font-medium max-w-sm mx-auto">
                                No classes are scheduled for your attention today. You can relax or catch up on other tasks.
                            </p>
                        </div>
                    )}
                </div>

                {/* Legend or Information */}
                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4">
                    <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-200">
                        <ExclamationCircleIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Attendance Reminder</h4>
                        <p className="text-xs font-semibold text-amber-800/80 leading-relaxed">
                            Daily attendance marking is crucial for student progress tracking. Please ensure all records are submitted by the end of each class period to maintain accurate reporting.
                        </p>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
