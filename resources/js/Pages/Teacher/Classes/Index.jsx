import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    AcademicCapIcon,
    UserGroupIcon,
    ChartBarIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Index({ classes }) {
    const getUrgencyColor = (days) => {
        if (days <= 2) return 'text-red-600 bg-red-50';
        if (days <= 5) return 'text-orange-600 bg-orange-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <TeacherLayout>
            <Head title="My Classes" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
                <p className="mt-1 text-sm text-gray-500">Overview of all your teaching assignments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                    <div key={classItem.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {classItem.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{classItem.code}</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
                                    <AcademicCapIcon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-100">
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <UserGroupIcon className="w-4 h-4 mr-1" />
                                    Students
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{classItem.students_count}</p>
                            </div>
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <ChartBarIcon className="w-4 h-4 mr-1" />
                                    Average
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{classItem.average_score}%</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600 font-medium">Completion</span>
                                <span className="font-bold text-gray-900">{classItem.completion_rate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${classItem.completion_rate}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Next Deadline */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <ClockIcon className="w-5 h-5 text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Next Deadline</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getUrgencyColor(classItem.days_remaining)}`}>
                                    {classItem.days_remaining} days
                                </span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium">{classItem.next_deadline}</p>
                            <p className="text-xs text-gray-500 mt-1">{classItem.deadline_date}</p>

                            {/* Alerts */}
                            {classItem.pending_marks > 0 && (
                                <div className="mt-4 flex items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-orange-700 font-medium">
                                        {classItem.pending_marks} pending mark{classItem.pending_marks > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                            {classItem.pending_marks === 0 && (
                                <div className="mt-4 flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-green-700 font-medium">All marks up to date</span>
                                </div>
                            )}

                            {/* Action Button */}
                            <Link
                                href={route('teacher.classes.show', classItem.id)}
                                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group-hover:shadow-md"
                            >
                                View Details
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </TeacherLayout>
    );
}
