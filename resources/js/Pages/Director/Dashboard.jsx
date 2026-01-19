import DirectorLayout from '@/Layouts/DirectorLayout';
import { Head } from '@inertiajs/react';
import StudentBarChart from '@/Components/Charts/StudentBarChart';
import StudentDonutChart from '@/Components/Charts/StudentDonutChart';
import { UsersIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ statistics }) {
    const { students, instructors } = statistics;

    return (
        <DirectorLayout>
            <Head title="Executive Dashboard" />

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    📊 Executive Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Real-time school performance analytics and student demographics
                </p>
            </div>

            {/* Overall Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="executive-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-blue-500 rounded-lg">
                            <UsersIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-700">{students.male}</div>
                            <div className="text-xs text-blue-600">Male Students</div>
                        </div>
                    </div>
                    <div className="text-sm text-blue-700 font-medium">
                        {students.malePercent}% of total students
                    </div>
                </div>

                <div className="executive-card bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-pink-500 rounded-lg">
                            <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-pink-700">{students.female}</div>
                            <div className="text-xs text-pink-600">Female Students</div>
                        </div>
                    </div>
                    <div className="text-sm text-pink-700 font-medium">
                        {students.femalePercent}% of total students
                    </div>
                </div>

                <div className="executive-card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-emerald-500 rounded-lg">
                            <AcademicCapIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-emerald-700">{students.total}</div>
                            <div className="text-xs text-emerald-600">Total Students</div>
                        </div>
                    </div>
                    <div className="text-sm text-emerald-700 font-medium">
                        {instructors} Instructors
                    </div>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Bar Chart - Students vs Instructors */}
                <StudentBarChart
                    studentCount={students.total}
                    instructorCount={instructors}
                />

                {/* Donut Chart - Student Gender Distribution */}
                <StudentDonutChart
                    data={students}
                    title="Student Gender Distribution"
                />
            </div>

            {/* Detailed Statistics Table */}
            <div className="executive-card">
                <h3 className="text-lg font-semibold text-navy-900 mb-4" style={{ color: '#0F172A' }}>
                    Detailed Breakdown
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CATEGORY</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-blue-700">MALE</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-pink-700">FEMALE</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-emerald-700">TOTAL</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">PERCENTAGE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-900">Students</td>
                                <td className="py-4 px-4 text-right font-semibold text-blue-600">{students.male}</td>
                                <td className="py-4 px-4 text-right font-semibold text-pink-600">{students.female}</td>
                                <td className="py-4 px-4 text-right font-semibold text-emerald-600">{students.total}</td>
                                <td className="py-4 px-4 text-right text-sm text-gray-600">
                                    M: {students.malePercent}% | F: {students.femalePercent}%
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-900">Instructors</td>
                                <td className="py-4 px-4 text-right text-gray-400">-</td>
                                <td className="py-4 px-4 text-right text-gray-400">-</td>
                                <td className="py-4 px-4 text-right font-semibold text-emerald-600">{instructors}</td>
                                <td className="py-4 px-4 text-right text-sm text-gray-600">-</td>
                            </tr>
                            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                                <td className="py-4 px-4 text-gray-900">RATIO</td>
                                <td className="py-4 px-4 text-right" colSpan="3">
                                    <span className="text-blue-700">{students.total}</span>
                                    <span className="text-gray-500"> : </span>
                                    <span className="text-emerald-700">{instructors}</span>
                                    <span className="text-sm text-gray-600 ml-2">
                                        ({instructors > 0 ? Math.round(students.total / instructors) : 0}:1 ratio)
                                    </span>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DirectorLayout>
    );
}
