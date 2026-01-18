import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
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

export default function Dashboard({ stats, recentActivity, deadlines, teacher }) {
    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />

            {/* Header with Badge */}
            <div className="flex items-center space-x-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                    Teacher
                </span>
            </div>

            {/* Stats Grid - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <span className="text-4xl font-bold text-blue-600 mb-1">{stats.totalStudents || 120}</span>
                    <span className="text-sm font-medium text-gray-600">Total Students</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <span className="text-4xl font-bold text-blue-600 mb-1">4</span>
                    <span className="text-sm font-medium text-gray-600">Active Classes</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <span className="text-4xl font-bold text-blue-600 mb-1">{stats.pendingMarks || 25}</span>
                    <span className="text-sm font-medium text-gray-600">Pending Marks</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <span className="text-4xl font-bold text-blue-600 mb-1">2</span>
                    <span className="text-sm font-medium text-gray-600">Assignments (This Week)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity (Left 2/3) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {/* Static Timeline Items to Match Mockup */}
                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="absolute top-0 left-[-9px] bg-gray-100 rounded-full p-1">
                                <ClockIcon className="w-4 h-4 text-gray-500" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Student attendance updated</h4>
                            <p className="text-xs text-gray-500 mt-1">23 min ago</p>
                        </div>

                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="absolute top-0 left-[-9px] bg-blue-50 rounded-full p-1">
                                <UserPlusIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Added Student to Advanced Math</h4>
                            <p className="text-xs text-gray-500 mt-1">29 min ago</p>
                        </div>

                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="absolute top-0 left-[-9px] bg-indigo-50 rounded-full p-1">
                                <ClipboardDocumentCheckIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Released Marks for Assignment 3</h4>
                            <p className="text-xs text-gray-500 mt-1">26 min ago</p>
                        </div>

                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="absolute top-0 left-[-9px] bg-green-50 rounded-full p-1">
                                <DocumentTextIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Wrote Assignments graded</h4>
                            <p className="text-xs text-gray-500 mt-1">39 min ago</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Right 1/3) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href={route('teacher.marks.wizard.index')}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-md transition-all flex items-center justify-center space-x-2"
                        >
                            <ClipboardDocumentCheckIcon className="w-5 h-5" />
                            <span>📊 Enter Marks (Modern)</span>
                        </Link>

                        <Link
                            href={route('teacher.marks.create')}
                            className="w-full py-3 px-4 bg-white border-2 border-blue-200 hover:bg-blue-50 text-blue-700 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center space-x-2"
                        >
                            <ClipboardDocumentCheckIcon className="w-5 h-5" />
                            <span>Enter Marks (Classic)</span>
                        </Link>

                        <Link
                            href={route('teacher.students.index')}
                            className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center space-x-2"
                        >
                            <UserGroupIcon className="w-5 h-5" />
                            <span>View Students</span>
                        </Link>

                        <Link
                            href={route('teacher.reports.index')}
                            className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center space-x-2"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            <span>View Reports</span>
                        </Link>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
