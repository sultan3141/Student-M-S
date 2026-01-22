import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import {
    PlusIcon,
    TrashIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    SparklesIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function CreateAssessment({ sections, subjects, assessmentTypes }) {
    const [assessmentItems, setAssessmentItems] = useState([
        { name: '', max_weight: '', description: '' }
    ]);

    const { data, setData, post, processing, errors, reset } = useForm({
        section_id: '',
        subject_id: '',
        semester: '1',
        assessment_name: '',
        total_weight: 100,
        assessment_items: assessmentItems,
    });

    const addAssessmentItem = () => {
        const newItems = [...assessmentItems, { name: '', max_weight: '', description: '' }];
        setAssessmentItems(newItems);
        setData('assessment_items', newItems);
    };

    const removeAssessmentItem = (index) => {
        const newItems = assessmentItems.filter((_, i) => i !== index);
        setAssessmentItems(newItems);
        setData('assessment_items', newItems);
    };

    const updateAssessmentItem = (index, field, value) => {
        const newItems = [...assessmentItems];
        newItems[index][field] = value;
        setAssessmentItems(newItems);
        setData('assessment_items', newItems);
    };

    const calculateTotalWeight = () => {
        return assessmentItems.reduce((total, item) => {
            return total + (parseFloat(item.max_weight) || 0);
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.custom-assessments.store'), {
            onSuccess: () => {
                reset();
                setAssessmentItems([{ name: '', max_weight: '', description: '' }]);
            },
        });
    };

    return (
        <TeacherLayout>
            <Head title="Create Assessment" />

            {/* Header */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-lg mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                        📝 Create Assessment
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Design your custom assessment structure with multiple components
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="section_id" value="Section" />
                                <select
                                    id="section_id"
                                    value={data.section_id}
                                    onChange={(e) => setData('section_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            {section.full_name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.section_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="subject_id" value="Subject" />
                                <select
                                    id="subject_id"
                                    value={data.subject_id}
                                    onChange={(e) => setData('subject_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.subject_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="assessment_name" value="Assessment Name" />
                                <TextInput
                                    id="assessment_name"
                                    value={data.assessment_name}
                                    onChange={(e) => setData('assessment_name', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Midterm Examination"
                                    required
                                />
                                <InputError message={errors.assessment_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="semester" value="Semester" />
                                <select
                                    id="semester"
                                    value={data.semester}
                                    onChange={(e) => setData('semester', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="1">Semester 1</option>
                                    <option value="2">Semester 2</option>
                                </select>
                                <InputError message={errors.semester} className="mt-2" />
                            </div>
                        </div>

                        {/* Assessment Components */}
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                                    Assessment Components
                                </h3>
                                <button
                                    type="button"
                                    onClick={addAssessmentItem}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                >
                                    <PlusIcon className="w-4 h-4 mr-1" />
                                    Add Component
                                </button>
                            </div>

                            <div className="space-y-4">
                                {assessmentItems.map((item, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">Component {index + 1}</span>
                                            {assessmentItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeAssessmentItem(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <InputLabel value="Component Name" />
                                                <TextInput
                                                    value={item.name}
                                                    onChange={(e) => updateAssessmentItem(index, 'name', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    placeholder="e.g., Test, Project, Assignment"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <InputLabel value="Max Weight" />
                                                <TextInput
                                                    type="number"
                                                    value={item.max_weight}
                                                    onChange={(e) => updateAssessmentItem(index, 'max_weight', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    placeholder="e.g., 30"
                                                    min="1"
                                                    max="100"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <InputLabel value="Description (Optional)" />
                                                <TextInput
                                                    value={item.description}
                                                    onChange={(e) => updateAssessmentItem(index, 'description', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    placeholder="Brief description"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Weight Summary */}
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-900">Total Weight:</span>
                                    <span className={`text-lg font-bold ${calculateTotalWeight() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                                        {calculateTotalWeight()}%
                                    </span>
                                </div>
                                {calculateTotalWeight() !== 100 && (
                                    <p className="text-sm text-red-600 mt-1">
                                        ⚠️ Total weight should equal 100%
                                    </p>
                                )}
                            </div>
                        </div>

                        <InputError message={errors.assessment_items} className="mt-2" />

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                            <SecondaryButton type="button" onClick={() => window.history.back()}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton 
                                type="submit" 
                                disabled={processing || calculateTotalWeight() !== 100}
                            >
                                {processing ? 'Creating...' : 'Create Assessment'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </TeacherLayout>
    );
}