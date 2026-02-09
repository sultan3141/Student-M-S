import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
<<<<<<< HEAD
=======
import SemesterWidget from '@/Components/SemesterWidget';
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
import {
    UserGroupIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
<<<<<<< HEAD
    ClockIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats = {}, recentActivity = [], deadlines = [], teacher = {}, currentSemester = null, todaySchedule = [], today = '' }) {
=======
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
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />

<<<<<<< HEAD
            {/* Compact Page Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    📊 Teacher Dashboard
                </h1>
                <p className="mt-1 text-xs text-gray-600">
                    Academic performance and class management overview
                </p>
            </div>

            {/* Semester Status Banner */}
            {currentSemester && (
                <div className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <CalendarIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">
                                    {currentSemester.academic_year} - Semester {currentSemester.semester}
                                </h3>
                                <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-white text-sm">
                                        Status: <span className={`ml-1 font-semibold ${currentSemester.is_open ? 'text-green-300' : 'text-gray-300'}`}>
                                            {currentSemester.status.toUpperCase()}
                                        </span>
                                    </span>
                                </div>
                                {currentSemester.message && (
                                    <p className="text-white/90 text-xs mt-1">{currentSemester.message}</p>
                                )}
=======
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
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
                            </div>
                        </div>
                    </div>
                </div>
<<<<<<< HEAD
            )}

            {/* Compact Summary Cards - 5 columns */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-blue-500 rounded">
                            <UserGroupIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-700">{stats.totalStudents || 0}</div>
                        </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Total Students</div>
                    <div className="text-xs text-blue-500">Enrolled</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-emerald-500 rounded">
                            <AcademicCapIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-700">{stats.activeClasses || 0}</div>
                        </div>
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">Active Classes</div>
                    <div className="text-xs text-emerald-500">Sections</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-purple-500 rounded">
                            <ClipboardDocumentCheckIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-700">{stats.pendingMarks || 0}</div>
                        </div>
                    </div>
                    <div className="text-xs text-purple-600 font-medium">Pending Marks</div>
                    <div className="text-xs text-purple-500">To Declare</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-amber-500 rounded">
                            <ClockIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-amber-700">94.2%</div>
                        </div>
                    </div>
                    <div className="text-xs text-amber-600 font-medium">Avg Attendance</div>
                    <div className="text-xs text-amber-500">Rate</div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-pink-500 rounded">
                            <AcademicCapIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-pink-700">{stats.totalSubjects || 0}</div>
                        </div>
                    </div>
                    <div className="text-xs text-pink-600 font-medium">Total Subjects</div>
                    <div className="text-xs text-pink-500">Teaching</div>
                </div>
            </div>

            {/* Today's Schedule */}
            {todaySchedule && todaySchedule.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-700">📅 Today's Schedule ({today})</h2>
                        <Link 
                            href={route('teacher.schedule')}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                            View Full Schedule →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Time</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Class</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Activity</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {todaySchedule.map((slot, index) => {
                                    const isBreak = slot.activity.toLowerCase().includes('break') || 
                                                  slot.activity.toLowerCase().includes('lunch');
                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-3 py-2 text-xs font-medium text-gray-900">
                                                <div className="flex items-center space-x-2">
                                                    <ClockIcon className="h-3.5 w-3.5 text-blue-500" />
                                                    <span>{slot.start_time} - {slot.end_time}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-xs text-gray-700">
                                                {slot.grade} - {slot.section}
                                            </td>
                                            <td className="px-3 py-2 text-xs">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    isBreak 
                                                        ? 'bg-amber-100 text-amber-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {slot.activity}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-xs text-gray-600">
                                                {slot.location || '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <Link
                    href={route('teacher.declare-result.index')}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">Declare Result</div>
                            <div className="text-xs text-gray-500">Post new marks</div>
                        </div>
                    </div>
                </Link>

                <Link
                    href={route('teacher.attendance.index')}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <CalendarIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">Attendance</div>
                            <div className="text-xs text-gray-500">Mark today</div>
                        </div>
                    </div>
                </Link>

                <Link
                    href={route('teacher.assessments-simple.index')}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <UserGroupIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">Assessments</div>
                            <div className="text-xs text-gray-500">View all</div>
                        </div>
                    </div>
                </Link>
=======
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)
            </div>
        </TeacherLayout>
    );
}
