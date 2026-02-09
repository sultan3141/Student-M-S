import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    PlusIcon,
    TrashIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    ClockIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Index({ assessments, error, filters }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this assessment?')) {
            router.delete(route('teacher.assessments-simple.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const clearFilters = () => {
        router.get(route('teacher.assessments-simple.index'));
    };

    // Deduplicate assessments by name, grade, subject, and date
    const uniqueAssessments = assessments?.reduce((acc, assessment) => {
        const key = `${assessment.name}-${assessment.grade?.id}-${assessment.subject?.id}-${assessment.due_date || assessment.date}`;
        if (!acc[key]) {
            acc[key] = assessment;
        }
        return acc;
    }, {});

    const deduplicatedAssessments = uniqueAssessments ? Object.values(uniqueAssessments) : [];

    const isFiltered = filters?.grade_id || filters?.section_id;

    return (
        <TeacherLayout>
            <Head title="Assessments" />

            {/* Clean Professional Header */}
            <div className="bg-white border-b border-gray-200 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                                Assessments
                            </h1>
                            <p className="text-sm text-gray-600">
                                Create and manage student assessments
                            </p>
                        </div>
                        {!error && (
                            <Link
                                href={route('teacher.assessments-simple.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Create Assessment
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AcademicCapIcon className="w-5 h-5 text-red-600" />
                        <div>
                            <h3 className="text-sm font-medium text-red-900">Error</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                ) : deduplicatedAssessments && deduplicatedAssessments.length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Assessment List
                                </h2>
                                {isFiltered && (
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">
                                            Filtered
                                        </span>
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ChartBarIcon className="w-4 h-4" />
                                <span>{deduplicatedAssessments.length} Total</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade & Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {deduplicatedAssessments.map((assessment) => (
                                        <tr key={assessment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {assessment.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{assessment.grade?.name}</div>
                                                <div className="text-xs text-gray-500">{assessment.subject?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <ClockIcon className="w-4 h-4" />
                                                    {new Date(assessment.due_date || assessment.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {assessment.max_score || assessment.total_marks}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded
                                                    ${assessment.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : assessment.status === 'locked'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {assessment.status || 'draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleDelete(assessment.id)}
                                                    className={`p-2 rounded-lg transition-colors
                                                        ${assessment.status === 'locked'
                                                            ? 'text-gray-300 cursor-not-allowed'
                                                            : 'text-red-600 hover:bg-red-50'
                                                        }
                                                    `}
                                                    disabled={assessment.status === 'locked'}
                                                    title="Delete assessment"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <DocumentTextIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessments Found</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            You haven't created any assessments yet.
                        </p>
                        <Link
                            href={route('teacher.assessments-simple.create')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Create Assessment
                        </Link>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
