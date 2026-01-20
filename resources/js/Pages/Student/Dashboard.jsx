import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import StudentBarChart from '@/Components/Charts/StudentBarChart';
import StudentDonutChart from '@/Components/Charts/StudentDonutChart';
import GradeDistributionChart from '@/Components/Charts/GradeDistributionChart';
import PerformanceTrendChart from '@/Components/Charts/PerformanceTrendChart';
import {
    UsersIcon,
    UserGroupIcon,
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    UserIcon,
    TrophyIcon,
    ChartPieIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function StudentDashboard({ auth, student, academicYear, subjects, promotionStatus, stats, statistics, pastPerformance }) {
    const { students, instructors, gradeBreakdown } = statistics;

    return (
        <StudentLayout>
            <Head title="Student Dashboard" />

            {/* Header with Badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-sm">
                        Student
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wide border border-gray-200">
                        {academicYear?.name || '2025-2026'}
                    </span>
                </div>
                <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-blue-200">
                    Welcome back, <span className="text-blue-600 font-black tracking-tight">{student?.user?.name || auth.user.name}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Analytics Content (Full Width) */}
                <div className="lg:col-span-4 space-y-8">


                    {/* Charts Row 1: Demographics */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <StudentDonutChart
                            data={students}
                            title="Student Gender Distribution"
                        />
                        <GradeDistributionChart
                            data={gradeBreakdown}
                        />
                    </div>

                    {/* Charts Row 2: Performance & School comparison */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <PerformanceTrendChart
                            data={pastPerformance}
                        />
                        <StudentBarChart
                            studentCount={students.total}
                            instructorCount={instructors}
                        />
                    </div>

                    {/* Detailed Statistics Table */}
                    <div className="executive-card overflow-hidden !p-0">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                School Demographics Breakdown
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="text-right py-4 px-6 text-xs font-bold text-blue-600 uppercase tracking-wider">Male</th>
                                        <th className="text-right py-4 px-6 text-xs font-bold text-pink-600 uppercase tracking-wider">Female</th>
                                        <th className="text-right py-4 px-6 text-xs font-bold text-emerald-600 uppercase tracking-wider">Total</th>
                                        <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Percentage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6 font-bold text-gray-900">Students</td>
                                        <td className="py-4 px-6 text-right font-bold text-blue-600">{students.male}</td>
                                        <td className="py-4 px-6 text-right font-bold text-pink-600">{students.female}</td>
                                        <td className="py-4 px-6 text-right font-bold text-emerald-600">{students.total}</td>
                                        <td className="py-4 px-6 text-right text-sm text-gray-600 font-medium">
                                            M: {students.malePercent}% | F: {students.femalePercent}%
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6 font-bold text-gray-900">Instructors</td>
                                        <td className="py-4 px-6 text-right text-gray-400 group-hover:text-gray-500 font-medium">-</td>
                                        <td className="py-4 px-6 text-right text-gray-400 group-hover:text-gray-500 font-medium">-</td>
                                        <td className="py-4 px-6 text-right font-bold text-emerald-600">{instructors}</td>
                                        <td className="py-4 px-6 text-right text-sm text-gray-600 font-medium">-</td>
                                    </tr>
                                    <tr className="bg-gray-50/50 border-t-2 border-gray-100">
                                        <td className="py-4 px-6 font-extrabold text-indigo-900 uppercase text-xs tracking-widest">Ratio</td>
                                        <td className="py-4 px-6 text-right" colSpan="3">
                                            <div className="flex items-center justify-end space-x-2">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{students.total} Students</span>
                                                <span className="text-gray-400 font-bold">:</span>
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">{instructors} Instructors</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right font-extrabold text-indigo-700">
                                            {instructors > 0 ? Math.round(students.total / instructors) : 0}:1
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </StudentLayout >
    );
}
