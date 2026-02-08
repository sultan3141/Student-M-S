import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import StudentPerformanceChart from '@/Components/Charts/StudentPerformanceChart';
import StudentAttendanceChart from '@/Components/Charts/StudentAttendanceChart';
import {
    AcademicCapIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    UserGroupIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ student, attendance, marks, currentSemester }) {
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

            {/* Compact Page Header - Same as Director */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-navy-900" style={{ color: '#0F172A' }}>
                    📊 Student Dashboard
                </h1>
                <p className="mt-1 text-xs text-gray-600">
                    Academic performance and attendance overview
                </p>
            </div>

            {/* Semester Status Banner - Same as Director */}
            {currentSemester && (
                <div className="mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <CalendarDaysIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">
                                    Semester {currentSemester.semester || 1}
                                </h3>
                                <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-white text-sm">
                                        Status: <span className="ml-1 font-semibold text-green-300">
                                            {currentSemester.status?.toUpperCase() || 'ACTIVE'}
                                        </span>
                                    </span>
                                    <span className="text-white text-sm">
                                        {student?.grade?.name || 'Grade 10'} - Section {student?.section?.name || 'A'}
                                    </span>
                                </div>
                                {currentSemester.message && (
                                    <p className="text-white/90 text-xs mt-1">{currentSemester.message}</p>
                                )}
                            </div>
                        </div>
                        <Link
                            href={route('student.academic.semesters')}
                            className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm"
                        >
                            View Records
                        </Link>
                    </div>
                </div>
            )}

            {/* Compact Summary Cards - 5 columns - Same as Director */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-blue-500 rounded">
                            <ChartBarIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-700">{currentAverage.toFixed(1)}</div>
                        </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Current Average</div>
                    <div className="text-xs text-blue-500">Percentage</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-amber-500 rounded">
                            <TrophyIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-amber-700">#{currentRank}</div>
                        </div>
                    </div>
                    <div className="text-xs text-amber-600 font-medium">Class Rank</div>
                    <div className="text-xs text-amber-500">Position</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-emerald-500 rounded">
                            <CalendarDaysIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-700">{attendanceRate}%</div>
                        </div>
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">Attendance</div>
                    <div className="text-xs text-emerald-500">Rate</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-purple-500 rounded">
                            <AcademicCapIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-700">{totalSubjects}</div>
                        </div>
                    </div>
                    <div className="text-xs text-purple-600 font-medium">Total Subjects</div>
                    <div className="text-xs text-purple-500">Enrolled</div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <div className="p-2 bg-pink-500 rounded">
                            <UserGroupIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-pink-700">{totalStudents}</div>
                        </div>
                    </div>
                    <div className="text-xs text-pink-600 font-medium">Classmates</div>
                    <div className="text-xs text-pink-500">Total</div>
                </div>
            </div>

            {/* Analysis Section with Charts - Same as Director */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Performance Chart */}
                <StudentPerformanceChart 
                    marks={formattedMarks}
                    currentAverage={currentAverage}
                    currentRank={currentRank}
                />

                {/* Attendance Chart */}
                <StudentAttendanceChart 
                    attendanceRate={attendanceRate}
                    recentAttendance={recentAttendance}
                />
            </div>

            {/* Performance Analysis - Same as Director */}
            {recentMarks && recentMarks.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Subject Performance Analysis</h3>
                    <div className="space-y-2">
                        {recentMarks.slice(0, 5).map((mark, index) => {
                            const percentage = mark.percentage_value || parseFloat(mark.percentage) || 0;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>{mark.subject}</span>
                                        <span className="font-semibold">{percentage.toFixed(1)}% ({mark.score}/{mark.maxScore})</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all ${
                                                percentage >= 90 ? 'bg-green-500' :
                                                percentage >= 75 ? 'bg-blue-500' :
                                                percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex justify-between text-xs text-gray-700">
                                <span className="font-semibold">Overall Average</span>
                                <span className="font-bold text-emerald-600">{currentAverage.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
