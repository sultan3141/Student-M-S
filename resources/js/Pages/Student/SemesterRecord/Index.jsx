import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { DocumentChartBarIcon, ChevronRightIcon, TrophyIcon, BookOpenIcon, IdentificationIcon, AcademicCapIcon, ArrowLeftIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { memo, useState } from 'react';

const GradeCard = memo(({ entry, onSelect }) => (
    <div
        onClick={() => onSelect(entry)}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transform transition-all hover:scale-[1.02] hover:shadow-lg group cursor-pointer"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <AcademicCapIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {entry.grade?.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-600">
                            {entry.academic_year?.name}
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors border border-gray-200 group-hover:border-blue-200">
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserGroupIcon className="w-4 h-4" />
                <span className="font-medium">Section: <span className="text-gray-900 font-bold">{entry.section?.name}</span></span>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                {entry.semesters?.length} Semester{entry.semesters?.length !== 1 ? 's' : ''}
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
        className="executive-card !p-6 transform transition-all hover:scale-[1.02] group"
    >
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border ${sem.status === 'open'
                    ? 'bg-emerald-50 border-emerald-50'
                    : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-50'
                    }`}>
                    <DocumentChartBarIcon className={`w-7 h-7 ${sem.status === 'open' ? 'text-emerald-600' : 'text-blue-600'}`} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            Semester {sem.semester}
                        </h3>
                        {sem.status === 'open' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                                Active
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{sem.status === 'open' ? 'In Progress' : 'Finalized'}</p>
                </div>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors border border-gray-100 group-hover:border-blue-100 shadow-sm">
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Average Score</p>
                <div className="flex items-baseline space-x-1">
                    <p className={`text-2xl font-black ${sem.status === 'open' ? 'text-emerald-600' : 'text-blue-700'}`}>
                        {sem.average}
                    </p>
                    {sem.status === 'open' && <span className="text-xs text-gray-400">(Prov.)</span>}
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Class Rank</p>
                <div className="flex items-center space-x-2">
                    <TrophyIcon className="w-5 h-5 text-amber-500" />
                    <p className="text-2xl font-black text-gray-900">
                        {sem.rank}
                        <span className="text-xs font-bold text-gray-400 ml-1 tracking-tighter">/ {sem.total_students}</span>
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            {selectedGrade && (
                                <button
                                    onClick={() => setSelectedGrade(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                                >
                                    <ArrowLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                                </button>
                            )}
                            <h1 className="text-3xl font-bold text-gray-900">
                                {selectedGrade ? `Results for ${selectedGrade.grade?.name}` : 'Semester Academic Records'}
                            </h1>
                        </div>
                        <p className="mt-2 text-gray-600 ml-1">
                            {selectedGrade ? `Academic Year ${selectedGrade.academic_year?.name}` : 'Track your academic journey across all grades and semesters'}
                        </p>
                    </div>
                </div>



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
                        <div className="flex items-center space-x-2 border-l-4 border-emerald-600 pl-4 py-1 bg-emerald-50/50 rounded-r-lg">
                            <DocumentChartBarIcon className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Select Semester Result</h2>
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
