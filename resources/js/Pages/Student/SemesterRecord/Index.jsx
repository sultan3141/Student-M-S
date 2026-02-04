import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { DocumentChartBarIcon, ChevronRightIcon, TrophyIcon, BookOpenIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { memo } from 'react';

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
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-50">
                    <DocumentChartBarIcon className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Semester {sem.semester}
                    </h3>
                    <p className="text-sm font-medium text-gray-400 font-mono tracking-tighter uppercase">{sem.academic_year?.name}</p>
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
                    <p className="text-2xl font-black text-blue-700">{sem.average}</p>
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

SemesterCard.displayName = 'SemesterCard';

export default function SemesterRecordIndex({ student, semesters }) {
    return (
        <StudentLayout>
            <Head title="Semester Records" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Semester Academic Records</h1>
                        <p className="mt-2 text-gray-600">Track your academic journey across all completed semesters</p>
                    </div>
                </div>

                {/* Student Info Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-1 text-white">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 lg:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <IdentificationIcon className="w-6 h-6 text-blue-50" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">Student Name</p>
                                    <p className="font-bold text-lg">{student.user?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <span className="text-lg font-bold font-mono text-blue-50">#</span>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">Student ID</p>
                                    <p className="font-bold text-lg">{student.student_id}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <BookOpenIcon className="w-6 h-6 text-blue-50" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">Grade</p>
                                    <p className="font-bold text-lg">{student.grade?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <DocumentChartBarIcon className="w-6 h-6 text-blue-50" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">Section</p>
                                    <p className="font-bold text-lg">{student.section?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Semesters List */}
                {semesters && semesters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {semesters.map((sem, index) => (
                            <SemesterCard key={index} sem={sem} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DocumentChartBarIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Records Found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            We couldn't find any academic records for your account yet. Results and assessments will appear here as soon as they are published by your teachers.
                        </p>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
