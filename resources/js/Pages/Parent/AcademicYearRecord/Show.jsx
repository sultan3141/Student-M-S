import { Head, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { TrophyIcon, ChartBarIcon, IdentificationIcon, BookOpenIcon, DocumentChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AcademicYearShow({ student, academic_year, semester1_average, semester2_average, final_average, subjects, final_rank, total_students, is_complete }) {

    const getGradeColor = (average) => {
        if (!average) return 'text-gray-400';
        if (average >= 90) return 'text-green-600';
        if (average >= 85) return 'text-blue-600';
        if (average >= 75) return 'text-indigo-600';
        if (average >= 65) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <ParentLayout>
            <Head title={`Academic Year ${academic_year?.name}`} />

            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Academic Year Summary
                        </h1>
                        <p className="mt-2 text-gray-500 font-medium">{academic_year?.name} Report Card</p>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <span className="px-4 py-2 bg-indigo-50 text-indigo-800 rounded-lg text-sm font-bold tracking-wide uppercase border border-indigo-100">
                            Grade {student.grade.name}
                        </span>
                        <span className="px-4 py-2 bg-gray-50 text-gray-800 rounded-lg text-sm font-bold tracking-wide uppercase border border-gray-100">
                            Section {student.section.name}
                        </span>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Final Average */}
                    <div className="executive-card bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500 !p-6 text-white transform hover:scale-[1.02] shadow-xl shadow-blue-600/20 h-full relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrophyIcon className="w-24 h-24" />
                        </div>
                        <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Yearly Average</p>
                        <div className="flex items-baseline space-x-1 relative z-10">
                            <h2 className="text-4xl font-black">{final_average || 'N/A'}<span className="text-xl opacity-70">%</span></h2>
                        </div>
                        <p className="mt-2 text-[10px] text-blue-100 font-bold uppercase tracking-tight relative z-10">Combined Semester Mastery</p>
                    </div>

                    {/* Final Rank */}
                    <div className="executive-card !p-6 transform hover:scale-[1.02] shadow-indigo-200/20 h-full">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Final Class Rank</p>
                        <div className="flex items-center space-x-2">
                            <TrophyIcon className="w-6 h-6 text-amber-500" />
                            <h2 className="text-3xl font-black text-gray-900">
                                <span className="text-amber-500 mr-0.5 opacity-50">#</span>{final_rank}
                            </h2>
                        </div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">OUT OF {total_students} STUDENTS</p>
                    </div>

                    {/* Semester 1 */}
                    <div className="executive-card !p-6 transform hover:scale-[1.02] shadow-sm h-full">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Semester 1 Avg</p>
                        <div className="flex items-baseline space-x-1">
                            <h2 className="text-3xl font-black text-gray-900">{semester1_average || 'N/A'}</h2>
                            {semester1_average && <span className="text-sm font-bold text-gray-400">%</span>}
                        </div>
                        <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${semester1_average || 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Semester 2 */}
                    <div className="executive-card !p-6 transform hover:scale-[1.02] shadow-sm h-full relative overflow-hidden">
                        {!semester2_average && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm">In Progress</span>
                            </div>
                        )}
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Semester 2 Avg</p>
                        <div className="flex items-baseline space-x-1">
                            <h2 className="text-3xl font-black text-gray-900">{semester2_average || 'N/A'}</h2>
                            {semester2_average && <span className="text-sm font-bold text-gray-400">%</span>}
                        </div>
                        <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${semester2_average || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Detailed Subjects Table */}
                <div className="executive-card overflow-hidden !p-0">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                <BookOpenIcon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Annual Subject Mastery</h3>
                                <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">Year-long performance tracking</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/30">
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Semester 1</th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Semester 2</th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Annual Avg</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {subjects.map((subject, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{subject.name}</span>
                                                <span className="text-xs text-gray-400 font-mono tracking-tight uppercase">{subject.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`text-sm font-bold ${getGradeColor(subject.semester1_average)}`}>
                                                {subject.semester1_average || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`text-sm font-bold ${getGradeColor(subject.semester2_average)}`}>
                                                {subject.semester2_average || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center bg-gray-50/30">
                                            <span className={`text-base font-black ${getGradeColor(subject.final_average)}`}>
                                                {subject.final_average || '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
