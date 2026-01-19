import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { CalendarIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, student, semesters }) {
    return (
        <StudentLayout auth={auth}>
            <Head title="Semester Academic Records" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Semester Academic Records</h1>
                    <p className="mt-2 text-gray-600">View your academic performance by semester</p>
                </div>

                {semesters && semesters.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {semesters.map((sem, index) => (
                            <Link
                                key={index}
                                href={route('student.academic.semester.show', {
                                    semester: sem.semester,
                                    academicYear: sem.academic_year_id
                                })}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold">Semester {sem.semester}</h3>
                                            <p className="text-sm text-green-100 mt-1">
                                                {sem.academic_year?.name || 'Academic Year'}
                                            </p>
                                        </div>
                                        <CalendarIcon className="w-10 h-10 opacity-75" />
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    {/* Average Score */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-600">
                                                <ChartBarIcon className="w-5 h-5 mr-2" />
                                                <span className="text-sm font-medium">Semester Average</span>
                                            </div>
                                            <span className="text-3xl font-bold text-green-600">
                                                {sem.average}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Class Rank */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-600">
                                                <TrophyIcon className="w-5 h-5 mr-2" />
                                                <span className="text-sm font-medium">Class Rank</span>
                                            </div>
                                            <span className="text-xl font-bold text-blue-600">
                                                {sem.rank} / {sem.total_students}
                                            </span>
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <div className="mt-6">
                                        <div className="flex items-center justify-end text-green-600 font-semibold group-hover:text-green-700">
                                            <span className="text-sm">View Details</span>
                                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Semester Records</h3>
                        <p className="text-gray-600">
                            Your semester records will appear here once you complete a semester.
                        </p>
                        <Link
                            href={route('student.dashboard')}
                            className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
