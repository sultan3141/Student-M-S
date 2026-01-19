import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { PlusIcon, TrashIcon, PencilIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function AssessmentsIndex({ assignments, assessments, totalWeight, studentCount, semester, selectedClass }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        grade_id: selectedClass.grade_id || '',
        section_id: selectedClass.section_id || '',
        subject_id: selectedClass.subject_id || '',
        assessment_type_id: '',
        weight_percentage: '',
        semester: semester || '1',
        due_date: '',
        description: '',
    });

    const handleClassSelection = (gradeId, sectionId, subjectId) => {
        router.get(route('teacher.assessments.index'), {
            grade_id: gradeId,
            section_id: sectionId,
            subject_id: subjectId,
            semester,
        });
    };

    const submitAssessment = (e) => {
        e.preventDefault();
        post(route('teacher.assessments.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                setData({
                    name: '',
                    assessment_type_id: '',
                    weight_percentage: '',
                    due_date: '',
                    description: '',
                });
            },
        });
    };

    const getStatusIcon = (status) => {
        if (status === 'published') return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
        if (status === 'draft') return <ExclamationCircleIcon className="w-5 h-5 text-amber-500" />;
        return <ExclamationCircleIcon className="w-5 h-5 text-gray-400" />;
    };

    const weightRemaining = 100 - totalWeight;

    return (
        <TeacherLayout>
            <Head title="Assessment Setup" />

            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 mb-8">
                <h1 className="text-3xl font-bold">📝 Assessment Setup</h1>
                <p className="text-slate-300 mt-1">Define assessments and their weights for the semester</p>
            </div>

            {/* Class Selector */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Class</h2>
                {/* Simple dropdown or grid for class selection - implement based on assignments */}
                <p className="text-sm text-gray-600">
                    Selected: {selectedClass.grade_id ? `Grade ${selectedClass.grade_id}, Section ${selectedClass.section_id}, Subject ${selectedClass.subject_id}` : 'None'}
                </p>
            </div>

            {selectedClass.grade_id && (
                <>
                    {/* Weight Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Weight Distribution</h3>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Add Assessment
                            </button>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div
                                className={`h-4 rounded-full transition-all ${totalWeight === 100 ? 'bg-green-600' : totalWeight > 100 ? 'bg-red-600' : 'bg-blue-600'}`}
                                style={{ width: `${Math.min(totalWeight, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-center font-medium">
                            {totalWeight}% / 100%
                            {weightRemaining > 0 && <span className="text-amber-600 ml-2">(Need {weightRemaining}% more)</span>}
                            {weightRemaining < 0 && <span className="text-red-600 ml-2">(Over by {Math.abs(weightRemaining)}%)</span>}
                        </p>
                    </div>

                    {/* Assessments Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold">Current Assessments</h3>
                        </div>

                        {assessments.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                No assessments defined yet. Click "Add Assessment" to get started.
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {assessments.map((assessment, index) => (
                                        <tr key={assessment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{assessment.name}</div>
                                                {assessment.due_date && (
                                                    <div className="text-xs text-gray-500">Due: {assessment.due_date}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assessment.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-gray-900">{assessment.weight}%</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(assessment.status)}
                                                    <span className="text-sm capitalize">{assessment.status}</span>
                                                </div>
                                                {assessment.completion > 0 && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {assessment.completion}% complete
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={route('teacher.marks.create', { assessment_id: assessment.id })}
                                                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                                                >
                                                    Enter Marks
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Proceed Button */}
                    {totalWeight === 100 && (
                        <div className="mt-6 flex justify-end">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
                                ✅ All Set - Ready for Mark Entry
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Create Assessment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create New Assessment</h2>

                        <form onSubmit={submitAssessment}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Midterm Exam, Quiz 1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={data.assessment_type_id}
                                        onChange={(e) => setData('assessment_type_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="">Select Type...</option>
                                        {/* Dynamically populate from backend assessment types */}
                                        <option value="1">Exam</option>
                                        <option value="2">Test</option>
                                        <option value="3">Quiz</option>
                                        <option value="4">Assignment</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={data.weight_percentage}
                                        onChange={(e) => setData('weight_percentage', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        rows="3"
                                        placeholder="Enter details about this assessment..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Assessment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </TeacherLayout>
    );
}
