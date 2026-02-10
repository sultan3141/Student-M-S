import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    ArrowLeftIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    BookOpenIcon,
    ScaleIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon as TrophySolid } from '@heroicons/react/24/solid';

export default function AcademicYearRecordShow({
    academic_year,
    semester1_average,
    semester2_average,
    final_average,
    subjects,
    final_rank,
    rank_s1,
    rank_s2,
    total_students,
    is_complete
}) {
    // Calculate totals from subjects
    const totalScoreS1 = subjects.reduce((acc, sub) => acc + (parseFloat(sub.semester1_average) || 0), 0);
    const totalScoreS2 = subjects.reduce((acc, sub) => acc + (parseFloat(sub.semester2_average) || 0), 0);
    const totalScoreFinal = subjects.reduce((acc, sub) => acc + (parseFloat(sub.final_average) || 0), 0);

    const getGradeColor = (average) => {
        if (!average) return 'text-gray-400 bg-gray-100';
        if (average >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (average >= 80) return 'text-blue-700 bg-blue-50 border-blue-200';
        if (average >= 70) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
        if (average >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-red-700 bg-red-50 border-red-200';
    };

    const getLetterGrade = (average) => {
        if (!average) return '-';
        if (average >= 90) return 'A';
        if (average >= 80) return 'B';
        if (average >= 70) return 'C';
        if (average >= 60) return 'D';
        return 'F';
    };

    return (
        <StudentLayout>
            <Head title={`Academic Year - ${academic_year?.name}`} />

            <div className="max-w-7xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href={route('student.dashboard')}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            <span className="font-medium">Back to Dashboard</span>
                        </Link>
                        {is_complete ? (
                            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span className="font-semibold text-sm">Complete</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200">
                                <ClockIcon className="w-5 h-5" />
                                <span className="font-semibold text-sm">In Progress</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <AcademicCapIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Academic Year {academic_year?.name}
                            </h1>
                            <p className="text-gray-600">Annual Performance Report</p>
                        </div>
                    </div>
                </div>

                {/* Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Semester 1 */}
                    <Link href={route('student.academic.semester.show', { semester: '1', academicYear: academic_year?.id })} className="block group">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-600">Semester 1</span>
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">1</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="text-3xl font-bold text-gray-900">
                                    {(totalScoreS1 > 0) ? parseFloat(totalScoreS1.toFixed(2)) : 'N/A'}
                                </div>
                            </div>
                            <div className="text-xs text-blue-600 font-medium group-hover:underline">
                                View Details →
                            </div>
                        </div>
                    </Link>

                    {/* Semester 2 */}
                    <Link href={route('student.academic.semester.show', { semester: '2', academicYear: academic_year?.id })} className="block group">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-600">Semester 2</span>
                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                    <span className="text-indigo-600 font-bold text-sm">2</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="text-3xl font-bold text-gray-900">
                                    {(totalScoreS2 > 0) ? parseFloat(totalScoreS2.toFixed(2)) : 'N/A'}
                                </div>
                            </div>
                            <div className="text-xs text-indigo-600 font-medium group-hover:underline">
                                View Details →
                            </div>
                        </div>
                    </Link>

                    {/* Final Score */}
                    <div className="bg-blue-600 rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-blue-100">Final Score</span>
                            <ChartBarIcon className="w-6 h-6 text-blue-200" />
                        </div>
                        <div className="mb-2">
                            <div className="text-3xl font-bold text-white">
                                {(totalScoreFinal > 0) ? parseFloat(totalScoreFinal.toFixed(2)) : '--'}
                            </div>
                        </div>
                        {final_average && (
                            <div className={`inline-block px-3 py-1 rounded-md font-bold text-sm ${getGradeColor(final_average)}`}>
                                Grade {getLetterGrade(final_average)}
                            </div>
                        )}
                    </div>

                    {/* Rank */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-600">Class Rank</span>
                            <TrophySolid className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="mb-2">
                            <div className="text-3xl font-bold text-gray-900">
                                #{final_rank || '-'}
                            </div>
                        </div>
                        {total_students && (
                            <div className="text-sm text-gray-600">
                                of {total_students} students
                            </div>
                        )}
                    </div>
                </div>

                {/* Subject Performance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <BookOpenIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Subject Performance</h2>
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                                {subjects.length} Subjects
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        {subjects.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Semester 1</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Semester 2</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Average</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {subjects.map((subject, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <span className="text-gray-700 font-bold text-xs">{subject.code.substring(0, 3)}</span>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{subject.name}</div>
                                                            <div className="text-xs text-gray-500">{subject.code}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`font-semibold ${subject.semester1_average !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {subject.semester1_average !== null ? subject.semester1_average : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`font-semibold ${subject.semester2_average !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {subject.semester2_average !== null ? subject.semester2_average : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`font-bold text-lg ${subject.final_average ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {subject.final_average ? subject.final_average : '-'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 border-t-2 border-gray-100">
                                        <tr>
                                            <td className="px-4 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                                                Total Score
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-bold text-base ${(totalScoreS1 > 0) ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {(totalScoreS1 > 0) ? parseFloat(totalScoreS1.toFixed(2)) : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-bold text-base ${(totalScoreS2 > 0) ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {(totalScoreS2 > 0) ? parseFloat(totalScoreS2.toFixed(2)) : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-black text-lg ${(totalScoreFinal > 0) ? 'text-blue-700' : 'text-gray-400'}`}>
                                                    {(totalScoreFinal > 0) ? parseFloat(totalScoreFinal.toFixed(2)) : '-'}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-t border-gray-100">
                                            <td className="px-4 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                                                Average
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-bold text-base ${(totalScoreS1 > 0) ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {(totalScoreS1 > 0 && subjects.length > 0) ? parseFloat((totalScoreS1 / subjects.length).toFixed(2)) : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-bold text-base ${(totalScoreS2 > 0) ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {(totalScoreS2 > 0 && subjects.length > 0) ? parseFloat((totalScoreS2 / subjects.length).toFixed(2)) : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-black text-lg ${(totalScoreFinal > 0) ? 'text-blue-700' : 'text-gray-400'}`}>
                                                    {(totalScoreFinal > 0 && subjects.length > 0) ? parseFloat((totalScoreFinal / subjects.length).toFixed(2)) : '-'}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-50 border-t border-gray-100">
                                            <td className="px-4 py-4 text-left text-sm font-black text-gray-900 uppercase tracking-wider">
                                                Rank
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-bold text-base ${rank_s1 !== '-' ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {rank_s1 !== '-' ? `${rank_s1}` : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-bold text-base ${rank_s2 !== '-' ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {rank_s2 !== '-' ? `${rank_s2}` : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`font-black text-lg ${final_rank !== '-' ? 'text-blue-700' : 'text-gray-400'}`}>
                                                    {final_rank !== '-' ? `${final_rank}` : '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <ScaleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">No Subject Data</h3>
                                <p className="text-sm text-gray-500">Academic records will appear here once available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
