import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AcademicInfo({ student, marks = [], academicYears, filters }) {
    const [expandedYearId, setExpandedYearId] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);

    // Group marks by academic year, then by semester, then by subject
    const groupedByYear = marks.reduce((acc, mark) => {
        const yearId = mark.academic_year_id || 'unknown';
        const yearName = mark.academic_year?.name || 'Unknown Year';
        const semester = mark.semester || 1;

        if (!acc[yearId]) {
            acc[yearId] = {
                name: yearName,
                semesters: {}
            };
        }

        if (!acc[yearId].semesters[semester]) {
            acc[yearId].semesters[semester] = {};
        }

        const subjectName = mark.subject?.name || 'Unknown';
        if (!acc[yearId].semesters[semester][subjectName]) {
            acc[yearId].semesters[semester][subjectName] = {
                midterm: 0,
                test: 0,
                assignment: 0,
                final: 0,
            };
        }

        // Map assessment types to columns
        const assessmentType = mark.assessment_type?.name?.toLowerCase() || '';
        if (assessmentType.includes('midterm')) {
            acc[yearId].semesters[semester][subjectName].midterm = mark.score;
        } else if (assessmentType.includes('test')) {
            acc[yearId].semesters[semester][subjectName].test = mark.score;
        } else if (assessmentType.includes('assignment')) {
            acc[yearId].semesters[semester][subjectName].assignment = mark.score;
        } else if (assessmentType.includes('final')) {
            acc[yearId].semesters[semester][subjectName].final = mark.score;
        }

        return acc;
    }, {});

    const calculateTotal = (scores) => {
        return scores.midterm + scores.test + scores.assignment + scores.final;
    };

    const calculateSemesterAverage = (semesterData) => {
        const subjects = Object.values(semesterData);
        if (subjects.length === 0) return 0;

        const totalAvg = subjects.reduce((sum, scores) => {
            const total = calculateTotal(scores);
            return sum + (total / 4);
        }, 0);

        return (totalAvg / subjects.length).toFixed(1);
    };

    const calculateYearAverage = (yearData) => {
        const semester1Avg = parseFloat(calculateSemesterAverage(yearData.semesters[1] || {}));
        const semester2Avg = parseFloat(calculateSemesterAverage(yearData.semesters[2] || {}));

        if (semester1Avg && semester2Avg) {
            return ((semester1Avg + semester2Avg) / 2).toFixed(2);
        } else if (semester1Avg) {
            return semester1Avg.toFixed(2);
        } else if (semester2Avg) {
            return semester2Avg.toFixed(2);
        }
        return '0.00';
    };

    const toggleYear = (yearId) => {
        if (expandedYearId === yearId) {
            setExpandedYearId(null);
            setActiveSemester(null);
        } else {
            setExpandedYearId(yearId);
            setActiveSemester(null);
        }
    };

    const toggleSemester = (semester) => {
        if (activeSemester === semester) {
            setActiveSemester(null);
        } else {
            setActiveSemester(semester);
        }
    };

    const getOverallGrade = (average) => {
        const avg = parseFloat(average);
        if (avg >= 90) return 'A+';
        if (avg >= 85) return 'A';
        if (avg >= 80) return 'B+';
        if (avg >= 75) return 'B';
        if (avg >= 70) return 'C+';
        if (avg >= 65) return 'C';
        if (avg >= 60) return 'D';
        return 'F';
    };

    return (
        <ParentLayout>
            <Head title="Academic Information" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Welcome, Hassan Ahmed</p>
                </div>

                {/* Academic Information Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Academic Information - {student?.first_name} {student?.last_name}
                    </h2>

                    {/* Student Info Bar */}
                    <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                        <div>
                            <span className="text-gray-500">Current Grade:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                                {student?.grade?.name || 'N/A'}-{student?.section?.name || 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Student ID:</span>
                            <span className="ml-2 font-semibold text-gray-900">{student?.student_id || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Academic Years Accordion */}
                    {Object.keys(groupedByYear).length > 0 ? (
                        <div className="space-y-4">
                            {Object.entries(groupedByYear).map(([yearId, yearData]) => {
                                const isYearExpanded = expandedYearId === yearId;
                                const yearAverage = calculateYearAverage(yearData);

                                return (
                                    <div key={yearId} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Year Header */}
                                        <button
                                            onClick={() => toggleYear(yearId)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {isYearExpanded ? (
                                                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                                                ) : (
                                                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                                )}
                                                <span className="font-semibold text-gray-900">
                                                    Academic Year: {yearData.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-gray-600">
                                                    Average: <span className="font-semibold text-blue-600">{yearAverage}%</span>
                                                </span>
                                            </div>
                                        </button>

                                        {/* Year Content - Semesters */}
                                        {isYearExpanded && (
                                            <div className="border-t border-gray-200">
                                                {/* Semester Selection Tabs */}
                                                <div className="flex border-b border-gray-200 bg-white">
                                                    {Object.keys(yearData.semesters).map((semester) => {
                                                        const semAvg = calculateSemesterAverage(yearData.semesters[semester]);
                                                        const isActive = activeSemester === semester;

                                                        return (
                                                            <button
                                                                key={semester}
                                                                onClick={() => toggleSemester(semester)}
                                                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${isActive
                                                                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                                    }`}
                                                            >
                                                                <div className="flex flex-col items-center">
                                                                    <span>Semester {semester}</span>
                                                                    <span className="text-xs mt-1">Avg: {semAvg}%</span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Semester Marks Table */}
                                                {activeSemester && yearData.semesters[activeSemester] && (
                                                    <div className="p-4 bg-white">
                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                                            Semester {activeSemester} - Academic Results
                                                        </h4>

                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Subject
                                                                        </th>
                                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Midterm
                                                                        </th>
                                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Test
                                                                        </th>
                                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Assignment
                                                                        </th>
                                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Final
                                                                        </th>
                                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            Total
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                    {Object.entries(yearData.semesters[activeSemester]).map(([subject, scores]) => {
                                                                        const total = calculateTotal(scores);

                                                                        return (
                                                                            <tr key={subject} className="hover:bg-gray-50">
                                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                    {subject}
                                                                                </td>
                                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                                                    {scores.midterm || '-'}
                                                                                </td>
                                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                                                    {scores.test || '-'}
                                                                                </td>
                                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                                                    {scores.assignment || '-'}
                                                                                </td>
                                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                                                    {scores.final || '-'}
                                                                                </td>
                                                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900">
                                                                                    {(total / 4).toFixed(1)}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}

                                                                    {/* Semester Average Row */}
                                                                    <tr className="bg-gray-50 font-semibold">
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan="5">
                                                                            Semester {activeSemester} Average
                                                                        </td>
                                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                                            {calculateSemesterAverage(yearData.semesters[activeSemester])}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Annual Summary for this year */}
                                                {isYearExpanded && (
                                                    <div className="m-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Annual Summary</h4>
                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div>
                                                                <p className="text-xs text-gray-600 mb-1">Annual Average</p>
                                                                <p className="text-xl font-bold text-blue-600">{yearAverage}%</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 mb-1">Class Rank</p>
                                                                <p className="text-xl font-bold text-gray-900">3rd/45</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No academic records</h3>
                            <p className="mt-1 text-sm text-gray-500">No marks have been recorded for this student yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </ParentLayout>
    );
}
