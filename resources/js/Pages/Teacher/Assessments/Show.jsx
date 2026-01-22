import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ShowAssessment({ auth, assessment }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Assessment Details</h2>}
        >
            <Head title={assessment.title} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{assessment.title}</h3>
                                    <p className="text-gray-600 mt-2">{assessment.description}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('assessments.edit', assessment.id)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('marks.upload', assessment.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                                    >
                                        Upload Marks
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Subject</h4>
                                    <p className="mt-2 text-lg font-semibold text-gray-900">{assessment.subject?.name}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Grade</h4>
                                    <p className="mt-2 text-lg font-semibold text-gray-900">{assessment.grade?.name}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Type</h4>
                                    <p className="mt-2 text-lg font-semibold text-gray-900">{assessment.assessment_type}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Max Score</h4>
                                    <p className="mt-2 text-lg font-semibold text-gray-900">{assessment.max_score}</p>
                                </div>
                            </div>

                            {assessment.marks && assessment.marks.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Submitted Marks ({assessment.marks.length})</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Student
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Score
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Percentage
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Remarks
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {assessment.marks.map((mark) => (
                                                    <tr key={mark.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {mark.student?.user?.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {mark.score}/{assessment.max_score}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {((mark.score / assessment.max_score) * 100).toFixed(1)}%
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {mark.remarks || '-'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}