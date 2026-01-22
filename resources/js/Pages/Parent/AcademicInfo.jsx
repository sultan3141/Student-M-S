import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';

export default function AcademicInfo({ student, marks = [], academicYears, filters }) {
    // Group marks by semester and subject
    const groupedBySemester = marks.reduce((acc, mark) => {
        const semester = mark.semester || 1;
        if (!acc[semester]) acc[semester] = {};

        const subjectName = mark.subject?.name || 'Unknown';
        if (!acc[semester][subjectName]) {
            acc[semester][subjectName] = {
                midterm: 0,
                test: 0,
                assignment: 0,
                final: 0,
            };
        }

        // Map assessment types to columns
        const assessmentType = mark.assessment_type?.name?.toLowerCase() || '';
        if (assessmentType.includes('midterm')) {
            acc[semester][subjectName].midterm = mark.score;
        } else if (assessmentType.includes('test')) {
            acc[semester][subjectName].test = mark.score;
        } else if (assessmentType.includes('assignment')) {
            acc[semester][subjectName].assignment = mark.score;
        } else if (assessmentType.includes('final')) {
            acc[semester][subjectName].final = mark.score;
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

    const calculateAnnualAverage = () => {
        const semester1Avg = parseFloat(calculateSemesterAverage(groupedBySemester[1] || {}));
        const semester2Avg = parseFloat(calculateSemesterAverage(groupedBySemester[2] || {}));

        if (semester1Avg && semester2Avg) {
            return ((semester1Avg + semester2Avg) / 2).toFixed(2);
        } else if (semester1Avg) {
            return semester1Avg.toFixed(2);
        } else if (semester2Avg) {
            return semester2Avg.toFixed(2);
        }
        return '0.00';
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
                    <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                        <div>
                            <span className="text-gray-500">Academic Year:</span>
                            <span className="ml-2 font-semibold text-gray-900">2024/2025</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Grade & Section:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                                {student?.grade?.name || 'N/A'}-{student?.section?.name || 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Attendance:</span>
                            <span className="ml-2 font-semibold text-green-600">95% (Excellent)</span>
                        </div>
                    </div>

                    {/* Semester Tables */}
                    {[1, 2].map((semester) => {
                        const semesterData = groupedBySemester[semester] || {};
                        const subjects = Object.keys(semesterData);

                        if (subjects.length === 0) return null;

                        return (
                            <div key={semester} className="mb-8">
                                <h3 className="text-md font-semibold text-gray-800 mb-4">
                                    Semester {semester} - Academic Results
                                </h3>

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
                                            {subjects.map((subject) => {
                                                const scores = semesterData[subject];
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
                                                    Semester {semester} Average
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                    {calculateSemesterAverage(semesterData)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}

                    {/* Annual Summary Section */}
                    {Object.keys(groupedBySemester).length > 0 && (
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Summary</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Annual Average</p>
                                    <p className="text-2xl font-bold text-blue-600">{calculateAnnualAverage()}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Class Rank</p>
                                    <p className="text-2xl font-bold text-gray-900">3rd/45</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {Object.keys(groupedBySemester).length === 0 && (
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
