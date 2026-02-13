/**
 * Student Dashboard Page
 * Main landing page for students with academic summary and charts.
 */
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import StudentPerformanceChart from '@/Components/Charts/StudentPerformanceChart';
import StudentDonutChart from '@/Components/Charts/StudentDonutChart';
import StudentBarChart from '@/Components/Charts/StudentBarChart';
import UserDistributionBarChart from '@/Components/Charts/UserDistributionBarChart';
import {
    CalendarDaysIcon,
    MegaphoneIcon
} from '@heroicons/react/24/outline';

/**
 * Functional component for the student dashboard page.
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The rendered dashboard page.
 */
export default function Dashboard({
    student,
    attendance,
    marks,
    currentSemester,
    schedule,
    sectionStats,
    schoolStats,
    assessmentDistribution,
    notifications
}) {
    // Calculate real stats from data
    const currentAverage = marks?.average || 0;
    const currentRank = marks?.rank || '-';
    const totalStudents = marks?.totalStudents || 0;
    const attendanceRate = attendance?.rate || 100;
    const recentMarks = marks?.recent || [];
    const recentAttendance = attendance?.recent || [];
    const totalSubjects = marks?.totalSubjects || 0;

    // Format marks data for charts
    const formattedMarks = recentMarks.map(mark => ({
        subject: mark.subject,
        percentage: mark.percentage_value || parseFloat(mark.percentage) || 0,
        score: mark.score,
        maxScore: mark.maxScore,
        assessment: mark.assessment
    }));

    return (
        <StudentLayout>
            <Head title="Dashboard" />

            {/* Announcements Section (New) */}
            {notifications && notifications.length > 0 && (
                <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MegaphoneIcon className="h-5 w-5 text-blue-600" />
                            <h2 className="font-bold text-gray-900">Important Announcements</h2>
                        </div>
                        <Link
                            href={route('student.announcements.index')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {notifications.map((note) => (
                            <div key={note.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-gray-900">{note.title}</h3>
                                    <span className="text-[10px] font-medium text-gray-400">{note.date}</span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                    {note.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
                {/* Top Charts Grid */}
                <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Performance Chart */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <StudentPerformanceChart
                            marks={formattedMarks}
                            currentAverage={currentAverage}
                            currentRank={currentRank}
                        />
                    </div>

                    {/* Instructor - Student Comparison Chart */}
                    {schoolStats && (
                        <UserDistributionBarChart
                            data={[
                                { name: 'Instructor', value: schoolStats.totalInstructors },
                                { name: 'Applicant', value: 0 },
                                { name: 'Student', value: schoolStats.total }
                            ]}
                            title="Instructor - Student"
                        />
                    )}
                </div>

                <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* School Population Chart */}
                    {schoolStats && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <StudentBarChart
                                total={schoolStats.total}
                                male={schoolStats.male}
                                female={schoolStats.female}
                            />
                        </div>
                    )}

                    {/* Assessment Distribution Donut Chart */}
                    {assessmentDistribution && (
                        <StudentDonutChart
                            data={assessmentDistribution}
                            title="Assessment Distribution"
                        />
                    )}
                </div>

            </div>
        </StudentLayout>
    );
}
