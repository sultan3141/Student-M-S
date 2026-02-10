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
} from '@heroicons/react/24/outline';
import DashboardSchedule from '@/Components/DashboardSchedule';

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
    assessmentDistribution
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


            {/* Schedule Section */}
            <div className="mb-6">
                <DashboardSchedule schedule={schedule} />
            </div>

            {/* Analysis Section with Charts */}
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
