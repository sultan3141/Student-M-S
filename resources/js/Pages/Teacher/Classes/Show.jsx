import React from 'react';
import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    AcademicCapIcon,
    UserGroupIcon,
    MapPinIcon,
    CalendarIcon,
    ClockIcon,
    ChartBarIcon,
    ArrowLeftIcon,
    InboxStackIcon
} from '@heroicons/react/24/outline';

export default function Show({ class: classData, students, performance }) {
    return (
        <TeacherLayout>
            <Head title={classData.name} />

            {/* Premium Header / Hero */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <Link
                            href={route('teacher.classes.index')}
                            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all group/back"
                        >
                            <ArrowLeftIcon className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-md border border-blue-400/30">
                                    <AcademicCapIcon className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">Class Portfolio</span>
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">
                                {classData.name}
                            </h1>
                            <div className="mt-4 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-blue-100/60 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                    <InboxStackIcon className="w-3.5 h-3.5" />
                                    {classData.code}
                                </div>
                                <div className="flex items-center gap-2 text-blue-100/60 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                    <MapPinIcon className="w-3.5 h-3.5" />
                                    {classData.room}
                                </div>
                                <div className="flex items-center gap-2 text-blue-100/60 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    {classData.schedule}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* High-Performance Analytics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-[32px] border-2 border-gray-50 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:rotate-6 transition-transform">
                                <ChartBarIcon className="w-6 h-6" />
                            </div>
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Efficiency</div>
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Avg Score</p>
                        <p className="text-4xl font-black text-gray-900 mt-1 tabular-nums">{performance.average}<span className="text-xl opacity-30">%</span></p>
                    </div>

                    <div className="bg-white rounded-[32px] border-2 border-gray-50 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:rotate-6 transition-transform">
                                <ChartBarIcon className="w-6 h-6" />
                            </div>
                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Peak Perf.</div>
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Highest</p>
                        <p className="text-4xl font-black text-emerald-600 mt-1 tabular-nums">{performance.highest}<span className="text-xl opacity-30">%</span></p>
                    </div>

                    <div className="bg-white rounded-[32px] border-2 border-gray-50 p-6 shadow-sm hover:shadow-xl hover:shadow-rose-900/5 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:rotate-6 transition-transform">
                                <ChartBarIcon className="w-6 h-6" />
                            </div>
                            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Baseline</div>
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Lowest</p>
                        <p className="text-4xl font-black text-rose-600 mt-1 tabular-nums">{performance.lowest}<span className="text-xl opacity-30">%</span></p>
                    </div>

                    <div className="bg-white rounded-[32px] border-2 border-gray-50 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:rotate-6 transition-transform">
                                <UserGroupIcon className="w-6 h-6" />
                            </div>
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Retention</div>
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Pass Rate</p>
                        <p className="text-4xl font-black text-indigo-600 mt-1 tabular-nums">{performance.pass_rate}<span className="text-xl opacity-30">%</span></p>
                    </div>
                </div>

                {/* Class Roster Board */}
                <div className="bg-white rounded-[40px] border-2 border-gray-50 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">CLASS ROSTER</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Official Student Enrollment Dashboard</p>
                        </div>
                        <div className="px-6 py-2 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-black text-gray-500 uppercase tracking-widest">
                            {students.length} Total Students
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-50">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Identity</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Performance</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Attendance</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg transition-transform group-hover:rotate-6">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{student.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Assigned</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-black text-gray-900">{student.score}</span>
                                                <span className="text-[10px] font-black opacity-30">%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${student.attendance}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-black text-gray-400 tabular-nums">{student.attendance}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm
                                                ${student.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                    student.score >= 60 ? 'bg-blue-100 text-blue-700' :
                                                        'bg-rose-100 text-rose-700'
                                                }`}>
                                                {student.score >= 80 ? 'Exceptional' : student.score >= 60 ? 'Standard' : 'Action Required'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
