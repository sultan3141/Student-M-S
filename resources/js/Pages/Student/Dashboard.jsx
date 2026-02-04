import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    AcademicCapIcon,
    CalendarDaysIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    UserIcon,
    BellIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

export default function StudentDashboard({ auth, student, academicYear, attendance, marks, schedule, notifications }) {
    return (
        <StudentLayout>
            <Head title="Student Dashboard" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-sm">
                        Student
                    </span>
                </div>
                <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    Welcome back, <span className="text-emerald-600 font-black">{student?.user?.name || auth.user.name}</span>
                </div>
            </div>

            {/* Student Info Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-emerald-100 text-sm">Student ID</p>
                        <p className="text-2xl font-bold">{student?.student_id || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-emerald-100 text-sm">Grade</p>
                        <p className="text-2xl font-bold">{student?.grade?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-emerald-100 text-sm">Section</p>
                        <p className="text-2xl font-bold">{student?.section?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-emerald-100 text-sm">Academic Year</p>
                        <p className="text-2xl font-bold">{academicYear?.name || '2025-2026'}</p>
                    </div>
                </div>

                {/* Semester Status Badge (NEW) */}
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <div>
                        <p className="text-emerald-100 text-xs uppercase tracking-wider font-bold">Current Period</p>
                        <p className="text-lg font-bold flex items-center gap-2">
                            {academicYear?.currentSemester?.semester_label || 'Semester 1'}
                            {academicYear?.currentSemester?.is_open ? (
                                <span className="px-2 py-0.5 bg-white/20 text-white rounded text-xs">Active</span>
                            ) : (
                                <span className="px-2 py-0.5 bg-black/20 text-white/80 rounded text-xs">Closed</span>
                            )}
                        </p>
                    </div>
                    {academicYear?.currentSemester?.is_open && (
                        <div className="text-right">
                            <p className="text-emerald-100 text-xs">Status</p>
                            <p className="font-medium flex items-center gap-1">
                                <CheckCircleIcon className="w-4 h-4" />
                                Marks Entry Open
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Attendance */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className={`text-2xl font-bold ${attendance?.rate >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                            {attendance?.rate || 0}%
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Attendance Rate</h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{attendance?.present || 0} Present</span>
                        <span>{attendance?.total || 0} Total</span>
                    </div>
                </div>

                {/* Average Score */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 rounded-lg">
                            <ChartBarIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-2xl font-bold text-emerald-600">
                            {marks?.average?.toFixed(1) || '0.0'}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Current Average</h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{marks?.totalSubjects || 0} Subjects</span>
                        <span>Score: {marks?.average || 0}</span>
                    </div>
                </div>

                {/* Rank */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-2xl font-bold text-purple-600">
                            #{marks?.rank || 'N/A'}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Class Rank</h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Out of {marks?.totalStudents || 0}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Attendance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">Recent Attendance</h3>
                    </div>
                    <div className="p-6">
                        {attendance?.recent && attendance.recent.length > 0 ? (
                            <div className="space-y-3">
                                {attendance.recent.map((record, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            {record.status === 'Present' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            ) : record.status === 'Absent' ? (
                                                <XCircleIcon className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <ClockIcon className="w-5 h-5 text-yellow-500" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{record.date}</p>
                                                {record.remarks && <p className="text-xs text-gray-500">{record.remarks}</p>}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                            record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No attendance records yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Marks */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">Recent Marks</h3>
                    </div>
                    <div className="p-6">
                        {marks?.recent && marks.recent.length > 0 ? (
                            <div className="space-y-3">
                                {marks.recent.map((mark, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{mark.subject}</p>
                                            <p className="text-xs text-gray-500">{mark.assessment}</p>
                                        </div>
                                        <div className="text-right">
                                            {mark.is_graded ? (
                                                <>
                                                    <p className="text-lg font-bold text-emerald-600">{mark.score}/{mark.maxScore}</p>
                                                    <p className="text-xs text-gray-500">{mark.percentage}</p>
                                                </>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No marks recorded yet</p>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
