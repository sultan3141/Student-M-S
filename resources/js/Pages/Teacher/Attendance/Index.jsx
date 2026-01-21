import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, schedule, todayDate, stats }) {
    return (
        <TeacherLayout>
            <Head title="Attendance Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Attendance Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">{todayDate}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Classes Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.todayCompleted} / {stats.totalClasses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Weekly Rate</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.weekRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                                <ExclamationCircleIcon className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending Actions</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalClasses - stats.todayCompleted}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Classes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
                    </div>

                    {schedule.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {schedule.map((cls) => (
                                <div key={cls.section_id} className="p-6 transition-colors hover:bg-gray-50/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                        <div className="flex items-start">
                                            <div className={`p-2 rounded-lg ${cls.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                <ClockIcon className="w-6 h-6" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="text-lg font-semibold text-gray-900">{cls.subject_name}</h4>
                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                                        {cls.grade_name} - {cls.section_name}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                                                    <span>{cls.student_count} Students</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {cls.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href={route('teacher.attendance.create', cls.section_id)}
                                            className={`inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${cls.status === 'Completed'
                                                    ? 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500'
                                                    : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-blue-200'
                                                }`}
                                        >
                                            {cls.status === 'Completed' ? 'Edit Attendance' : 'Mark Attendance'}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <ClockIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-lg font-medium">No classes scheduled for today.</p>
                            <p className="text-sm">Enjoy your free day!</p>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
