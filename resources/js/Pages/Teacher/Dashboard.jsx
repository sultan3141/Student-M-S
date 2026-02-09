import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import SemesterWidget from '@/Components/SemesterWidget';
import {
    UserGroupIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    ClockIcon,
    UserPlusIcon,
    CalendarIcon,
    ChartBarIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, recentActivity, deadlines, teacher, currentSemester }) {
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8 group">
                        <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-500"></div>
                        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-3">
                                    WELCOME BACK, <span className="text-blue-600 uppercase">{teacher?.user?.name?.split(' ')[0] || 'TEACHER'}</span>
                                    <span className="ml-4 inline-flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-full align-middle">
                                            Academic Portal
                                        </span>
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    </span>
                                </h1>
                                <p className="text-gray-500 font-medium max-w-2xl">
                                    You have <span className="text-blue-600 font-bold">{stats.pendingMarks || 0} pending marks</span> to declare this week. Your performance across your classes is currently standing at <span className="text-green-600 font-bold">88.5% average</span>.
                                </p>
                            </div>
                            <div className="flex -space-x-3 overflow-hidden">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white bg-blue-50 flex items-center justify-center">
                                        <UserCircleIcon className="w-8 h-8 text-blue-200" />
                                    </div>
                                ))}
                                <div className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                    +{stats.totalStudents || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content (Left) */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Semester Status Widget */}
                            {currentSemester && (
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8">
                                    <SemesterWidget semester={currentSemester} userType="teacher" />
                                </div>
                            )}

                            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Activity</h2>
                                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">View All</button>
                                </div>
                                <div className="space-y-8 relative">
                                    <div className="absolute top-0 left-6 bottom-0 w-px bg-gray-100"></div>
                                    {[
                                        { title: 'Student attendance updated', time: '23 min ago', icon: ClockIcon, color: 'gray' },
                                        { title: 'Added Student to Advanced Math', time: '29 min ago', icon: UserPlusIcon, color: 'blue' },
                                        { title: 'Released Marks for Assignment 3', time: '26 min ago', icon: ClipboardDocumentCheckIcon, color: 'indigo' },
                                        { title: 'Written Assignments graded', time: '39 min ago', icon: DocumentTextIcon, color: 'green' }
                                    ].map((item, i) => (
                                        <div key={i} className="relative flex items-center gap-6 group">
                                            <div className={`relative z-10 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <item.icon className={`w-6 h-6 text-gray-600`} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Right) */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Key Stats in Sidebar Style */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Students', value: stats.totalStudents || 0, icon: UserGroupIcon },
                                    { label: 'Classes', value: stats.activeClasses || 0, icon: AcademicCapIcon },
                                    { label: 'Pending', value: stats.pendingMarks || 0, icon: ClipboardDocumentCheckIcon },
                                    { label: 'Attendance', value: '94%', icon: ClockIcon }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                                            <stat.icon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Quick Actions</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <Link
                                        href={route('teacher.declare-result.index')}
                                        className="group relative bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 border border-blue-500 p-5 overflow-hidden transition-all hover:translate-y-[-2px]"
                                    >
                                        <div className="absolute top-0 right-0 -m-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                                        <div className="relative flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                                <PlusIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-white uppercase tracking-tight">Declare Result</h3>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link
                                        href={route('teacher.attendance.index')}
                                        className="group bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-5 transition-all hover:translate-y-[-2px]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Take Attendance</h3>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Class Overview Card */}
                            <div className="bg-white border-2 border-gray-50 rounded-3xl p-6 shadow-lg shadow-gray-200/20">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Insight Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">Attendance</span>
                                        <span className="text-[11px] font-black text-emerald-600">94.2%</span>
                                    </div>
                                    <div className="w-full bg-gray-50 h-1 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full w-[94%]"></div>
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase">Performance</span>
                                        <span className="text-[11px] font-black text-blue-600">88.5%</span>
                                    </div>
                                    <div className="w-full bg-gray-50 h-1 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-[88%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
