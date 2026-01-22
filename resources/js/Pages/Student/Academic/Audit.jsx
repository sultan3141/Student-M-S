import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Audit({ auth, student, gradeHistory }) {
    const [selectedGrade, setSelectedGrade] = useState(0);

    return (
        <StudentLayout auth={auth} title="Grade Audit">
            <Head title="Grade Audit" />

            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Grade Audit</h1>
                    <p className="text-gray-600 mt-2">View your academic history by grade and year</p>
                </div>

                {gradeHistory && gradeHistory.length > 0 ? (
                    <>
                        {/* Grade Selector */}
                        <div className="mb-6">
                            <div className="flex space-x-3 overflow-x-auto pb-2">
                                {gradeHistory.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedGrade(index)}
                                        className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${selectedGrade === index
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {item.grade?.name || 'N/A'} – {item.academic_year?.year || 'N/A'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grade Details */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {gradeHistory[selectedGrade]?.grade?.name || 'N/A'} – Academic Year {gradeHistory[selectedGrade]?.academic_year?.year || 'N/A'}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Section: {gradeHistory[selectedGrade]?.section?.name || 'N/A'}
                                </p>
                            </div>

                            {/* Semester Results */}
                            {gradeHistory[selectedGrade]?.semester_results && gradeHistory[selectedGrade].semester_results.length > 0 ? (
                                <div className="space-y-6">
                                    {gradeHistory[selectedGrade].semester_results.map((semester, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Semester {semester.semester}
                                                </h3>
                                                <div className="flex items-center space-x-6">
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-500">Average</div>
                                                        <div className="text-2xl font-bold text-green-600">
                                                            {semester.average ? `${semester.average}%` : 'N/A'}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-500">Rank</div>
                                                        <div className="text-2xl font-bold text-blue-600">
                                                            {semester.rank || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {semester.teacher_remarks && (
                                                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                                    <p className="text-sm text-blue-900">
                                                        <strong>Teacher Remarks:</strong> {semester.teacher_remarks}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📊</div>
                                    <p>No semester results available for this grade</p>
                                </div>
                            )}

                            {/* Final Result */}
                            {gradeHistory[selectedGrade]?.final_result && (
                                <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Final Summary</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-sm text-gray-600">Combined Average</div>
                                            <div className="text-3xl font-bold text-green-600 mt-1">
                                                {gradeHistory[selectedGrade].final_result.combined_average}%
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-gray-600">Final Rank</div>
                                            <div className="text-3xl font-bold text-blue-600 mt-1">
                                                {gradeHistory[selectedGrade].final_result.final_rank || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-gray-600">Status</div>
                                            <div className={`text-2xl font-bold mt-1 ${gradeHistory[selectedGrade].final_result.promotion_status === 'passed'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}>
                                                {gradeHistory[selectedGrade].final_result.promotion_status === 'passed' ? '✓ Passed' : '✗ Failed'}
                                            </div>
                                        </div>
                                    </div>
                                    {gradeHistory[selectedGrade].final_result.teacher_remarks && (
                                        <div className="mt-4 bg-white border border-gray-200 rounded p-4">
                                            <p className="text-sm text-gray-800">
                                                <strong>Final Remarks:</strong> {gradeHistory[selectedGrade].final_result.teacher_remarks}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Academic History</h3>
                        <p className="text-gray-600">
                            Your academic history will appear here once you complete a full academic year.
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
