import { Head, Link } from '@inertiajs/react';
import ParentLayout from '@/Layouts/ParentLayout';
import { DocumentChartBarIcon, ChevronRightIcon, TrophyIcon, BookOpenIcon, IdentificationIcon, AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { memo, useState } from 'react';

const GradeCard = memo(({ entry, onSelect }) => (
    <div
        onClick={() => onSelect(entry)}
        className="executive-card !p-6 transform transition-all hover:scale-[1.02] group cursor-pointer border-l-4 border-indigo-600 shadow-md"
    >
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-indigo-100">
                    <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {entry.grade?.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 font-mono tracking-tighter uppercase">
                        {entry.academic_year?.name}
                    </p>
                </div>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-indigo-50 transition-colors border border-gray-100 group-hover:border-indigo-100 shadow-sm">
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Section: <span className="text-gray-900 font-bold">{entry.section?.name}</span></span>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {entry.semesters?.length} Semesters
            </span>
        </div>
    </div>
));

const SemesterCard = memo(({ sem, studentId }) => (
    <Link
        href={route('parent.academic.semester.show', {
            studentId: studentId,
            semester: sem.semester,
            academicYear: sem.academic_year_id
        })}
        className="executive-card !p-6 transform transition-all hover:scale-[1.02] group"
    >
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border ${sem.status === 'open'
                    ? 'bg-emerald-50 border-emerald-50'
                    : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-50'
                    }`}>
                    <DocumentChartBarIcon className={`w-7 h-7 ${sem.status === 'open' ? 'text-emerald-600' : 'text-indigo-600'}`} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            Semester {sem.semester}
                        </h3>
                        {sem.status === 'open' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                                Active
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{sem.status === 'open' ? 'Current Results' : 'Finalized Report'}</p>
                </div>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-indigo-50 transition-colors border border-gray-100 group-hover:border-indigo-100 shadow-sm">
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</p>
                <div className="flex items-baseline space-x-1">
                    <p className={`text-2xl font-black ${sem.status === 'open' ? 'text-emerald-600' : 'text-indigo-700'}`}>
                        {sem.average}%
                    </p>
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
        <ParentLayout>
            <Head title={`${student.user?.name}'s Academic Journey`} />

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
                                    <ArrowLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
                                </button>
                            )}
                            <h1 className="text-3xl font-bold text-gray-900">
                                {selectedGrade ? `${selectedGrade.grade?.name} Records` : 'Academic History'}
                            </h1>
                        </div>
                        <p className="mt-2 text-gray-600 ml-1">
                            {selectedGrade ? `Viewing academic performance for ${selectedGrade.academic_year?.name}` : "Review your child's academic progression across all years"}
                        </p>
                    </div>
                </div>

                {/* Student Info Card */}
                <div className={`transition-all duration-500 ${selectedGrade ? 'opacity-90 grayscale-[20%]' : ''}`}>
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl shadow-lg p-1 text-white">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 lg:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-lg shrink-0">
                                        <IdentificationIcon className="w-6 h-6 text-indigo-50" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-widest mb-1">Student</p>
                                        <p className="font-bold text-lg leading-tight">{student.user?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 sm:border-l border-white/10 sm:pl-8">
                                    <div className="p-2 bg-white/20 rounded-lg shrink-0">
                                        <span className="text-lg font-bold font-mono text-indigo-50">#</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-widest mb-1">ID</p>
                                        <p className="font-bold text-lg leading-tight">{student.student_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 sm:border-l border-white/10 sm:pl-8">
                                    <div className="p-2 bg-white/20 rounded-lg shrink-0">
                                        <BookOpenIcon className="w-6 h-6 text-indigo-50" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-widest mb-1">Current</p>
                                        <p className="font-bold text-lg leading-tight">{student.grade?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 sm:border-l border-white/10 sm:pl-8">
                                    <div className="p-2 bg-white/20 rounded-lg shrink-0">
                                        <DocumentChartBarIcon className="w-6 h-6 text-indigo-50" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-indigo-200 uppercase tracking-widest mb-1">Section</p>
                                        <p className="font-bold text-lg leading-tight">{student.section?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Views */}
                {!selectedGrade ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center space-x-2 border-l-4 border-indigo-600 pl-4 py-1 bg-indigo-50/50 rounded-r-lg">
                            <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Academic Progression</h2>
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
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center space-x-2 border-l-4 border-emerald-600 pl-4 py-1 bg-emerald-50/50 rounded-r-lg">
                            <DocumentChartBarIcon className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Select Semester</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedGrade.semesters.map((sem, index) => (
                                <SemesterCard key={index} sem={sem} studentId={student.id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ParentLayout>
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
                We couldn't find any completed semester records for this student yet. Check back later once exams are concluded.
            </p>
        </div>
    );
}
