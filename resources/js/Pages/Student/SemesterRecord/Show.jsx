import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Show({
    auth,
    student,
    semester,
    academic_year,
    subject_records,
    semester_average,
    rank,
    total_students
}) {
    const [expandedSubject, setExpandedSubject] = useState(null);

    return (
        <StudentLayout auth={auth}>
            <Head title={`Semester ${semester} Record`} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('student.academic.semesters')}
                        className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Semesters
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Semester {semester} - {academic_year?.name}
                    </h1>
                    <p className="mt-2 text-gray-600">Detailed academic record for this semester</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Semester Average */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border-l-4 border-green-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase">Semester Average</p>
                                <p className="text-5xl font-bold text-green-600 mt-2">{semester_average}</p>
                                <p className="text-sm text-gray-500 mt-1">out of 100</p>
                            </div>
                            <div className="text-green-600 opacity-50">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Class Rank */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase">Class Rank</p>
                                <p className="text-5xl font-bold text-blue-600 mt-2">
                                    {rank} <span className="text-2xl text-gray-500">/ {total_students}</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">within your section</p>
                            </div>
                            <div className="text-blue-600 opacity-50">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subjects Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
                        <h3 className="font-bold text-lg">Subject Performance</h3>
                        <p className="text-green-100 text-sm mt-1">Marks and teachers for each subject</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm">
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-left">Subject</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Mark</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Teacher</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subject_records && subject_records.length > 0 ? (
                                    subject_records.map((record, index) => (
                                        <>
                                            <tr key={index} className={`hover:bg-gray-50 transition ${expandedSubject === index ? 'bg-blue-50' : ''}`}>
                                                <td className="border-b border-gray-200 px-4 py-3">
                                                    <div className="font-semibold text-gray-800">{record.subject.name}</div>
                                                    <div className="text-xs text-gray-500">{record.subject.code}</div>
                                                </td>
                                                <td className="border-b border-gray-200 px-4 py-3 text-center">
                                                    <span className={"font-bold text-lg text-blue-600"}>{record.average}</span>
                                                </td>
                                                <td className="border-b border-gray-200 px-4 py-3 text-center text-gray-600">
                                                    {record.teacher}
                                                </td>
                                                <td className="border-b border-gray-200 px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => setExpandedSubject(expandedSubject === index ? null : index)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${expandedSubject === index
                                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                            }`}
                                                    >
                                                        {expandedSubject === index ? (
                                                            <span className="flex items-center">
                                                                Hide <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center">
                                                                Details <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                            </span>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedSubject === index && (
                                                <tr>
                                                    <td colSpan="4" className="bg-gray-50 px-8 py-6 border-b border-gray-200 shadow-inner">
                                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                                                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Assessment Breakdown</h4>
                                                                <span className="text-xs font-medium text-gray-500">{record.subject.name}</span>
                                                            </div>
                                                            <div className="p-0">
                                                                <table className="w-full">
                                                                    <thead className="bg-gray-50">
                                                                        <tr className="text-xs text-gray-500 border-b border-gray-100">
                                                                            <th className="px-4 py-2 text-left">Assessment</th>
                                                                            <th className="px-4 py-2 text-center">Weight</th>
                                                                            <th className="px-4 py-2 text-center">Score</th>
                                                                            <th className="px-4 py-2 text-center">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {record.marks.map((mark, mIdx) => (
                                                                            <tr key={mIdx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                                                                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                                                                    {mark.assessment?.name || mark.assessment_type || 'Assessment'}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-sm text-center text-gray-500">
                                                                                    {mark.assessment?.weight_percentage || 25}%
                                                                                </td>
                                                                                <td className="px-4 py-3 text-center">
                                                                                    <span className="text-base font-bold text-blue-600">
                                                                                        {mark.marks_obtained}
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-400 ml-1">
                                                                                        / {mark.assessment?.max_score || 100}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-center">
                                                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${mark.is_submitted
                                                                                            ? 'bg-green-100 text-green-700'
                                                                                            : 'bg-yellow-100 text-yellow-700'
                                                                                        }`}>
                                                                                        {mark.is_submitted ? 'Submitted' : 'Pending'}
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="bg-blue-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                                                                <span className="text-sm font-semibold text-blue-800">Subject Average</span>
                                                                <span className="text-lg font-bold text-blue-700">{record.average} / 100</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="border-b border-gray-200 px-4 py-12 text-center text-gray-500">
                                            <div className="text-5xl mb-4">📄</div>
                                            <p className="text-lg">No subjects found for this semester</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Read-only Notice */}
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Read-only:</strong> These records are locked and cannot be modified by students.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
