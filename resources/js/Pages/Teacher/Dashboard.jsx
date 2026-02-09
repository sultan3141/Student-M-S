import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import SemesterWidget from '@/Components/SemesterWidget';
import SemesterStatusGrid from '@/Components/SemesterStatusGrid';
import {
    UserGroupIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    PlusIcon,
    UserPlusIcon,
    ArrowDownTrayIcon,
    ClockIcon
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
                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Academic Portal
                                    </span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                </div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                                    WELCOME BACK, <span className="text-blue-600 uppercase">{teacher?.user?.name?.split(' ')[0] || 'TEACHER'}</span>
                                </h1>
                                <p className="mt-3 text-gray-500 font-medium max-w-lg">
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

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Total Students', value: stats.totalStudents || 120, icon: UserGroupIcon, color: 'blue' },
                            { label: 'Active Classes', value: stats.activeClasses || 4, icon: AcademicCapIcon, color: 'indigo' },
                            { label: 'Pending Marks', value: stats.pendingMarks || 25, icon: ClipboardDocumentCheckIcon, color: 'amber' },
                            { label: 'Avg Attendance', value: '94.2%', icon: ClockIcon, color: 'green' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 hover:scale-[1.02] transition-all duration-300 group">
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                                <div className="text-3xl font-black text-gray-900 tracking-tight mb-1">{stat.value}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Feed / Activity */}
                        <div className="lg:col-span-2 space-y-8">
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
                                            <div className={`relative z-10 w-12 h-12 rounded-xl bg-${item.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Semester Status Widget Integration point if needed */}
                            {currentSemester && (
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                    <SemesterWidget semester={currentSemester} userType="teacher" />
                                </div>
                            )}
                        </div>

                        {/* Quick Actions Sidebar */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-2">Essential Tasks</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Link
                                    href={route('teacher.declare-result.index')}
                                    className="group relative bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 border border-blue-500 p-6 overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                            <PlusIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-black text-white leading-tight mb-1 uppercase tracking-tight">Declare<br />Result</h3>
                                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Post new marks</p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('teacher.students.manage-results')}
                                    className="group bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 transition-all hover:translate-y-[-4px] hover:shadow-2xl"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 uppercase tracking-tight">Manage<br />Results</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audit student performance</p>
                                </Link>

                                <Link
                                    href={route('teacher.students.index')}
                                    className="group bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 transition-all hover:translate-y-[-4px] hover:shadow-2xl"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <UserGroupIcon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 uppercase tracking-tight">View<br />Directory</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect with students</p>
                                </Link>

                                <Link
                                    href={route('teacher.reports.index')}
                                    className="group bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 transition-all hover:translate-y-[-4px] hover:shadow-2xl"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <ArrowDownTrayIcon className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 uppercase tracking-tight">Export<br />Reports</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generate documentation</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
