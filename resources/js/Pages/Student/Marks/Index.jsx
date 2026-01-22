import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentMarks({ auth, student, marks, marksBySubject }) {
    const [viewMode, setViewMode] = useState('all'); // 'all' or 'by-subject'

    const getGradeColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600 bg-green-100';
        if (percentage >= 80) return 'text-blue-600 bg-blue-100';
        if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
        if (percentage >= 60) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    const getGradeLetter = (percentage) => {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">My Marks</h2>
                    <Link
                        href={route('student.dashboard')}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="My Marks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Student Info Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{auth.user.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {student.student_id} • {student.grade?.name} - Section {student.section?.name}
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setViewMode('all')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            viewMode === 'all'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        All Marks
                                    </button>
                                    <button
                                        onClick={() => setViewMode('by-subject')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            viewMode === 'by-subject'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        By Subject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {viewMode === 'all' ? (
                        /* All Marks View */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">All Assessment Marks</h3>
                                {marks.data.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Assessment
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Subject
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Score
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Percentage
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Grade
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {marks.data.map((mark) => {
                                                    const percentage = ((mark.score / mark.assessment?.max_score) * 100);
                                                    return (
                                                        <tr key={mark.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {mark.assessment?.title}
                                                                </div>
                                                                {mark.remarks && (
                                                                    <div className="text-xs text-gray-500">
                                                                        {mark.remarks}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {mark.assessment?.subject?.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                    {mark.assessment?.assessment_type}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {mark.score}/{mark.assessment?.max_score}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(percentage)}`}>
                                                                    {percentage.toFixed(1)}%
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-sm font-bold rounded-full ${getGradeColor(percentage)}`}>
                                                                    {getGradeLetter(percentage)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {new Date(mark.created_at).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No marks available yet.</p>
                                        <p className="text-sm text-gray-400 mt-2">Your teachers will upload marks after assessments are completed.</p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {marks.links && (
                                    <div className="mt-6">
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Showing {marks.from} to {marks.to} of {marks.total} results
                                            </div>
                                            <div className="flex space-x-2">
                                                {marks.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-3 py-2 text-sm rounded-md ${
                                                            link.active
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* By Subject View */
                        <div className="space-y-6">
                            {Object.entries(marksBySubject).map(([subjectName, subjectMarks]) => {
                                const avgScore = subjectMarks.reduce((sum, mark) => 
                                    sum + ((mark.score / mark.assessment?.max_score) * 100), 0
                                ) / subjectMarks.length;

                                return (
                                    <div key={subjectName} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-medium text-gray-900">{subjectName}</h3>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">Average</div>
                                                    <div className={`text-lg font-bold ${
                                                        avgScore >= 75 ? 'text-green-600' :
                                                        avgScore >= 50 ? 'text-yellow-600' :
                                                        'text-red-600'
                                                    }`}>
                                                        {avgScore.toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {subjectMarks.map((mark) => {
                                                    const percentage = ((mark.score / mark.assessment?.max_score) * 100);
                                                    return (
                                                        <div key={mark.id} className="border border-gray-200 rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-medium text-gray-900 text-sm">
                                                                    {mark.assessment?.title}
                                                                </h4>
                                                                <span className="text-xs text-gray-500">
                                                                    {mark.assessment?.assessment_type}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <div className="text-lg font-bold text-gray-900">
                                                                    {mark.score}/{mark.assessment?.max_score}
                                                                </div>
                                                                <div className={`text-sm font-medium ${
                                                                    percentage >= 75 ? 'text-green-600' :
                                                                    percentage >= 50 ? 'text-yellow-600' :
                                                                    'text-red-600'
                                                                }`}>
                                                                    {percentage.toFixed(1)}%
                                                                </div>
                                                            </div>
                                                            {mark.remarks && (
                                                                <div className="mt-2 text-xs text-gray-600 italic">
                                                                    "{mark.remarks}"
                                                                </div>
                                                            )}
                                                            <div className="mt-2 text-xs text-gray-500">
                                                                {new Date(mark.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {Object.keys(marksBySubject).length === 0 && (
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-12 text-center">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No marks available yet.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}