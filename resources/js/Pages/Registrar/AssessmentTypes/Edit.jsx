import RegistrarLayout from '@/Layouts/RegistrarLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Edit({ assessmentType, grades }) {
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const { data, setData, put, processing, errors } = useForm({
        name: assessmentType.name || '',
        grade_id: assessmentType.grade_id || '',
        section_id: assessmentType.section_id || '',
        subject_id: assessmentType.subject_id || '',
        weight: assessmentType.weight || '',
        description: assessmentType.description || '',
    });

    // Load initial sections and subjects if grade/section are set
    useEffect(() => {
        if (data.grade_id) {
            const selectedGrade = grades.find(g => g.id == data.grade_id);
            setSections(selectedGrade?.sections || []);
        }
        
        if (data.grade_id && data.section_id) {
            loadSubjects(data.grade_id, data.section_id);
        }
    }, []);

    const loadSubjects = async (gradeId, sectionId) => {
        try {
            const response = await fetch(`/registrar/assessment-types/subjects?grade_id=${gradeId}&section_id=${sectionId}`);
            const subjectsData = await response.json();
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleGradeChange = (e) => {
        const gradeId = e.target.value;
        setData('grade_id', gradeId);
        setData('section_id', '');
        setData('subject_id', '');
        setSections([]);
        setSubjects([]);

        if (gradeId) {
            const selectedGrade = grades.find(g => g.id == gradeId);
            setSections(selectedGrade?.sections || []);
        }
    };

    const handleSectionChange = async (e) => {
        const sectionId = e.target.value;
        setData('section_id', sectionId);
        setData('subject_id', '');
        setSubjects([]);

        if (sectionId && data.grade_id) {
            loadSubjects(data.grade_id, sectionId);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('registrar.assessment-types.update', assessmentType.id));
    };

    return (
        <RegistrarLayout>
            <Head title="Edit Assessment Type" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">EDIT ASSESSMENT TYPE</h1>
                            <div className="text-sm text-gray-500 mt-1">
                                Edit › Assessment Type
                            </div>
                        </div>
                        <Link
                            href={route('registrar.assessment-types.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            ← Back
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-6">Edit Assessment Type</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Assessment Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assessment Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Midterm Exam, Final Exam, Quiz 1"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Class Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Class (Grade) <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.grade_id}
                                    onChange={handleGradeChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">-- Select Class --</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                                    ))}
                                </select>
                                {errors.grade_id && <p className="mt-1 text-sm text-red-600">{errors.grade_id}</p>}
                            </div>

                            {/* Section Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.section_id}
                                    onChange={handleSectionChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!data.grade_id || sections.length === 0}
                                    required
                                >
                                    <option value="">-- Select Section --</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>{section.name}</option>
                                    ))}
                                </select>
                                {!data.grade_id && <p className="mt-1 text-xs text-gray-500">Please select a class first</p>}
                                {errors.section_id && <p className="mt-1 text-sm text-red-600">{errors.section_id}</p>}
                            </div>

                            {/* Subject Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.subject_id}
                                    onChange={e => setData('subject_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!data.section_id || subjects.length === 0}
                                    required
                                >
                                    <option value="">-- Select Subject --</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                </select>
                                {!data.section_id && <p className="mt-1 text-xs text-gray-500">Please select a section first</p>}
                                {data.section_id && subjects.length === 0 && <p className="mt-1 text-xs text-orange-500">No subjects found for this section</p>}
                                {errors.subject_id && <p className="mt-1 text-sm text-red-600">{errors.subject_id}</p>}
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Weight (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.weight}
                                    onChange={e => setData('weight', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 30"
                                />
                                <p className="mt-1 text-xs text-gray-500">Percentage weight in final grade calculation</p>
                                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Optional description"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Assessment Type'}
                                </button>
                                <Link
                                    href={route('registrar.assessment-types.index')}
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </RegistrarLayout>
    );
}
