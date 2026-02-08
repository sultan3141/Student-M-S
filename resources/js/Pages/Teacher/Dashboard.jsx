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
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, recentActivity, deadlines, teacher, currentSemester }) {
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />

            {/* Compact Page Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    👨‍🏫 Teacher Dashboard
                </h1>
                <p className="mt-1 text-xs text-gray-600">
                    Manage classes, assessments, and student performance
                </p>
            </div>

            {/* Semester Widget Banner */}
            {currentSemester && (
                <div className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <CalendarIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">
                                    {currentSemester.academicYear} - Semester {currentSemester.semester}
                                </h3>
                                <p className="text-indigo-100 text-sm">
                                    {currentSemester.status === 'open' ? 'Active Semester' : 'Semester Closed'}
                                </p>
                            </div>
                        </div>
                        <div className="text-center">
                            <span className={`px-4 py-2 rounded-lg font-medium text-sm ${
                                currentSemester.status === 'open' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-400 text-white'
                            }`}>
                                {currentSemester.status === 'open' ? '● OPEN' : '● CLOSED'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Compact Summary Cards - 5 columns (Director Style) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-blue-500 rounded">
                            <UserGroupIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-700">{stats.totalStudents || 120}</div>
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
                            <div className="text-2xl font-bold text-emerald-700">4</div>
                        </div>
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">Active Classes</div>
                    <div className="text-xs text-emerald-500">Teaching</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-amber-500 rounded">
                            <ClipboardDocumentCheckIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-amber-700">{stats.pendingMarks || 25}</div>
                        </div>
                    </div>
                    <div className="text-xs text-amber-600 font-medium">Pending Marks</div>
                    <div className="text-xs text-amber-500">To Grade</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-purple-500 rounded">
                            <DocumentTextIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-700">2</div>
                        </div>
                    </div>
                    <div className="text-xs text-purple-600 font-medium">Assignments</div>
                    <div className="text-xs text-purple-500">This Week</div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-pink-500 rounded">
                            <ChartBarIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-pink-700">92%</div>
                        </div>
                    </div>
                    <div className="text-xs text-pink-600 font-medium">Avg. Score</div>
                    <div className="text-xs text-pink-500">Class Average</div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Link
                        href={route('teacher.marks.wizard.index')}
                        className="p-3 text-center border border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group flex flex-col items-center"
                    >
                        <ClipboardDocumentCheckIcon className="w-6 h-6 mb-2 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">Enter Marks</span>
                    </Link>
                    <Link
                        href={route('teacher.declare-result.index')}
                        className="p-3 text-center border border-emerald-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition group flex flex-col items-center"
                    >
                        <ChartBarIcon className="w-6 h-6 mb-2 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-700">Declare Result</span>
                    </Link>
                    <Link
                        href={route('teacher.attendance.index')}
                        className="p-3 text-center border border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition group flex flex-col items-center"
                    >
                        <CalendarIcon className="w-6 h-6 mb-2 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">Attendance</span>
                    </Link>
                    <Link
                        href={route('teacher.students.index')}
                        className="p-3 text-center border border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group flex flex-col items-center"
                    >
                        <UserGroupIcon className="w-6 h-6 mb-2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-700">View Students</span>
                    </Link>
                    <Link
                        href={route('teacher.reports.index')}
                        className="p-3 text-center border border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition group flex flex-col items-center"
                    >
                        <DocumentTextIcon className="w-6 h-6 mb-2 text-amber-400 group-hover:text-amber-600 transition-colors" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-amber-700">View Reports</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="absolute top-0 left-[-9px] bg-gray-100 rounded-full p-1">
                                <ClockIcon className="w-4 h-4 text-gray-500" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Student attendance updated</h4>
                            <p className="text-xs text-gray-500 mt-1">23 min ago</p>
                        </div>

                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="absolute top-0 left-[-9px] bg-blue-50 rounded-full p-1">
                                <UserPlusIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Added Student to Advanced Math</h4>
                            <p className="text-xs text-gray-500 mt-1">29 min ago</p>
                        </div>

                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="absolute top-0 left-[-9px] bg-indigo-50 rounded-full p-1">
                                <ClipboardDocumentCheckIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Released Marks for Assignment 3</h4>
                            <p className="text-xs text-gray-500 mt-1">26 min ago</p>
                        </div>

                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="absolute top-0 left-[-9px] bg-green-50 rounded-full p-1">
                                <DocumentTextIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Wrote Assignments graded</h4>
                            <p className="text-xs text-gray-500 mt-1">39 min ago</p>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Class Overview</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Attendance Rate</span>
                                <span className="font-semibold text-emerald-600">94%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Avg. Performance</span>
                                <span className="font-semibold text-blue-600">87%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Pending Reviews</span>
                                <span className="font-semibold text-amber-600">12</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Next Deadline</span>
                                <span className="font-semibold text-gray-900">2 days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
