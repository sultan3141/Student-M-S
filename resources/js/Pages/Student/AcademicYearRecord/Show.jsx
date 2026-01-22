import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import {
    ArrowLeftIcon,
    TrophyIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    BookOpenIcon,
    ScaleIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function AcademicYearRecordShow({
    student,
    academic_year,
    semester1_average,
    semester2_average,
    final_average,
    subjects,
    final_rank,
    total_students,
    is_complete
}) {
    const getGradeColor = (average) => {
        if (!average) return 'text-gray-400 bg-gray-100';
        if (average >= 90) return 'text-blue-700 bg-blue-50 border-blue-200';
        if (average >= 80) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
        if (average >= 70) return 'text-cyan-700 bg-cyan-50 border-cyan-200';
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

            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Navigation and Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('student.dashboard')}
                            className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-all hover:shadow-md"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Academic Year {academic_year?.name}
                            </h1>
                            <p className="text-gray-500 font-medium">Final performance summary and rank</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {is_complete ? (
                            <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-200 border border-blue-500">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span className="font-bold text-sm uppercase tracking-wide">Year Complete</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-xl shadow-md shadow-amber-200 border border-amber-400">
                                <ClockIcon className="w-5 h-5" />
                                <span className="font-bold text-sm uppercase tracking-wide">In Progress</span>
                            </div>
                        )}
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl border border-gray-200 uppercase tracking-widest shadow-sm">
                            {student?.student_id}
                        </span>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Sem 1 */}
                    <Link href={route('student.academic.semester.show', { semester: '1', academicYear: academic_year?.id })} className="block group">
                        <div className="executive-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 !p-6 h-full relative overflow-hidden transition-all group-hover:scale-[1.02]">
                            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Semester 1</p>
                            <div className="flex items-baseline space-x-2 relative z-10">
                                <h2 className="text-4xl font-black text-blue-800">
                                    {semester1_average ? `${semester1_average}%` : 'N/A'}
                                </h2>
                            </div>
                            <div className="mt-4 flex items-center text-xs font-bold text-blue-500 bg-white/50 px-2 py-1 rounded-lg w-fit relative z-10">
                                View Details <ArrowLeftIcon className="w-3 h-3 ml-1 rotate-180" />
                            </div>
                        </div>
                    </Link>

                    {/* Sem 2 */}
                    <Link href={route('student.academic.semester.show', { semester: '2', academicYear: academic_year?.id })} className="block group">
                        <div className="executive-card bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 !p-6 h-full relative overflow-hidden transition-all group-hover:scale-[1.02]">
                            <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Semester 2</p>
                            <div className="flex items-baseline space-x-2 relative z-10">
                                <h2 className="text-4xl font-black text-indigo-800">
                                    {semester2_average ? `${semester2_average}%` : 'N/A'}
                                </h2>
                            </div>
                            <div className="mt-4 flex items-center text-xs font-bold text-indigo-500 bg-white/50 px-2 py-1 rounded-lg w-fit relative z-10">
                                View Details <ArrowLeftIcon className="w-3 h-3 ml-1 rotate-180" />
                            </div>
                        </div>
                    </Link>

                    {/* Final Average */}
                    <div className="executive-card bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500 !p-6 relative overflow-hidden transform hover:scale-[1.02] shadow-xl shadow-blue-600/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ChartBarIcon className="w-20 h-20 text-white" />
                        </div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Final Average</p>
                        <div className="flex items-baseline space-x-2 relative z-10">
                            <h2 className="text-5xl font-black text-white">{final_average ? final_average : '--'}%</h2>
                        </div>
                        {final_average && (
                            <div className="mt-4 relative z-10">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${getGradeColor(final_average)}`}>
                                    GRADE {getLetterGrade(final_average)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Final Rank */}
                    <div className="executive-card bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 !p-6 relative overflow-hidden transform hover:scale-[1.02] shadow-xl shadow-orange-600/10">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-black">
                            {final_rank && <span className="text-8xl text-white">#</span>}
                        </div>
                        <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Final Rank</p>
                        <h2 className="text-5xl font-black text-white relative z-10">{final_rank ? `#${final_rank}` : 'N/A'}</h2>
                        {total_students && (
                            <p className="mt-4 text-amber-100/80 text-xs font-bold relative z-10">
                                Out of {total_students} students
                            </p>
                        )}
                    </div>
                </div>

                {/* Subject Performance Table */}
                <div className="executive-card overflow-hidden !p-0">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <div className="p-2 bg-white rounded-lg border border-gray-100 mr-3 shadow-sm">
                                <BookOpenIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            Final Subject Mastery
                        </h2>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">
                            {subjects.length} Subjects Analyzed
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/30">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">Semester 1</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-indigo-600 uppercase tracking-wider">Semester 2</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">Annual Final</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {subjects.length > 0 ? (
                                    subjects.map((subject, index) => (
                                        <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600 font-black text-[10px] group-hover:bg-white group-hover:scale-110 transition-all">
                                                        {subject.code.substring(0, 3)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{subject.name}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subject.code}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`text-sm font-bold ${subject.semester1_average ? 'text-blue-600' : 'text-gray-300'}`}>
                                                    {subject.semester1_average ? `${subject.semester1_average}%` : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`text-sm font-bold ${subject.semester2_average ? 'text-indigo-600' : 'text-gray-300'}`}>
                                                    {subject.semester2_average ? `${subject.semester2_average}%` : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {subject.final_average ? (
                                                    <span className="text-base font-black text-gray-900">
                                                        {subject.final_average}%
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border tracking-wider outline outline-1 outline-offset-1 outline-transparent group-hover:outline-current transition-all ${getGradeColor(subject.final_average)}`}>
                                                    {getLetterGrade(subject.final_average)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <ScaleIcon className="w-12 h-12 text-gray-200 mb-2" />
                                                <p className="text-gray-400 font-bold">No academic data available for this year</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
