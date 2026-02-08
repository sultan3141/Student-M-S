import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import SemesterWidget from '@/Components/SemesterWidget';
import {
    AcademicCapIcon,
    CalendarDaysIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    UserIcon,
    BellIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function StudentDashboard({ auth, student, academicYear, attendance, marks, schedule, notifications, currentSemester }) {
    return (
        <StudentLayout>
            <Head title="Student Dashboard" />

            {/* Header with Badge */}
            <div className="flex items-center space-x-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                    Student
                </span>
            </div>

            {/* Semester Widget - Full Width */}
            {currentSemester && (
                <div className="mb-8">
                    <SemesterWidget semester={currentSemester} userType="student" />
                </div>
            )}

            {/* Student Info Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-blue-100 text-sm">Student ID</p>
                        <p className="text-2xl font-bold">{student?.student_id || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Grade</p>
                        <p className="text-2xl font-bold">{student?.grade?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Section</p>
                        <p className="text-2xl font-bold">{student?.section?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Academic Year</p>
                        <p className="text-2xl font-bold">{academicYear?.name || '2025-2026'}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <span className="text-4xl font-bold text-blue-600 mb-1">{attendance?.rate || 0}%</span>
                    <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <span className="text-4xl font-bold text-blue-600 mb-1">{marks?.average?.toFixed(1) || '0.0'}</span>
                    <span className="text-sm font-medium text-gray-600">Current Average</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <span className="text-4xl font-bold text-blue-600 mb-1">#{marks?.rank || 'N/A'}</span>
                    <span className="text-sm font-medium text-gray-600">Class Rank</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <span className="text-4xl font-bold text-blue-600 mb-1">{marks?.totalSubjects || 0}</span>
                    <span className="text-sm font-medium text-gray-600">Total Subjects</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity (Left 2/3) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Marks</h2>
                    <div className="space-y-4">
                        {marks?.recent && marks.recent.length > 0 ? (
                            marks.recent.map((mark, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-700 font-bold text-xs">{mark.subject.substring(0, 3).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{mark.subject}</p>
                                            <p className="text-xs text-gray-500">{mark.assessment}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-blue-600">{mark.score}/{mark.maxScore}</p>
                                        <span className="text-xs text-gray-400">{mark.date}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No marks yet</h3>
                                <p className="mt-1 text-xs text-gray-500">Your marks will appear here once graded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar (1/3) */}
                <div className="space-y-6">
                    {/* Today's Schedule */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-blue-500" />
                            Today's Schedule
                        </h3>
                        {schedule && schedule.length > 0 ? (
                            <div className="space-y-3">
                                {schedule.slice(0, 4).map((item) => (
                                    <div key={item.id} className="relative pl-6 pb-3 last:pb-0 border-l-2 border-gray-100 last:border-0">
                                        <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${item.type === 'break' ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
                                        <p className="text-sm font-bold text-gray-900">{item.activity}</p>
                                        <p className="text-xs text-gray-500">{item.time}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 text-sm py-4">No classes today</p>
                        )}
                    </div>

                    {/* Announcements */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BellIcon className="w-5 h-5 text-blue-500" />
                            Announcements
                        </h3>
                        {notifications && notifications.length > 0 ? (
                            <div className="space-y-3">
                                {notifications.slice(0, 3).map((note) => (
                                    <div key={note.id} className="p-3 bg-blue-50 rounded-lg">
                                        <h4 className="text-sm font-bold text-gray-900 mb-1">{note.title}</h4>
                                        <p className="text-xs text-gray-600 line-clamp-2">{note.message}</p>
                                        <span className="text-xs text-blue-600 mt-1 block">{note.date}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 text-sm py-4">No announcements</p>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
