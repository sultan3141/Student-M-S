import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SubjectCombination({ grades, subjects, assignments, flash }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([{ id: Date.now(), subject_id: '' }]);

    const { data, setData, post, processing, errors, reset } = useForm({
        grade_id: '',
        section_id: '',
        subject_ids: [],
    });

    const [sections, setSections] = useState([]);

    const handleGradeChange = (e) => {
        const gradeId = e.target.value;
        setData('grade_id', gradeId);

        const selectedGrade = grades.find(g => g.id == gradeId);
        setSections(selectedGrade ? selectedGrade.sections : []);
        setData('section_id', '');
    };

    const addSubjectField = () => {
        const newList = [...selectedSubjects, { id: Date.now(), subject_id: '' }];
        setSelectedSubjects(newList);
        setData('subject_ids', newList.map(s => s.subject_id).filter(id => id !== ''));
    };

    const removeSubjectField = (id) => {
        const newList = selectedSubjects.filter(s => s.id !== id);
        setSelectedSubjects(newList);
        setData('subject_ids', newList.map(s => s.subject_id).filter(id => id !== ''));
    };

    const updateSubject = (id, subjectId) => {
        const newList = selectedSubjects.map(s =>
            s.id === id ? { ...s, subject_id: subjectId } : s
        );
        setSelectedSubjects(newList);
        setData('subject_ids', newList.map(s => s.subject_id).filter(id => id !== ''));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const subjectIds = selectedSubjects
            .map(s => s.subject_id)
            .filter(id => id !== '');

        if (subjectIds.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Use router.post to ensure latest data is sent
        router.post(route('registrar.admission.subject-combination.assign'), {
            grade_id: data.grade_id,
            section_id: data.section_id,
            subject_ids: subjectIds
        }, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedSubjects([{ id: Date.now(), subject_id: '' }]);
                setSections([]);
            }
        });
    };

    const toggleStatus = (id) => {
        router.post(route('registrar.admission.subject-combination.toggle', id), {}, {
            preserveScroll: true
        });
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(route('registrar.admission.subject-combination.destroy', deleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteId(null);
            }
        });
    };

    return (
        <RegistrarLayout>
            <Head title="Subject Combination" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">ADD SUBJECT COMBINATION</h1>
                        <div className="text-sm text-gray-500 mt-1">
                            Subject › Combination
                        </div>
                    </div>

                    {/* Success Message */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-6">Add Subject Combination</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Class */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Class
                                </label>
                                <select
                                    value={data.grade_id}
                                    onChange={handleGradeChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">-- Select Class --</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                                {errors.grade_id && <p className="mt-1 text-sm text-red-600">{errors.grade_id}</p>}
                            </div>

                            {/* Section */}
                            {sections.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Section
                                    </label>
                                    <select
                                        value={data.section_id}
                                        onChange={e => setData('section_id', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">-- Select Section --</option>
                                        {sections.map(section => (
                                            <option key={section.id} value={section.id}>{section.name}</option>
                                        ))}
                                    </select>
                                    {errors.section_id && <p className="mt-1 text-sm text-red-600">{errors.section_id}</p>}
                                </div>
                            )}

                            {/* Dynamic Subject Fields */}
                            {selectedSubjects.map((item, index) => (
                                <div key={item.id} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <select
                                            value={item.subject_id}
                                            onChange={e => updateSubject(item.id, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">-- Select subject --</option>
                                            {subjects.map(subject => (
                                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {index === selectedSubjects.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={addSubjectField}
                                            className="mt-8 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Add More
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => removeSubjectField(item.id)}
                                            className="mt-8 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Assigning...' : 'Assign'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Assignments Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold">Current Subject Assignments</h2>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class and Section</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {assignments && assignments.length > 0 ? (
                                    assignments.map((assignment, index) => (
                                        <tr key={assignment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {assignment.grade_name} Section - {assignment.section_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{assignment.subject_name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${assignment.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {assignment.is_active ? 'Active' : 'In-active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleStatus(assignment.id)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title={assignment.is_active ? 'Deactivate' : 'Activate'}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(assignment.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No subject assignments found. Use the form above to assign subjects to classes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
                            <p className="text-sm text-gray-500 mb-6">Delete This Data?</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Yes, delete it!
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </RegistrarLayout>
    );
}
