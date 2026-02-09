import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    UserGroupIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    CalendarIcon,
    ArrowRightIcon,
    BookOpenIcon,
    ChartPieIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats = {}, recentActivity = [], deadlines = [], teacher = {}, currentSemester = null, todaySchedule = [], today = '' }) {
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />

            {/* Minimalist Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="text-gray-900 border-b border-gray-100 italic">Teacher Console</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-400">Dashboard</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">
                            Academic <span className="text-blue-600">Overview</span>
                        </h1>
                        <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Real-time Command Center &bull; {today}
                        </p>
                    </div>
                </div>
            </div>

            {/* Clean Semester Banner */}
            {currentSemester && (
                <div className="mb-10 bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between group hover:border-blue-100 transition-colors">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <CalendarIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Active Semester</span>
                                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[8px] font-bold uppercase tracking-widest">
                                    {currentSemester.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                                {currentSemester.academic_year} &mdash; <span className="text-blue-600">Semester {currentSemester.semester}</span>
                            </h3>
                            {currentSemester.message && (
                                <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-widest opacity-60">System: {currentSemester.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Flat Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 transition-colors hover:border-blue-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 mb-4">
                            <UserGroupIcon className="h-5 w-5" />
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Enrolled</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{stats.totalStudents || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 transition-colors hover:border-emerald-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 mb-4">
                            <AcademicCapIcon className="h-5 w-5" />
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Blocks</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{stats.activeClasses || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 transition-colors hover:border-purple-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600 mb-4">
                            <ClipboardDocumentCheckIcon className="h-5 w-5" />
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Entry</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{stats.pendingMarks || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 transition-colors hover:border-amber-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600 mb-4">
                            <ChartPieIcon className="h-5 w-5" />
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Attendance</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">94.2%</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 transition-colors hover:border-pink-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-pink-50 rounded-xl text-pink-600 mb-4">
                            <BookOpenIcon className="h-5 w-5" />
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Core Subjects</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{stats.totalSubjects || 0}</p>
                    </div>
                </div>
            </div>

            {/* Minimalist Schedule Feed */}
            {todaySchedule && todaySchedule.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-10 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            Synchronized Schedule &bull; {today}
                        </h2>
                        <Link
                            href={route('teacher.schedule')}
                            className="text-[9px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                        >
                            Complete Agenda →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todaySchedule.map((slot, index) => {
                            const isBreak = slot.activity.toLowerCase().includes('break') ||
                                slot.activity.toLowerCase().includes('lunch');
                            return (
                                <div key={index} className="group p-5 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-blue-100 transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-2.5 rounded-lg border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-colors ${isBreak ? 'bg-amber-50 text-amber-600' : 'bg-white text-blue-600'}`}>
                                            {isBreak ? <ClockIcon className="w-4 h-4" /> : <AcademicCapIcon className="w-4 h-4" />}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest block mb-0.5">Session Time</span>
                                            <span className="text-[10px] font-bold text-gray-900">{slot.start_time} - {slot.end_time}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                                            {slot.grade} &bull; {slot.section}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 border border-gray-100 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors ${isBreak ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-white text-gray-400 group-hover:border-blue-50'}`}>
                                                {slot.activity}
                                            </span>
                                            {slot.location && (
                                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{slot.location}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Flat Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href={route('teacher.declare-result.index')}
                    className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-600 hover:bg-blue-50/10 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ClipboardDocumentCheckIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mark Entry</p>
                                <p className="text-xs font-bold text-gray-900 uppercase">Declare Results &rarr;</p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link
                    href={route('teacher.attendance.index')}
                    className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-600 hover:bg-blue-50/10 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Roll Call</p>
                                <p className="text-xs font-bold text-gray-900 uppercase">Record Attendance &rarr;</p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link
                    href={route('teacher.assessments-simple.index')}
                    className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-600 hover:bg-blue-50/10 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <UserGroupIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Assessments</p>
                                <p className="text-xs font-bold text-gray-900 uppercase">View Registry &rarr;</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </TeacherLayout>
    );
}
