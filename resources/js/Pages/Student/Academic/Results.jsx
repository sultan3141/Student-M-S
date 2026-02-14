import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function Results({ auth, marks, student, subjectPerformance, trendData, academicYear }) {
    const [expandedSubject, setExpandedSubject] = useState(null);

    return (
        <StudentLayout auth={auth} title="Academic Records" student={student}>
            <Head title="Academic Records" />

            {/* Performance Trend Chart */}
            {trendData && trendData.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Performance Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} name="Average Score" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Subject-wise Performance Table */}
            {subjectPerformance && subjectPerformance.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
                        <h3 className="font-bold text-lg">📚 Subject-wise Performance</h3>
                        <p className="text-green-100 text-sm mt-1">Your ranking and performance in each subject</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm">
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-left">Subject</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Mark</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectPerformance.map((performance, index) => (
                                    <>
                                        <tr key={performance.subject.id} className="hover:bg-gray-50 transition">
                                            <td className="border-b border-gray-200 px-4 py-3">
                                                <div className="font-semibold text-gray-800">{performance.subject.name}</div>
                                                <div className="text-xs text-gray-500">{performance.subject.code}</div>
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-center">
                                                <span className="font-bold text-lg text-blue-600">{performance.average_score}</span>
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-center">
                                                <button
                                                    onClick={() => setExpandedSubject(expandedSubject === performance.subject.id ? null : performance.subject.id)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                                >
                                                    {expandedSubject === performance.subject.id ? 'Hide Details' : 'View Details'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedSubject === performance.subject.id && (
                                            <tr>
                                                <td colSpan="3" className="bg-gray-50 px-4 py-6">
                                                    <div className="max-w-4xl mx-auto">
                                                        <h4 className="font-bold text-gray-800 mb-4">Assessment Breakdown - {performance.subject.name}</h4>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full bg-white rounded-lg shadow">
                                                                <thead>
                                                                    <tr className="bg-gray-200 text-gray-700 text-sm">
                                                                        <th className="px-4 py-2 text-left">Assessment Type</th>
                                                                        <th className="px-4 py-2 text-center">Semester</th>
                                                                        <th className="px-4 py-2 text-center">Score</th>
                                                                        <th className="px-4 py-2 text-center">Max Score</th>
                                                                        <th className="px-4 py-2 text-center">Percentage</th>
                                                                        <th className="px-4 py-2 text-center">Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {performance.assessments.map((assessment, idx) => (
                                                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                                                            <td className="px-4 py-2 text-sm">{assessment.assessment_type}</td>
                                                                            <td className="px-4 py-2 text-sm text-center">{assessment.semester}</td>
                                                                            <td className="px-4 py-2 text-sm text-center font-bold">{assessment.score}</td>
                                                                            <td className="px-4 py-2 text-sm text-center">{assessment.max_score}</td>
                                                                            <td className="px-4 py-2 text-sm text-center">
                                                                                <span className={`font-semibold ${(assessment.score / assessment.max_score * 100) >= 80 ? 'text-green-600' :
                                                                                    (assessment.score / assessment.max_score * 100) >= 60 ? 'text-blue-600' :
                                                                                        'text-red-600'
                                                                                    }`}>
                                                                                    {((assessment.score / assessment.max_score) * 100).toFixed(1)}%
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-4 py-2 text-sm text-center text-gray-600">{assessment.date}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>

                        {/* Overall Summary Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-t-2 border-gray-200 px-6 py-6">
                            <div className="max-w-2xl mx-auto">
                                <div className="grid grid-cols-2 gap-8 text-center">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Overall Average</div>
                                        <div className="text-4xl font-bold text-green-600">
                                            {subjectPerformance && subjectPerformance.length > 0
                                                ? (subjectPerformance.reduce((sum, p) => sum + parseFloat(p.average_score || 0), 0) / subjectPerformance.length).toFixed(2)
                                                : '0.00'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Rank out of Class</div>
                                        <div className="text-4xl font-bold text-blue-600">
                                            {subjectPerformance && subjectPerformance.length > 0
                                                ? `${subjectPerformance[0]?.rank || 'N/A'} / ${subjectPerformance[0]?.total_students || 'N/A'}`
                                                : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </StudentLayout>
    );
}
