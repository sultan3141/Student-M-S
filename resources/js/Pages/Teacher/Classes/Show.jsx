import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
    AcademicCapIcon,
    UserGroupIcon,
    MapPinIcon,
    CalendarIcon,
    ClockIcon,
    ChartBarIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Show({ class: classData, students, performance }) {
    return (
        <TeacherLayout>
            <Head title={classData.name} />

            {/* Back Button */}
            <div className="mb-6">
                <Link
                    href={route('teacher.classes.index')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 font-medium"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to My Classes
                </Link>
            </div>

            {/* Class Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-6">
                            <AcademicCapIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
                            <p className="text-gray-500 mt-1">{classData.code} • {classData.semester}</p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <MapPinIcon className="w-4 h-4 mr-2" />
                                    {classData.room}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <ClockIcon className="w-4 h-4 mr-2" />
                                    {classData.schedule}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Average Score</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{performance.average}%</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50">
                            <ChartBarIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Highest Score</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{performance.highest}%</p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-50">
                            <ChartBarIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Lowest Score</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">{performance.lowest}%</p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-50">
                            <ChartBarIcon className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pass Rate</p>
                            <p className="text-3xl font-bold text-purple-600 mt-2">{performance.pass_rate}%</p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-50">
                            <UserGroupIcon className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Class Roster</h2>
                    <span className="text-sm text-gray-500">{students.length} students</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Attendance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-gray-900">{student.score}%</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{student.attendance}%</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.score >= 80 ? 'bg-green-100 text-green-800' :
                                                student.score >= 60 ? 'bg-blue-100 text-blue-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {student.score >= 80 ? 'Excellent' : student.score >= 60 ? 'Good' : 'Needs Attention'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </TeacherLayout>
    );
}
