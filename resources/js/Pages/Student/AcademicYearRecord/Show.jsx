import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Show({
    auth,
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
    return (
        <StudentLayout auth={auth}>
            <Head title={`Academic Year ${academic_year?.name}`} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Academic Year Record - {academic_year?.name}
                    </h1>
                    <p className="mt-2 text-gray-600">Combined performance from both semesters</p>
                </div>

                {!is_complete && (
                    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Incomplete Year:</strong> Both semesters must be completed to view final year average and ranking.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Semester Averages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Semester 1 */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Semester 1 Average</h3>
                        {semester1_average !== null ? (
                            <>
                                <p className="text-5xl font-bold text-blue-600">{semester1_average}</p>
                                <p className="text-sm text-gray-500 mt-1">out of 100</p>
                            </>
                        ) : (
                            <p className="text-gray-400 italic">Not completed</p>
                        )}
                    </div>

                    {/* Semester 2 */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Semester 2 Average</h3>
                        {semester2_average !== null ? (
                            <>
                                <p className="text-5xl font-bold text-purple-600">{semester2_average}</p>
                                <p className="text-sm text-gray-500 mt-1">out of 100</p>
                            </>
                        ) : (
                            <p className="text-gray-400 italic">Not completed</p>
                        )}
                    </div>
                </div>

                {/* Final Year Summary */}
                {is_complete && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Final Average */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-lg p-8 border-l-4 border-green-600">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Final Year Average</h3>
                            <p className="text-6xl font-bold text-green-600">{final_average}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Calculated as: (Sem 1 + Sem 2) ÷ 2
                            </p>
                        </div>

                        {/* Final Rank */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Final Year Class Rank</h3>
                            <p className="text-6xl font-bold text-blue-600">
                                {final_rank} <span className="text-3xl text-gray-500">/ {total_students}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">Within your section</p>
                        </div>
                    </div>
                )}

                {/* Subjects Taken */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-4">
                        <h3 className="font-bold text-lg">Subjects Taken This Year</h3>
                        <p className="text-gray-300 text-sm mt-1">All subjects across both semesters</p>
                    </div>
                    <div className="p-6">
                        {subjects && subjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subjects.map((subject, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{subject.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{subject.code}</p>
                                            </div>
                                            <div className="text-green-600">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <span className="font-medium">Teacher:</span> {subject.teacher}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No subjects found for this academic year</p>
                        )}
                    </div>
                </div>

                {/* Footer Notice */}
                <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                <strong>Locked:</strong> Academic year records are locked after year closure and cannot be modified.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
