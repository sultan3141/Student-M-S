import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    UserGroupIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats = {}, recentActivity = [], deadlines = [], teacher = {}, currentSemester = null, todaySchedule = [], today = '' }) {
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />

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
                            </div>
                        </div>
                    </div>
                </div>
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
            </div>
        </TeacherLayout>
    );
}
