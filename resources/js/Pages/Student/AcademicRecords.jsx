import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function AcademicRecords({ auth, marks, student, subjectPerformance, trendData, academicYear }) {
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
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Average Score</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Grade</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Rank</th>
                                    <th className="border-b-2 border-gray-300 px-4 py-3 text-center">Total Students</th>
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
                                                <span className="font-bold text-lg text-blue-600">{performance.average_score}%</span>
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${performance.grade === 'A' ? 'bg-green-100 text-green-800' :
                                                        performance.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                                            performance.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                                                performance.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                                                                    'bg-red-100 text-red-800'
                                                    }`}>
                                                    {performance.grade}
                                                </span>
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-center">
                                                <div className="flex items-center justify-center space-x-1">
                                                    {performance.rank <= 3 && (
                                                        <span className="text-xl">
                                                            {performance.rank === 1 ? '🥇' : performance.rank === 2 ? '🥈' : '🥉'}
                                                        </span>
                                                    )}
                                                    <span className="font-bold text-gray-700">{performance.rank}</span>
                                                </div>
                                            </td>
                                            <td className="border-b border-gray-200 px-4 py-3 text-center text-gray-600">
                                                {performance.total_students}
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
                                                <td colSpan="6" className="bg-gray-50 px-4 py-6">
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
                    </div>
                </div>
            )}

            {/* Official Transcript Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* University Header */}
                <div className="bg-blue-600 text-white p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">IP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-wide">OFFICE OF THE REGISTRAR</h2>
                </div>

                {/* Program Info */}
                <div className="bg-blue-600 text-white px-8 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-bold">COLLEGE:</span> {student?.grade?.name || 'N/A'}
                        </div>
                        <div className="text-right">
                            <span className="font-bold">ISSUE DATE:</span> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </div>
                        <div>
                            <span className="font-bold">DEPARTMENT:</span> General Studies
                        </div>
                        <div className="text-right">
                            <span className="font-bold">SEMESTER:</span> Current Year
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="bg-blue-600 text-white px-8 py-4 text-center">
                    <h3 className="font-bold text-lg uppercase">COURSE REGISTRATION - ACADEMIC RECORDS</h3>
                </div>

                {/* Student Info */}
                <div className="bg-blue-600 text-white px-8 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-bold">ID NUMBER:</span> {student?.student_id || 'N/A'}
                        </div>
                        <div className="text-right">
                            <span className="font-bold">UID:</span> {student?.id || 'N/A'}
                        </div>
                        <div>
                            <span className="font-bold">NAME:</span> {auth.user.name.toUpperCase()}
                        </div>
                        <div className="text-right">
                            <span className="font-bold">GENDER:</span> {student?.gender || 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Courses Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-blue-600 text-white text-sm">
                                <th className="border border-blue-500 px-4 py-3 text-left">#</th>
                                <th className="border border-blue-500 px-4 py-3 text-left">COURSE TITLE</th>
                                <th className="border border-blue-500 px-4 py-3 text-center">COURSE CODE</th>
                                <th className="border border-blue-500 px-4 py-3 text-center">CREDITS</th>
                                <th className="border border-blue-500 px-4 py-3 text-center">GRADE</th>
                                <th className="border border-blue-500 px-4 py-3 text-center">VALUE</th>
                                <th className="border border-blue-500 px-4 py-3 text-left">INSTRUCTOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marks && marks.length > 0 ? marks.map((mark, index) => (
                                <tr key={mark.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-3 text-sm">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-sm">
                                        <span className="text-blue-600">({mark.subject.code})</span> {mark.subject.name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">{mark.subject.code}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">3</td>
                                    <td className="border border-gray-300 px-4 py-3 text-sm text-center font-bold">
                                        {mark.score_obtained >= 90 ? 'A' :
                                            mark.score_obtained >= 80 ? 'B' :
                                                mark.score_obtained >= 70 ? 'C' :
                                                    mark.score_obtained >= 60 ? 'D' : 'F'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-sm text-center">{mark.score_obtained}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-sm">Instructor Name</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="border border-gray-300 px-4 py-12 text-center text-gray-500">
                                        <div className="text-5xl mb-4">📄</div>
                                        <p className="text-lg">No academic records found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-6 border-t">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            <p className="font-semibold">Islamic Private School Management System</p>
                            <p>Official Academic Transcript</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                            <p>Generated: {new Date().toLocaleDateString()}</p>
                            <p>This is an official document</p>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
