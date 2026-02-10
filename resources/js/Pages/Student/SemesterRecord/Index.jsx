import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { DocumentChartBarIcon, ChevronRightIcon, TrophyIcon, BookOpenIcon, IdentificationIcon, AcademicCapIcon, ArrowLeftIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { memo, useState } from 'react';

const GradeCard = memo(({ entry, onSelect }) => (
    <div
        onClick={() => onSelect(entry)}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 transform transition-all hover:scale-[1.02] hover:shadow-md group cursor-pointer"
    >
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <AcademicCapIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {entry.grade?.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0">
                        <CalendarIcon className="w-3 h-3 text-gray-400" />
                        <p className="text-[10px] font-semibold text-gray-500">
                            {entry.academic_year?.name}
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-1 rounded-md bg-gray-50 group-hover:bg-blue-50 transition-colors border border-gray-100 group-hover:border-blue-100">
                <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <UserGroupIcon className="w-3 h-3" />
                <span className="font-medium">Sec: <span className="text-gray-900 font-bold">{entry.section?.name}</span></span>
            </div>
            <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border border-blue-100">
                {entry.semesters?.length} Sem
            </span>
        </div>
    </div>
));

const SemesterCard = memo(({ sem }) => (
    <Link
        href={route('student.academic.semester.show', {
            semester: sem.semester,
            academicYear: sem.academic_year_id
        })}
        className="group relative bg-white rounded-lg p-3 border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-300"
    >
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${sem.status === 'open'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                    }`}>
                    <DocumentChartBarIcon className="w-4 h-4" />
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            Semester {sem.semester}
                        </h3>
                    </div>
                    <div className="mt-0 flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${sem.status === 'open'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                            {sem.status === 'open' ? 'In Progress' : 'Finalized'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-1 rounded-full bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 transition-colors">
                <ChevronRightIcon className="w-3.5 h-3.5" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100/50">
            <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Average Score</p>
                <p className={`text-base font-black ${sem.status === 'open' ? 'text-green-600' : 'text-blue-700'}`}>
                    {sem.average}
                    <span className="text-[10px] text-gray-400 ml-0.5 font-bold">%</span>
                </p>
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Class Rank</p>
                <div className="flex items-center space-x-1">
                    <TrophyIcon className="w-3 h-3 text-amber-500" />
                    <p className="text-sm font-black text-gray-900">
                        {sem.rank}
                        <span className="text-[9px] font-bold text-gray-400 ml-0.5 tracking-tight">/ {sem.total_students}</span>
                    </p>
                </div>
            </div>
        </div>
    </Link>
));

GradeCard.displayName = 'GradeCard';
SemesterCard.displayName = 'SemesterCard';

export default function SemesterRecordIndex({ student, history = [] }) {
    const [selectedGrade, setSelectedGrade] = useState(null);

    return (
        <StudentLayout>
            <Head title="Academic Journey" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                {selectedGrade && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedGrade(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                                >
                                    <ArrowLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                                </button>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Results for {selectedGrade.grade?.name}
                                </h1>
                            </div>
                            <p className="mt-2 text-gray-600 ml-1">
                                Academic Year {selectedGrade.academic_year?.name}
                            </p>
                        </div>
                    </div>
                )}



                {/* Content Area */}
                {!selectedGrade ? (
                    // Grade Selection View
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center space-x-2 border-l-4 border-blue-600 pl-4 py-1 bg-blue-50/50 rounded-r-lg">
                            <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                            <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">Select Your Grade</h2>
                        </div>
                        {history.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {history.map((entry) => (
                                    <GradeCard key={entry.id} entry={entry} onSelect={setSelectedGrade} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                ) : (
                    // Semester Selection View
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center space-x-2 border-l-4 border-indigo-600 pl-4 py-1 bg-indigo-50/50 rounded-r-lg">
                            <DocumentChartBarIcon className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Select Semester Result</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedGrade.semesters.map((sem, index) => (
                                <SemesterCard key={index} sem={sem} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}

function EmptyState() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentChartBarIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
                We couldn't find any academic records for your account yet. Results and assessments will appear here as soon as they are published by your teachers.
            </p>
        </div>
    );
}
